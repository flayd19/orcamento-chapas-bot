const express = require("express");
const app = express();
app.use(express.json());

const precosPorLargura = {
  10: 3.60, 15: 5.30, 20: 7.15, 25: 8.85, 30: 10.60,
  35: 12.40, 40: 14.25, 45: 15.95, 50: 17.80,
  60: 21.35, 65: 23.00, 70: 24.80, 80: 28.30,
  90: 32.40, 100: 35.50, 120: 42.50
};

app.post("/webhook", (req, res) => {
  const msg = req.body.message.body.toLowerCase().replace(",", ".");

  if (msg.includes("chapa")) {
    const regex = /chapa\s+(\d+)\s+([\d.]+)\s*mt/g;
    let match, totalGeral = 0;
    let resposta = "✅ *Orçamento de Chapas:*\n\n";

    while ((match = regex.exec(msg)) !== null) {
      const largura = parseInt(match[1]);
      const quantidade = parseFloat(match[2]);
      if (!precosPorLargura[largura]) {
        resposta += `❌ Largura ${largura}cm não cadastrada.\n\n`;
        continue;
      }
      const preco = precosPorLargura[largura];
      const total = preco * quantidade;
      totalGeral += total;
      resposta += `🔹 Chapa ${largura} cm – ${quantidade.toFixed(2)} metros\n`;
      resposta += `💲 R$ ${preco.toFixed(2)} x ${quantidade.toFixed(2)} = R$ ${total.toFixed(2)}\n\n`;
    }

    resposta += `🧮 *TOTAL: R$ ${totalGeral.toFixed(2)}*`;
    return res.send({ response: resposta.trim() });
  }

  res.send({ response: "Envie no formato:\n\nchapa 25 8,70mt chapa 30 5,50mt" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Bot rodando!");
});
