let pendingOrders = {};

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function safeSendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("safeSendTelegram: No TELEGRAM_BOT_TOKEN");
    return false;
  }
  try {
    const res = await fetchWithTimeout(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" })
    }, 8000);
    const data = await res.json();
    console.log("TELEGRAM_RESPONSE_STATUS", res.status);
    console.log("TELEGRAM_RESPONSE_BODY", JSON.stringify(data));
    return res.ok;
  } catch (e) {
    console.error("safeSendTelegram ERROR:", e.message);
    return false;
  }
}

async function callGemini(text, productsSummary) {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    })
  }, 12000);

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return { raw, json: JSON.parse(raw) };
}

export default async function handler(req, res) {
  console.log("TELEGRAM_WEBHOOK_HIT");
  console.log("method", req.method);
  console.log("queryKeys", Object.keys(req.query || {}));

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Bot activo" });
  }

  const message = req.body?.message;
  const chatId = message?.chat?.id;
  const text = message?.text || "";
  console.log("bodyText", text);

  try {
    // Secret validation
    if (req.query.secret !== process.env.BOT_SECRET) {
      console.log("BOT_SECRET_INVALID");
      return res.status(200).json({ ok: false, error: "BOT_SECRET_INVALID" });
    }

    if (!message || !text) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    // /start early
    if (text === "/start") {
      await safeSendTelegram(chatId, "Bot activo. Envíame un pedido.");
      return res.status(200).json({ ok: true });
    }

    // Commands
    if (text === "/debug") {
      const debugMsg = [
        `TELEGRAM_BOT_TOKEN: ${!!process.env.TELEGRAM_BOT_TOKEN}`,
        `BOT_SECRET: ${!!process.env.BOT_SECRET}`,
        `PRODUCTS_URL: ${!!process.env.PRODUCTS_URL}`,
        `APPS_SCRIPT_URL: ${!!process.env.APPS_SCRIPT_URL}`,
        `APPS_SCRIPT_TOKEN: ${!!process.env.APPS_SCRIPT_TOKEN}`,
        `GEMINI_API_KEY: ${!!process.env.GEMINI_API_KEY}`
      ].join("\n");
      await safeSendTelegram(chatId, debugMsg);
      return res.status(200).json({ ok: true });
    }

    if (text === "/testtelegram") {
      await safeSendTelegram(chatId, "Telegram OK");
      return res.status(200).json({ ok: true });
    }

    if (text === "/testproductos") {
      try {
        const pRes = await fetchWithTimeout(process.env.PRODUCTS_URL, {}, 8000);
        const pData = await pRes.json();
        await safeSendTelegram(chatId, `Productos OK: ${pData.length}`);
      } catch (e) {
        await safeSendTelegram(chatId, `Productos ERROR: ${e.message}`);
      }
      return res.status(200).json({ ok: true });
    }

    if (text === "/testgemini") {
      try {
        const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const gRes = await fetchWithTimeout(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: "Responde solo: OK" }] }] })
        }, 12000);
        const gData = await gRes.json();
        const responseText = gData.candidates?.[0]?.content?.parts?.[0]?.text || "No content";
        await safeSendTelegram(chatId, `Gemini OK: ${responseText.trim()}`);
      } catch (e) {
        await safeSendTelegram(chatId, `Gemini ERROR: ${e.message}`);
      }
      return res.status(200).json({ ok: true });
    }

    if (text === "/testsheets") {
      try {
        const sRes = await fetchWithTimeout(process.env.APPS_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({ token: process.env.APPS_SCRIPT_TOKEN, test: true, cliente: "TEST_BOT" })
        }, 12000);
        const sText = await sRes.text();
        await safeSendTelegram(chatId, `Sheets OK: ${sText}`);
      } catch (e) {
        await safeSendTelegram(chatId, `Sheets ERROR: ${e.message}`);
      }
      return res.status(200).json({ ok: true });
    }

    // Logic for orders
    const textLower = text.toLowerCase().trim();
    const isConfirm = ["si", "sí", "ok", "confirmar", "confirmado", "listo", "registrar", "guardar"].includes(textLower);
    const isCancel = ["cancelar", "borrar", "no"].includes(textLower);

    if (isConfirm && pendingOrders[chatId]) {
      try {
        const order = pendingOrders[chatId];
        await fetchWithTimeout(process.env.APPS_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({ token: process.env.APPS_SCRIPT_TOKEN, ...order })
        }, 12000);
        delete pendingOrders[chatId];
        await safeSendTelegram(chatId, "✅ <b>Pedido registrado exitosamente.</b>");
      } catch (e) {
        await safeSendTelegram(chatId, `Error al guardar en Sheets: ${e.message}`);
      }
      return res.status(200).json({ ok: true });
    }

    if (isCancel) {
      delete pendingOrders[chatId];
      await safeSendTelegram(chatId, "Pedido cancelado.");
      return res.status(200).json({ ok: true });
    }

    // AI Flow
    try {
      const prodRes = await fetchWithTimeout(process.env.PRODUCTS_URL, {}, 8000);
      const allProducts = await prodRes.json();
      const products = allProducts.filter(p => p.status === "disponible" && p.stock > 0);
      const productsSummary = products.map(p => ({ sku: p.sku, name: p.name, price: p.price, salePrice: p.salePrice }));

      const aiData = await callGemini(text, productsSummary);
      console.log("Gemini raw response", aiData.raw);
      const ext = aiData.json;
      console.log("parsed JSON", JSON.stringify(ext));

      if (ext.intencion === "saludo") {
        await safeSendTelegram(chatId, "¡Hola! Soy el asistente de Salem Store. ¿Qué deseas pedir hoy?");
        return res.status(200).json({ ok: true });
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
            found.push({ name: p.name, sku: p.sku, qty, up, tp: ext.precioPersonalizado ? "Manual" : (p.salePrice > 0 ? "Oferta" : "Base"), sub: up * qty });
          }
        });
      }
      console.log("productos encontrados", found.length);

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
        telegram: message.from.username || message.from.first_name
      };

      if (found.length > 0) {
        pendingOrders[chatId] = currentOrder;
        let resMsg = `📋 <b>Resumen del Pedido:</b>\n\n`;
        found.forEach(i => resMsg += `• ${i.qty}x ${i.name} (${i.sku}) - $${i.up.toLocaleString()}\n`);
        resMsg += `\n<b>Total:</b> $${(currentOrder.totalManual || subtotal).toLocaleString()}\n`;
        resMsg += `<b>Cliente:</b> ${currentOrder.cliente || "<i>Pendiente</i>"}\n`;
        resMsg += `<b>Dirección:</b> ${currentOrder.direccion || "<i>Pendiente</i>"}\n`;
        resMsg += `<b>Pago:</b> ${currentOrder.pago || "<i>Pendiente</i>"}\n\n`;
        
        if (!currentOrder.cliente || !currentOrder.direccion || !currentOrder.pago) {
          resMsg += `Faltan datos (<i>${ext.faltantes?.join(", ") || "datos"}</i>). Por favor complétalo.`;
        } else {
          resMsg += `¿Confirmas el pedido? Responde <b>"Sí"</b> o <b>"Cancelar"</b>.`;
        }
        await safeSendTelegram(chatId, resMsg);
      } else {
        await safeSendTelegram(chatId, "No encontré productos. Escribe nombre exacto o SKU.");
      }

    } catch (e) {
      console.error("AI_FLOW_ERROR", e.message);
      await safeSendTelegram(chatId, `Error en proceso de IA: ${e.message}`);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("WEBHOOK_FATAL_ERROR", err.stack || err);
    if (chatId) await safeSendTelegram(chatId, "Error crítico del bot. Revisa logs.");
    return res.status(200).json({ ok: false, error: String(err.message || err) });
  }
}
