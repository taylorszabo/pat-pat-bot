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
    channels: [],
});

const joined = new Set();

const PAT_COOLDOWN_MS = 15_000;
const SPAM_MSG_COOLDOWN_MS = 10_000;

const lastPatAtByUser = new Map();
const lastSpamMsgAtByUser = new Map();

const SAY_MIN_INTERVAL_MS = 1200;
let lastSayAt = 0;
const sayQueue = [];

function queueSay(channel, text) {
    sayQueue.push({ channel, text });
}

setInterval(() => {
    if (sayQueue.length === 0) return;

    const now = Date.now();
    if (now - lastSayAt < SAY_MIN_INTERVAL_MS) return;

    const { channel, text } = sayQueue.shift();
    client.say(channel, text).catch(() => {});
    lastSayAt = now;
}, 200);


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
    console.log(`Connected as ${process.env.TWITCH_USERNAME}`);
    await syncChannels();
    setInterval(syncChannels, 15000);
});

client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    const username = (tags.username || "").toLowerCase();
    const cmd = message.trim().toLowerCase();

    if (cmd === "!pat" || cmd === "!pet" ) {
        const now = Date.now();
        const userKey = `${channel}:${username}`;

        const lastPatAt = lastPatAtByUser.get(userKey) ?? 0;
        const left = Math.max(0, PAT_COOLDOWN_MS - (now - lastPatAt));

        if (left > 0) {
            const lastWarnAt = lastSpamMsgAtByUser.get(userKey) ?? 0;
            const warnLeft = Math.max(0, SPAM_MSG_COOLDOWN_MS - (now - lastWarnAt));

            if (warnLeft === 0) {
                lastSpamMsgAtByUser.set(userKey, now);
                queueSay(
                    channel,
                    `${username}, slow down! You can pat again in ${Math.ceil(left / 1000)}s.`
                );
            }
            return;
        }

        lastPatAtByUser.set(userKey, now);

        try {
            await axios.post(
                process.env.LARAVEL_PAT_URL,
                { user: username },
                { headers: { "X-BOT-KEY": process.env.BOT_API_KEY } }
            );

            queueSay(channel, `${username} gave the little guy a patpat!`);
        } catch (err) {
            console.error("pat error:", err?.message ?? err);

            lastPatAtByUser.delete(userKey);
        }
    }



    if (cmd === "!mood") {
        try {
            const res = await axios.get(process.env.LARAVEL_PET_STATE_URL, {
                headers: { "X-BOT-KEY": process.env.BOT_API_KEY },
            });

            const { points, mood, maxPoints } = res.data;
            const moodNice = String(mood).replace("_", " ");

            queueSay(channel, `The little guy is ${moodNice} at ${points}/${maxPoints}.`);
        } catch (err) {
            console.error("mood error:", err?.message ?? err);
        }
    }

    if (cmd === "!patpat") {
        queueSay(
            channel,
            "PatPat is your own tiny virtual littly guy! Use !pat to give them pats and raise their happiness :) If nobody pats, they get sad :( But be gentle, you can only pat every 15 secs!"
        );
    }

    if (cmd === "!reset") {
        const isMod = tags.mod === true;
        const isBroadcaster = tags.badges && tags.badges.broadcaster === "1";

        if (!isMod && !isBroadcaster) {
            return;
        }

        try {
            await axios.post(
                process.env.LARAVEL_RESET_URL,
                {},
                { headers: { "X-BOT-KEY": process.env.BOT_API_KEY } }
            );

            queueSay(channel, "The little guy is back to neutral.");
        } catch (err) {
            console.error("reset error:", err?.message ?? err);
        }
    }

});



client.connect().catch(console.error);
