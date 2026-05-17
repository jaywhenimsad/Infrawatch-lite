const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());

app.get("/api/health", (req, res) => {
    exec("py ../scripts/monitor.py", (error, stdout, stderr) => {

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const data = JSON.parse(stdout);

        res.json(data);
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});