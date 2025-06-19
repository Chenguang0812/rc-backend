// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Webhook middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ 將這裡換成你的 Discord Webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1385327739871035554/LTXJBXNeWy2VHtVKDSITyMK4d1A0Y4dvYHgJMdeuRaxKMcVG6t8Ft4VbQ_zuMNGDSQzo";

app.get("/", (req, res) => {
    res.send("RC Backend 運作正常");
});

app.post("/", async (req, res) => {
    const data = req.body;

    const content = `📨 有人填了 RC 帝國報名表！\n` +
        `👤 姓名：**${data.name}**\n` +
        `🎂 年齡：${data.age}\n` +
        `⚧️ 性別：${data.gender}\n` +
        `🛠 技能：${(data.skills || []).join(", ")}\n` +
        `🎯 職位：${data.position}\n` +
        `🕒 每週上線時間：${data.availableTime}\n` +
        `📬 聯絡方式：${data.contact}\n` +
        `💬 問題：${data.questions || "無"}\n`;

    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            content,
        });

        console.log("✅ Discord 通知已送出");
        res.status(200).json({ message: "提交成功，已發送通知。" });
    } catch (err) {
        console.error("❌ Discord 發送失敗:", err.message);
        res.status(500).json({ error: "通知發送失敗" });
    }
});

app.listen(port, () => {
    console.log(`✅ RC 表單後端伺服器啟動於 http://localhost:${port}`);
});
