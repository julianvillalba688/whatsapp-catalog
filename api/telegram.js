export default async function handler(req, res) {
  console.log("TELEGRAM_WEBHOOK_HIT", {
    method: req.method,
    query: req.query,
    body: JSON.stringify(req.body)
  });

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Bot activo" });
  }

  // Validaciones de entorno
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("Missing TELEGRAM_BOT_TOKEN");
    return res.status(500).json({ error: "Missing TELEGRAM_BOT_TOKEN" });
  }
  if (!process.env.PRODUCTS_URL) {
    console.error("Missing PRODUCTS_URL");
    return res.status(500).json({ error: "Missing PRODUCTS_URL" });
  }
  if (!process.env.APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_TOKEN) {
    console.error("Missing Apps Script config");
    return res.status(500).json({ error: "Missing Apps Script config" });
  }

  const { secret } = req.query;
  if (secret !== process.env.BOT_SECRET) {
    console.log("BOT_SECRET_INVALID", {
      expectedExists: Boolean(process.env.BOT_SECRET),
      received: secret ? "present" : "missing"
    });
    return res.status(401).json({ error: "No autorizado" });
  }

  const update = req.body;
  if (!update || !update.message) return res.status(200).send("No message");

  const chatId = update.message.chat.id;
  const text = update.message.text || "";
  console.log("MESSAGE_RECEIVED", { chatId, text });

  const send = async (msg) => {
    try {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" })
      });
    } catch (e) {
      console.error("TELEGRAM_SEND_ERROR", e);
    }
  };

  if (text.startsWith("/start")) {
    return send("<b>Ejemplo de uso:</b>\n\n2 Anillo Aurora\n3 RR1604\nPedido de Laura\nDirección: Calle 123\nPago: Nequi\nTotal 50000");
  }

  try {
    const prodRes = await fetch(process.env.PRODUCTS_URL);
    const allProducts = await prodRes.json();
    const products = allProducts.filter(p => p.status === "disponible" && p.stock > 0);
    console.log("PRODUCTS_LOADED", { count: products.length });

    const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();

    // Extraer datos generales mejorado para lenguaje natural
    // Cliente
    const clientMatch = text.match(/(?:pedido de|pedido para|cliente:|([a-z]+)\s+pidio)/i);
    let client = "Desconocido";
    if (clientMatch) {
      client = (clientMatch[1] || clientMatch[0].replace(/pedido de|pedido para|cliente:/i, "")).trim();
    }

    // Precio manual / Total
    const totalMatch = text.match(/(?:total|queda en|por todo|total:|por|precio:)\s*(\d+[\.\d+]*)/i);
    let totalManual = 0;
    if (totalMatch) {
      totalManual = parseInt(totalMatch[1].replace(/\./g, ""));
    }

    // Pago
    const payMatch = text.match(/(nequi|daviplata|efectivo|transferencia|tarjeta)/i);
    const payment = payMatch ? payMatch[1] : "Pendiente";

    // Estado
    const statusMatch = text.match(/(?:estado:?)\s*([a-z]+)/i);
    const estado = statusMatch ? statusMatch[1] : "Pendiente";

    // Dirección
    const dirMatch = text.match(/(?:dirección|dir|entrega en|calle|carrera|barrio|casa|apartamento|direccion:?)\s*([^\n,]+)/i);
    const address = dirMatch ? dirMatch[0].replace(/dirección|dir|entrega en|direccion/i, "").replace(/^[:\s]+/, "").trim() : "No especificada";

    const found = [];
    const textNorm = norm(text);

    // Búsqueda inteligente de productos
    for (const p of products) {
      const nameNorm = norm(p.name);
      const skuNorm = norm(p.sku);
      
      // Si el nombre o SKU normalizado está en el texto normalizado
      if (textNorm.includes(nameNorm) || (skuNorm && textNorm.includes(skuNorm))) {
        // Intentar extraer cantidad cerca
        let qty = 1;
        const qtyRegex = new RegExp(`(\\d+)\\s*(?:un|x)?\\s*${nameNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "i");
        const qm = textNorm.match(qtyRegex);
        if (qm) qty = parseInt(qm[1]);

        const up = (p.salePrice > 0 ? p.salePrice : p.price);
        found.push({ 
          name: p.name, 
          sku: p.sku, 
          qty, 
          up, 
          tp: (p.salePrice > 0 ? "Oferta" : "Base"), 
          sub: up * qty 
        });
      }
    }

    console.log("PRODUCTS_FOUND", { found: found.map(f => f.name) });

    if (!found.length) {
      return send("No encontré productos. Escribe nombre exacto o SKU.");
    }

    const subCat = found.reduce((a, b) => a + b.sub, 0);
    const finalTotal = totalManual || subCat;
    const typePrice = totalManual ? "Manual" : found[0].tp;

    const payload = {
      token: process.env.APPS_SCRIPT_TOKEN,
      cliente: client,
      telegram: update.message.from.username || update.message.from.first_name,
      productos: found.map(i => i.name).join(", "),
      skus: found.map(i => i.sku).join(", "),
      cantidades: found.map(i => i.qty).join(", "),
      preciosUnitarios: found.map(i => i.up).join(", "),
      tipoPrice: typePrice, // Corregido según estructura Sheets
      tipoPrecio: typePrice,
      subtotalCatalogo: subCat,
      subtotal: subCat,
      totalManual: totalManual,
      direccion: address,
      pago: payment,
      estado: estado,
      textoOriginal: text
    };

    console.log("APPS_SCRIPT_PAYLOAD", payload);

    try {
      const appsRes = await fetch(process.env.APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const appsText = await appsRes.text();
      console.log("APPS_SCRIPT_RESPONSE", appsText);
    } catch (sheetErr) {
      console.error("SHEETS_SAVE_ERROR", sheetErr);
      await send(`Encontré producto, pero falló guardado en Sheets: ${sheetErr.message}`);
      return res.status(500).json({ error: sheetErr.message });
    }

    // Responder
    let resMsg = `✅ <b>Pedido registrado</b>\n\n`;
    found.forEach(i => {
      resMsg += `• ${i.qty}x ${i.name} (${i.sku}) - $${i.up.toLocaleString()}\n`;
    });
    resMsg += `\n<b>Total:</b> $${finalTotal.toLocaleString()}\n`;
    resMsg += `<b>Cliente:</b> ${client}\n`;
    resMsg += `<b>Dirección:</b> ${address}\n`;
    resMsg += `<b>Pago:</b> ${payment}`;

    await send(resMsg);
    res.status(200).json({ ok: true });

  } catch (e) {
    console.error("GENERAL_ERROR", e.stack);
    await send("Error procesando pedido: " + e.message);
    res.status(500).json({ error: e.message });
  }
}
