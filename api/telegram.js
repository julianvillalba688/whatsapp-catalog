let pendingOrders = {};

export default async function handler(req, res) {
  console.log("TELEGRAM_WEBHOOK_HIT", { method: req.method, query: req.query });

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Bot activo" });
  }

  if (req.query.secret !== process.env.BOT_SECRET) {
    console.log("BOT_SECRET_INVALID", { received: req.query.secret ? "present" : "missing" });
    return res.status(401).json({ error: "No autorizado" });
  }

  const update = req.body;
  if (!update || !update.message) return res.status(200).send("No message");

  const chatId = update.message.chat.id;
  const text = update.message.text || "";
  console.log("text recibido", text);

  const send = async (msg) => {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" })
    });
  };

  try {
    const prodRes = await fetch(process.env.PRODUCTS_URL);
    const allProducts = await prodRes.json();
    const products = allProducts.filter(p => p.status === "disponible" && p.stock > 0);
    const productsSummary = products.map(p => ({ 
      sku: p.sku, 
      name: p.name, 
      price: p.price, 
      salePrice: p.salePrice, 
      stock: p.stock, 
      status: p.status 
    }));

    const textLower = text.toLowerCase().trim();
    const isConfirm = ["si", "sí", "ok", "confirmar", "confirmado", "listo", "registrar", "guardar"].includes(textLower);
    const isCancel = ["cancelar", "borrar", "no"].includes(textLower);

    if (isConfirm && pendingOrders[chatId]) {
      const order = pendingOrders[chatId];
      const appsRes = await fetch(process.env.APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ token: process.env.APPS_SCRIPT_TOKEN, ...order })
      });
      const appsResult = await appsRes.text();
      console.log("Apps Script response", appsResult);
      delete pendingOrders[chatId];
      return send("✅ <b>Pedido registrado en Google Sheets.</b>");
    }

    if (isCancel) {
      delete pendingOrders[chatId];
      return send("Pedido cancelado.");
    }

    const aiData = await callAIForOrderExtraction(text, productsSummary);
    console.log("IA raw response", aiData.raw);
    console.log("parsed JSON", aiData.json);

    const ext = aiData.json;

    if (ext.intencion === "saludo") return send("¡Hola! Soy el asistente de Salem Store. ¿En qué puedo ayudarte con tu pedido?");
    if (ext.intencion === "cancelar") {
      delete pendingOrders[chatId];
      return send("Pedido cancelado.");
    }

    const found = [];
    const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, " ").trim();

    if (ext.productosSolicitados && Array.isArray(ext.productosSolicitados)) {
      ext.productosSolicitados.forEach((reqP, idx) => {
        const sn = norm(reqP);
        const p = products.find(i => norm(i.name).includes(sn) || norm(i.sku) === sn);
        if (p) {
          const qty = (ext.cantidades && ext.cantidades[idx]) || 1;
          const up = ext.precioPersonalizado || (p.salePrice > 0 ? p.salePrice : p.price);
          found.push({ 
            name: p.name, 
            sku: p.sku, 
            qty, 
            up, 
            tp: ext.precioPersonalizado ? "Manual" : (p.salePrice > 0 ? "Oferta" : "Base"), 
            sub: up * qty 
          });
        }
      });
    }

    console.log("productos encontrados", found);

    if (found.length === 0 && ext.intencion === "nuevo_pedido") {
      return send("No encontré esos productos en el catálogo disponible. ¿Podrías verificar el nombre o SKU?");
    }

    const subtotal = found.reduce((a, b) => a + b.sub, 0);
    const currentOrder = {
      cliente: ext.cliente || (pendingOrders[chatId]?.cliente) || "",
      productos: found.map(i => i.name).join(", "),
      skus: found.map(i => i.sku).join(", "),
      cantidades: found.map(i => i.qty).join(", "),
      preciosUnitarios: found.map(i => i.up).join(", "),
      subtotalCatalogo: subtotal,
      subtotal: subtotal,
      totalManual: ext.totalManual || 0,
      direccion: ext.direccion || (pendingOrders[chatId]?.direccion) || "",
      pago: ext.pago || (pendingOrders[chatId]?.pago) || "",
      estado: ext.estado || "Pendiente",
      textoOriginal: text,
      telegram: update.message.from.username || update.message.from.first_name
    };

    if (found.length > 0) {
      pendingOrders[chatId] = currentOrder;
      console.log("pending order", pendingOrders[chatId]);
    }

    if (ext.faltantes && ext.faltantes.length > 0 && found.length > 0) {
      return send(`He tomado nota de los productos, pero falta: <b>${ext.faltantes.join(", ")}</b>. Por favor complétalo.`);
    }

    if (found.length > 0) {
      let resMsg = `📋 <b>Resumen del Pedido:</b>\n\n`;
      found.forEach(i => resMsg += `• ${i.qty}x ${i.name} (${i.sku}) - $${i.up.toLocaleString()}\n`);
      resMsg += `\n<b>Total:</b> $${(currentOrder.totalManual || subtotal).toLocaleString()}\n`;
      resMsg += `<b>Cliente:</b> ${currentOrder.cliente || "<i>Pendiente</i>"}\n`;
      resMsg += `<b>Dirección:</b> ${currentOrder.direccion || "<i>Pendiente</i>"}\n`;
      resMsg += `<b>Pago:</b> ${currentOrder.pago || "<i>Pendiente</i>"}\n\n`;
      
      if (!currentOrder.cliente || !currentOrder.direccion || !currentOrder.pago) {
        resMsg += `Faltan datos. Por favor indícalos para finalizar.`;
      } else {
        resMsg += `¿Confirmas el pedido? Responde <b>"Sí"</b> o <b>"Cancelar"</b>.`;
      }
      return send(resMsg);
    }

    return send("No entendí tu solicitud. Puedes decirme qué productos deseas y tus datos de entrega.");

  } catch (err) {
    console.error("error stack", err.stack);
    send("Error interno: " + err.message);
    res.status(500).json({ error: err.message });
  }
}

async function callAIForOrderExtraction(text, productsSummary) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt = `Eres extractor de pedidos para Salem Store. Devuelve solo JSON válido. No inventes productos. Si no estás seguro, marca faltantes. Usa español. Detecta precios colombianos con punto o coma.
  
  Catálogo: ${JSON.stringify(productsSummary)}
  
  Mensaje: "${text}"
  
  JSON schema:
  {
    "cliente": string,
    "productosSolicitados": [string],
    "cantidades": [number],
    "precioPersonalizado": number,
    "totalManual": number,
    "direccion": string,
    "pago": string,
    "estado": string,
    "intencion": "nuevo_pedido" | "confirmar_pedido" | "cancelar" | "consulta_producto" | "saludo" | "otro",
    "faltantes": [string]
  }`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.choices[0].message.content;
  return { raw, json: JSON.parse(raw) };
}
