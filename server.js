// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
    console.log("收到表單資料：", req.body);
    res.status(200).send("表單接收成功");
});

app.get("/", (req, res) => {
    res.send("RC Backend 運作正常");
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
