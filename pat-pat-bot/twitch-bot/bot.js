require("dotenv").config();
const tmi = require("tmi.js");
const axios = require("axios");

// Twitch client configuration
const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH,
    },
    channels: [process.env.TWITCH_CHANNEL],
});

client.connect().catch(console.error);

client.on("connected", () => {
    console.log(`🤖 Twitch bot connected as ${process.env.TWITCH_USERNAME}`);
});

client.on("message", async (channel, tags, message, self) => {
    if (self) return;
    const username = tags.username.toLowerCase();

    if (message.trim().toLowerCase() === "!pat") {
        console.log(`${username} used !pat`);

        try {
            await axios.post(process.env.LARAVEL_API_URL, {
                user: username,
            });

            client.say(channel, `💛 ${username} gave the little guy a patpat!`);

        } catch (error) {
            console.error("Error calling pet API:", error.message);
        }
    }
});
