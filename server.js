const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Resend } = require("resend");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Resend API 金鑰（建議用 .env 管理）
const resend = new Resend("re_599kJQac_Bp9sV2bGiGzyXEMGceq4N2pg");

// ✅ Discord Webhook（請換成你的實際 Webhook）
const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1385327739871035554/LTXJBXNeWy2VHtVKDSITyMK4d1A0Y4dvYHgJMdeuRaxKMcVG6t8Ft4VbQ_zuMNGDSQzo";

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
        // ✅ Discord 通知
        await axios.post(DISCORD_WEBHOOK_URL, { content });
        console.log("✅ Discord 通知已送出");

        // ✅ Email 通知
        await resend.emails.send({
            from: "RC 帝國 <onboarding@resend.dev>", // ❗️Resend 限制只能用這個寄件者
            to: ["rcstudiochenguang@gmail.com"], // ⚠️ 必須是陣列格式
            subject: `RC帝國報名通知：${data.name}`,
            html: `
        <h2>📨 RC 帝國收到新報名表：</h2>
        <ul>
          <li><strong>姓名：</strong>${data.name}</li>
          <li><strong>年齡：</strong>${data.age}</li>
          <li><strong>性別：</strong>${data.gender}</li>
          <li><strong>技能：</strong>${(data.skills || []).join(", ")}</li>
          <li><strong>職位：</strong>${data.position}</li>
          <li><strong>上線時間：</strong>${data.availableTime}</li>
          <li><strong>聯絡方式：</strong>${data.contact}</li>
          <li><strong>問題：</strong>${data.questions || "無"}</li>
        </ul>
      `,
        });

        console.log("✅ Email 已寄出");

        res.status(200).json({ message: "已提交，通知已送出。" });
    } catch (err) {
        console.error("❌ 發送通知失敗：", err.message);
        res.status(500).json({ error: "通知發送失敗" });
    }
});

app.listen(port, () => {
    console.log(`🚀 RC 後端伺服器運行中： http://localhost:${port}`);
});
