require("dotenv").config();
const tmi = require("tmi.js");
const axios = require("axios");

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
    const cmd = message.trim().toLowerCase();

    if (cmd === "!pat" || cmd === "!pet") {
        console.log(`${username} used ${cmd}`);

        try {
            await axios.post(process.env.LARAVEL_API_URL, {
                user: username,
            });

            client.say(channel, `${username} gave the little guy a patpat!`);
        } catch (error) {
            console.error("Error calling pet API:", error.message);
        }
        return;
    }

    if (cmd === "!mood") {
        console.log(`${username} used !mood`);

        try {
            const res = await axios.get(process.env.LARAVEL_PET_STATE_URL);
            const { points, mood, maxPoints } = res.data;

            const moodNice = String(mood).replace("_", " ");

            client.say(
                channel,
                `The little guy is ${moodNice} at ${points} / ${maxPoints} points.`
            );
        } catch (error) {
            console.error("Error fetching pet state:", error.message);
            client.say(
                channel,
                `⚠️ Sorry ${username}, I couldn't check the little guy's mood right now.`
            );
        }
    }
});

