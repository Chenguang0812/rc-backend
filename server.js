const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Resend } = require("resend");

const app = express();
const port = process.env.PORT || 3000;

// ✅ 請填入你的 Resend API 金鑰
const resend = new Resend("re_599kJQac_Bp9sV2bGiGzyXEMGceq4N2pg");

// ✅ Discord Webhook
const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/你的ID/你的TOKEN";

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("RC Backend 正常運作");
});

app.post("/", async (req, res) => {
    const data = req.body;

    const content = `📨 有人填了 RC 帝國報名表！\n` +
        `姓名：**${data.name}**\n` +
        `年齡：${data.age}\n` +
        `性別：${data.gender}\n` +
        `技能：${(data.skills || []).join(", ")}\n` +
        `職位：${data.position}\n` +
        `每週上線時間：${data.availableTime}\n` +
        `聯絡方式：${data.contact}\n` +
        `問題：${data.questions || "無"}\n`;

    try {
        // ✅ 傳送 Discord 通知
        await axios.post(DISCORD_WEBHOOK_URL, { content });
        console.log("✅ Discord 通知已送出");

        // ✅ 寄 Email 給你自己
        await resend.emails.send({
            from: "RC 帝國通知 <onboarding@resend.dev>", // 寄件人
            to: "roalxfreefire@gmail.com",
            subject: `RC帝國報名通知：${data.name}`,
            html: `<h3>有人提交報名表：</h3><pre>${JSON.stringify(data, null, 2)}</pre>`,
        });
        console.log("✅ Email 已寄出");

        res.status(200).json({ message: "已提交，通知已送出。" });
    } catch (err) {
        console.error("❌ 發送通知失敗：", err.message);
        res.status(500).json({ error: "通知發送失敗" });
    }
});

app.listen(port, () => {
    console.log(`RC 後端伺服器運行中： http://localhost:${port}`);
});
