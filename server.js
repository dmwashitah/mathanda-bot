require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const handleMessage = require('./utils/messageHandler');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    try {
        console.log("📩 RAW INCOMING:", JSON.stringify(req.body, null, 2));

        const data = req.body.data;

        // Check if data exists
        if (!data || !data.from || !data.body) {
            console.log("⚠️ Missing 'from' or 'body' in request");
            return res.sendStatus(400);
        }

        const from = data.from.replace("@c.us", ""); // Clean number
        const body = data.body.trim().toLowerCase();
        console.log("📝 Parsed:", body);

        const reply = handleMessage(body);

        if (reply) {
            console.log("🔁 Replying to", from, "with:", reply);

            await axios.post(`https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`, {
                token: process.env.TOKEN,
                to: from,
                body: reply
            });

            console.log("✅ Sent");
        } else {
            console.log("🤷 No reply matched.");
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mathanda WhatsApp Bot is live on port ${PORT}`);
});
