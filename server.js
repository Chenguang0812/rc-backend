const express = require("express")
const cors = require("cors")
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/submit", (req, res) => {
    const data = req.body;
    console.log("收到資料：", data);
    res.status(200).json({ success: true, message: "收到申請！" });
});

app.listen(port, () => {
    console.log(`後端伺服器啟動： http://localhost:${port}`);
});