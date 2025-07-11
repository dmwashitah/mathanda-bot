const rooms = require('../rooms/roomData.json');

function handleMessage(message) {
    if (message.includes("hello") || message.includes("hi")) {
        return "👋 Hello! Welcome to Mathanda Guest House. Type 'rooms' to see available rooms.";
    }

    if (message.includes("rooms")) {
        return rooms.map(r => `🏠 *${r.caption}*\n💵 Price: ${r.price}\n📄 ${r.description}\n📸 ${r.image}`).join("\n\n");
    }

    if (message.includes("book")) {
        return "📝 To book a room, please reply with: \n\nbook [Room Name] [Your Name] [Check-in Date]";
    }

    if (message.startsWith("book")) {
        return "✅ Thank you! Your booking has been received. We'll confirm shortly.";
    }

    return "❓ I didn’t understand. Type 'rooms' to see available rooms.";
}

module.exports = handleMessage;