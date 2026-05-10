export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Bot activo" });
  }

  const { secret } = req.query;
  if (secret !== process.env.BOT_SECRET) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const update = req.body;
  if (!update || !update.message) return res.status(200).send("No message");

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  const send = async (msg) => {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" })
    });
  };

  if (text.startsWith("/start")) {
    return send("<b>Ejemplo de uso:</b>\n\n2 Anillo Aurora\n3 RR1604\nPedido de Laura\nDirección: Calle 123\nPago: Nequi\nTotal 50000");
  }

  try {
    const prodRes = await fetch(process.env.PRODUCTS_URL);
    const allProducts = await prodRes.json();
    const products = allProducts.filter(p => p.status === "disponible" && p.stock > 0);

    const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, " ").trim();

    // Extraer datos generales
    const totalMatch = text.match(/(?:total|queda en|por todo|total:)\s*(\d+)/i);
    const totalManual = totalMatch ? parseInt(totalMatch[1]) : 0;

    const clientMatch = text.match(/(?:pedido de|pedido para|cliente:)\s*([^\n]+)/i);
    const client = clientMatch ? clientMatch[1].trim() : "Desconocido";

    const payMatch = text.match(/(nequi|daviplata|efectivo|transferencia|tarjeta)/i);
    const payment = payMatch ? payMatch[1] : "Pendiente";

    const dirMatch = text.match(/(?:dirección|dir|entrega en|calle|carrera|barrio|casa|apartamento)\s*[:]?\s*([^\n]+)/i);
    const address = dirMatch ? dirMatch[1].trim() : "No especificada";

    const found = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (!line.trim() || /pedido|total|cliente|pago|dir|entrega/.test(line.toLowerCase())) continue;

      let qty = 1;
      let part = line.trim();
      
      // Cantidad al inicio
      const qm = part.match(/^(\d+)\s+(.+)/);
      if (qm) { 
        qty = parseInt(qm[1]); 
        part = qm[2].trim(); 
      }

      // Precio manual al final
      let customPrice = null;
      const pm = part.match(/(.+)\s+(\d+)$/);
      if (pm) { 
        part = pm[1].trim(); 
        customPrice = parseInt(pm[2]); 
      }

      const sn = norm(part);
      if (!sn) continue;

      const p = products.find(i => norm(i.name).includes(sn) || norm(i.sku) === sn);

      if (p) {
        const up = customPrice || (p.salePrice > 0 ? p.salePrice : p.price);
        found.push({ 
          name: p.name, 
          sku: p.sku, 
          qty, 
          up, 
          tp: customPrice ? "Manual" : (p.salePrice > 0 ? "Oferta" : "Base"), 
          sub: up * qty 
        });
      }
    }

    if (!found.length) {
      return send("No encontré productos. Escribe nombre exacto o SKU.");
    }

    const subCat = found.reduce((a, b) => a + b.sub, 0);
    const finalTotal = totalManual || subCat;

    // Guardar en Apps Script
    await fetch(process.env.APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        token: process.env.APPS_SCRIPT_TOKEN,
        cliente: client,
        telegram: update.message.from.username || update.message.from.first_name,
        productos: found.map(i => i.name).join(", "),
        skus: found.map(i => i.sku).join(", "),
        cantidades: found.map(i => i.qty).join(", "),
        preciosUnitarios: found.map(i => i.up).join(", "),
        tipoPrecio: found.map(i => i.tp).join(", "),
        subtotalCatalogo: subCat,
        subtotal: subCat,
        totalManual: totalManual,
        direccion: address,
        pago: payment,
        estado: "Pendiente",
        textoOriginal: text
      })
    });

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
    console.error(e);
    await send("Error procesando pedido: " + e.message);
    res.status(500).json({ error: e.message });
  }
}
