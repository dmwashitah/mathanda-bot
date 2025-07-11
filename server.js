require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const handleMessage = require('./utils/messageHandler');

const app = express();
app.use(bodyParser.json());

// EMERGENCY DEBUGGING: Webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        // Print entire incoming request for debugging
        console.log("📩 RAW INCOMING:", JSON.stringify(req.body, null, 2));

        const { from, body } = req.body;

        if (!from || !body) {
            console.log("⚠️ Missing 'from' or 'body' in request");
            return res.sendStatus(400);
        }

        const messageText = body.trim().toLowerCase();
        console.log("📝 Parsed Message:", messageText);

        const reply = handleMessage(messageText);

        if (reply) {
            console.log("🔁 Replying with:", reply);

            await axios.post(`https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`, {
                token: process.env.TOKEN,
                to: from,
                body: reply
            });

            console.log("✅ Sent reply to:", from);
        } else {
            console.log("🤷 No matching reply for:", messageText);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ ERROR in webhook:", error);
        res.sendStatus(500);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mathanda WhatsApp Bot is live on port ${PORT}`);
});
