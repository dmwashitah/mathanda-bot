require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const handleMessage = require('./utils/messageHandler');

const app = express();

// Accept both JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;

        // Handle if UltraMsg sends payload in `data` object
        const data = payload.data || payload;

        console.log("📩 RAW INCOMING:", JSON.stringify(data, null, 2));

        const from = data.from ? data.from.replace("@c.us", "") : null;
        const body = data.body ? data.body.trim().toLowerCase() : null;

        if (!from || !body) {
            console.log("⚠️ Missing 'from' or 'body' in request");
            return res.sendStatus(400);
        }

        const reply = handleMessage(body);

        if (reply) {
            console.log("🔁 Replying to", from, "with:", reply);
            await axios.post(`https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`, {
                token: process.env.TOKEN,
                to: from,
                body: reply
            });
            console.log("✅ Message sent to", from);
        } else {
            console.log("🤷 No reply matched for:", body);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ ERROR:", error.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mathanda WhatsApp Bot is live on port ${PORT}`);
});
