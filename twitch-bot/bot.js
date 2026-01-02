const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

const tmi = require("tmi.js");
const axios = require("axios");

const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH,
    },
    channels: [], // start empty; we will join dynamically
});

const joined = new Set();

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function fetchDesiredChannels() {
    const res = await axios.get(process.env.LARAVEL_CHANNELS_URL, {
        headers: { "X-BOT-KEY": process.env.BOT_API_KEY },
    });

    return (res.data.channels || [])
        .map((c) => String(c).toLowerCase())
        .filter(Boolean);
}

async function syncChannels() {
    try {
        const channels = await fetchDesiredChannels();
        const desired = new Set(channels.map((c) => `#${c}`));

        for (const chan of desired) {
            if (!joined.has(chan)) {
                await client.join(chan);
                joined.add(chan);
                await sleep(600);
            }
        }

        // PART removed ones
        for (const chan of Array.from(joined)) {
            if (!desired.has(chan)) {
                await client.part(chan);
                joined.delete(chan);
                await sleep(200);
            }
        }
    } catch (err) {
        console.error("syncChannels error:", err?.message ?? err);
    }
}

client.on("connected", async () => {
    console.log(`🤖 Connected as ${process.env.TWITCH_USERNAME}`);
    await syncChannels();
    setInterval(syncChannels, 15000);
});

client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    const username = (tags.username || "").toLowerCase();
    const cmd = message.trim().toLowerCase();

    if (cmd === "!pat") {
        try {
            await axios.post(
                process.env.LARAVEL_PAT_URL,
                { user: username },
                { headers: { "X-BOT-KEY": process.env.BOT_API_KEY } }
            );

            client.say(channel, `${username} gave the little guy a patpat!`);
        } catch (err) {
            console.error("pat error:", err?.message ?? err);
        }
    }

    if (cmd === "!mood") {
        try {
            const res = await axios.get(process.env.LARAVEL_PET_STATE_URL, {
                headers: { "X-BOT-KEY": process.env.BOT_API_KEY },
            });

            const { points, mood, maxPoints } = res.data;
            const moodNice = String(mood).replace("_", " ");

            client.say(channel, `The little guy is ${moodNice} at ${points}/${maxPoints}.`);
        } catch (err) {
            console.error("mood error:", err?.message ?? err);
        }
    }
});

client.connect().catch(console.error);
