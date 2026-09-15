const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const { CustomFile } = require("telegram/client/uploads");
const http = require("http");

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const API_ID = Number(process.env.API_ID);
const API_HASH = process.env.API_HASH || "";
const SESSION_STRING = process.env.SESSION_STRING || "";

// ============================================================
// GITHUB IMAGE SETTINGS
// ============================================================

const GITHUB_USER = "newmp3info-glitch";
const REPO_NAME = "Userbot";
const GITHUB_BRANCH = "main";

// ============================================================
// SOURCE CHANNEL
// ============================================================

const SOURCE_CHANNEL = "@AllYonorummyCode";

// ============================================================
// 8 DESTINATION CHANNELS
// ============================================================

const DESTINATION_CHANNELS = [
    "@totalyonocode",
    "@fullyonocode",
    "@superyonocode",
    "@LootYonoCode",
    "@FastYonoCode",
    "@RealYonoCode",
    "@VipFreeYonoCode",
    "@WinRummynet"
];

// ============================================================
// YOUR PERSONAL REFERRAL GAME LINKS (আপনাদের নিজস্ব লিংক)
// ============================================================

const GAME_LINKS = {
    "yono rummy": "https://yonorummyaa.com/?code=VIPQSYFW1U7&t=1747967855",
    "yono slots": "https://www.yonoslot.com/?code=PJBAVZSMQKB&t=1743101854",
    "yono games": "https://yonogames8.com/?code=NG8WTHRW&t=1743102015",
    "yono arcade": "https://uonoarcadeagent4.com/?code=F55GHL6LQ3G&t=1743100813",
    "yes spin": "https://yesspin4.com/?code=47T6XCNANE1&t=1757709283",
    "jaiho 91": "https://jaiho91.cc/?code=C42MT6VF7ZN&t=1778035597",
    "yono vip": "https://yonovipcash.net/?code=9U8CSBE7UHB&t=1782879074",
    "jaiho 777 vip": "https://jaiho777vip.site/?code=GC2MC1NHPHZ&t=1780716165",
    "jaiho arcade": "https://jaihoarcade26.com/?code=AZDDMDV26V4&t=1741079971",
    "jaiho win": "https://www.jaihowin5.com/?code=4J69ZG2DK5H&t=1752209730",
    "jaiho slots": "https://jahoslotsagent1.com/?code=EGPEZKXT838&t=1748230888",
    "jaiho spin": "https://jaihospin1.com/?code=7TAJN64H9LP&t=1741079885",
    "jaiho rummy": "https://www.jaihoclyclub.com/?code=E74ALBMPNFT&t=1779814509",
    "joy rummy": "https://joyrummy.cc/?code=J5KNNUXTNLW&t=1768444922",
    "rummy 888": "https://rummy888vip10.com/?code=EVSZMHU9AC2&t=1764567211",
    "rummy 77": "https://www.rummy77a.com/?code=F3V9E5R2BKS&t=1763692222",
    "rummy ludo": "https://ludorummy.download/?code=UWPH29LC845&t=1762829766",
    "rummy 91": "https://www.ynrummy91g.com/?code=4KT7BTMD2ZY&t=1765972799",
    "boss rummy": "https://bossrummyn.com/?code=9HFEUHFV6JD&t=1766370231",
    "ever 777": "https://ever777J.COM/?code=ARH67JG55DZ&t=1765419366",
    "777 game": "https://www.777game3.com/?code=H531GHAXED9&t=1761877821",
    "ok rummy": "https://www.okrummy10.com/?code=H2GH1YUWWTH&t=1761013779",
    "hindi 777": "https://hindi777refer.cc/?code=7LFYD743VCA&t=1764895429",
    "club inr": "https://clubinr3.vip/?code=9VCQ27ABC5Q&t=1759199409",
    "game rummy": "https://gamesrummy.app/?code=Q6WJ5M6UA4J&t=1758335492",
    "rumble rummy": "https://rumblerummyofficial.vip/?code=UC0E2CABAJD&t=1756696218",
    "spin winner": "https://spinwinnerfreecash2.com/?code=SDNHN67187V&t=1743101371",
    "love rummy": "https://www.8loverummy.com/?code=AF CGCQYZQ5E&t=1757156156",
    "share slots": "https://shareslots66.com/?code=GFV2UHKQ3XL&t=1754885021",
    "maha games": "https://mahagames.store/?code=J24VEQEGY9F&t=1776974564",
    "hi rummy": "https://hirummyrefer.vip/?code=RX389XDH2V6&t=1753063336",
    "gogo rummy": "https://www.gogorummy8.com/?code=8FWMTAM8CUF&t=1743101440",
    "ind club": "https://indclubc.com/?code=34UZ2SRRL2A&t=1751337884",
    "top rummy": "https://www.toprummy.xyz/?code=7K9K1JCKCC5&t=1783792105",
    "ind rummy": "https://indrummy7.com/?code=2BA8ADDPWEJ&t=1749436463",
    "abc rummy": "https://www.22abcrummy.com/?code=75C92CLAD92&t=1779814560",
    "ind slots": "https://indslots3.com/?code=EYMCJP1NA2C&t=1743100179",
    "101z": "https://101zvip9.com/?code=398FPM6Q9PM&t=1747968336",
    "spin gold": "https://spingoldagents.net/?code=HLTS5ALTUNW&t=1743100758",
    "spin crush": "https://spincrush45.com/?code=ADEX467GURD&t=1743101621",
    "mbm bet": "https://mbmbet7.com/?code=UPHMEWS56EM&t=1748511523",
    "spin101": "https://spin101-c.net/?code=3511UCZEPM1&t=1743099784",
    "spin777": "https://spin777t.com/?code=7V9J2PJ16FK&t=1743101407",
    "bet213": "https://bet213app.com/?code=2QTF2EVJQWF&t=1767409426",
    "bingo101": "https://bingo101o.com/?code=6YFGBDZHMPT&t=1753165795",
    "789jackpots": "https://789jackpotsrefer.cc/?code=J7ZG3A2XLFE&t=1743099633",
    "567slots": "https://567slotsagents.net/?code=4NYT1UY68JN&t=1743099721",
    "slots spin": "https://slotsspino.com/?code=XJBWC8R516C&t=1743100644",
    "neta vip": "https://neta2.vip/?code=DR0FVH8VBKP&t=1743099907",
    "slots winner": "https://www.slotswinnerhp.com/?code=PGVHTFC4C4K&t=1779813551",
    "inr rummy": "https://inrrummy.cc/?code=JMQESK3J5UR&t=1767494008",
    "saga slots": "https://sagaslotsw.com/?code=0QHPZS4EJXM&t=1747969670",
    "yono 777": "https://freeyono777bonus.com/?code=F9MQW121H9H&t=1750740205",
    "yono777": "https://freeyono777bonus.com/?code=F9MQW121H9H&t=1750740205",
    "yn777": "https://www.y754.com/?code=4SWJ2Z2RNC2&t=1759154214",
    "max rummy": "https://www.maxrummy444.com/?code=QUMF17KD7HQ&t=1783566553",
    "dhan game": "https://www.dhanwinplay.com/?code=L2V36G8J9AR&t=1784777212",
    "win rummy": "https://www.winrummy27.com/?code=8JTZNTE666F&t=1785291927",
    "gold rummy": "https://goldrummy30.com/?code=JLXYHLPBTYR&t=1787106396",
    "money rummy": "https://moneyrummyq.com/?code=3T72BTVLHB3&t=1788920753"
};

// ============================================================
// HELPERS
// ============================================================

function normalizeUsername(value) {
    return String(value || "").replace(/^@/, "").trim().toLowerCase();
}

function normalizeGameName(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[-_]/g, " ")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ============================================================
// PERFECT GAME NAME DETECTION (Keeps full names like Bet-213, Rummy-77)
// ============================================================

function extractGameName(rawText) {
    if (!rawText) return null;

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    
    for (const line of lines) {
        if (/new\s*promocode|promocode|claim/i.test(line)) {
            // Cut everything from "New PromoCode" or "PromoCode" onwards
            const idx = line.search(/new\s*promocode|promocode|claim/i);
            let namePart = idx !== -1 ? line.substring(0, idx) : line;
            
            // Remove emojis and unwanted symbols, but PRESERVE hyphens and numbers (e.g., Bet-213)
            namePart = namePart.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, '').trim();
            namePart = namePart.replace(/[\/\–\—\>\:]+/g, " ").trim();
            namePart = namePart.replace(/\s+/g, " ").trim();
            
            if (namePart.length > 0) {
                return namePart;
            }
        }
    }

    if (lines.length > 0) {
        const idx = lines[0].search(/new\s*promocode.*$/i);
        let firstLine = idx !== -1 ? lines[0].substring(0, idx) : lines[0];
        firstLine = firstLine.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, '').trim();
        firstLine = firstLine.replace(/[\/\–\—\>\:]+/g, " ").trim();
        firstLine = firstLine.replace(/\s+/g, " ").trim();
        if (firstLine.length > 0) {
            return firstLine;
        }
    }

    return null;
}

// ============================================================
// CLEAN PROMO CODE DETECTION
// ============================================================

function extractPromoCode(rawText) {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    for (const line of lines) {
        if (/claim|code|promo/i.test(line)) {
            const parts = line.split(/>>|➜|➔|→|:/);
            if (parts.length > 1) {
                let candidate = parts.slice(1).join(':').trim();
                candidate = candidate.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, '').trim();
                
                const tokens = candidate.split(/\s+/);
                for (const token of tokens) {
                    if (token.length >= 3 && !token.includes('http')) {
                        return token.trim();
                    }
                }
            }
        }
    }

    const match = rawText.match(/(?:claim|code)\s*(?:➜|➔|→|>>|:|-)?\s*([A-Za-z0-9._-]+)/i);
    if (match && match[1]) {
        let code = match[1].replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, '').trim();
        if (code.length >= 3) return code;
    }

    return null;
}

// ============================================================
// SMART GAME LINK FINDER (Longest-first matching)
// ============================================================

function findGameLink(gameName) {
    const normalized = normalizeGameName(gameName);

    if (GAME_LINKS[normalized]) {
        return GAME_LINKS[normalized];
    }

    const sortedKeys = Object.keys(GAME_LINKS).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        const normKey = normalizeGameName(key);
        if (normalized.includes(normKey) || normKey.includes(normalized)) {
            return GAME_LINKS[key];
        }
    }

    return Object.values(GAME_LINKS)[0];
}

// ============================================================
// CLEAN TEMPLATE
// ============================================================

function buildCaption(
    gameName,
    promoCode,
    gameLink
) {
    const safeGameName = escapeHtml(gameName);
    const safePromoCode = escapeHtml(promoCode);

    return (
        `<b>${safeGameName} ➞ New promo code fast claim now!!</b> 💰\n\n` +

        `🎟️ <b>PROMO CODE ➜</b> ` +
        `<code>${safePromoCode}</code>\n\n` +

        `<blockquote>` +
        `🎁 New Users 🎉 SignUp Bonus Upto ₹49 - ₹199` +
        `</blockquote>\n\n` +

        `🎰 <b>${safeGameName.toUpperCase()} LINK</b> 👉 ` +
        `<a href="${gameLink}"><b>Download Now</b></a> 📱\n\n` +

        `💰 <i>Minimum Amount ₹100 First Withdrawal</i> 💸\n\n` +

        `<blockquote>` +
        `🔥 Join &amp; Pin this channel for daily promo codes!` +
        `</blockquote>\n\n` +

        `🔗 <a href="https://t.me/VipYonoFreeCode/3783">New Game</a> | <a href="https://t.me/AllYonoRummyCode/138">Total Game</a> | <a href="https://t.me/YonoGamingHeadAIBot">AI Bot</a> | <a href="https://t.me/spin_crush_bot">Promo Bot</a> | <a href="https://www.fastyonoapp.online/">Master App</a>`
    );
}

// ============================================================
// DUPLICATE PROTECTION
// ============================================================

const processedMessages = new Set();

function isAlreadyProcessed(messageId) {
    if (!messageId) return false;

    const id = String(messageId);

    if (processedMessages.has(id)) {
        return true;
    }

    processedMessages.add(id);

    if (processedMessages.size > 2000) {
        const first = processedMessages.values().next().value;
        processedMessages.delete(first);
    }

    return false;
}

// ============================================================
// SEND TO CHANNEL
// ============================================================

async function sendFinalPost(
    client,
    targetChat,
    gameName,
    caption
) {
    const entity = await client.getEntity(targetChat);
    const normalized = normalizeGameName(gameName);
    const imageFileName = normalized.replace(/\s+/g, "-") + ".jpg";

    const branches = [GITHUB_BRANCH, "main", "master"];
    let imageBuffer = null;

    for (const branch of [...new Set(branches)]) {
        const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${branch}/${imageFileName}`;
        try {
            const res = await fetch(imageUrl, {
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            if (res.ok) {
                const arrayBuffer = await res.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
                break;
            }
        } catch (e) {}
    }

    if (imageBuffer) {
        const customFile = new CustomFile(imageFileName, imageBuffer.length, "", imageBuffer);
        const uploadedFile = await client.uploadFile({ file: customFile });

        return await client.sendFile(
            entity,
            {
                file: uploadedFile,
                caption: caption,
                parseMode: "html",
                forceDocument: false
            }
        );
    } else {
        console.log(`⚠️ Image not found on GitHub for '${gameName}' (${imageFileName}), sending text only.`);
        return await client.sendMessage(
            entity,
            {
                message: caption,
                parseMode: "html"
            }
        );
    }
}

// ============================================================
// MAIN
// ============================================================

async function main() {

    console.log("");
    console.log("==============================================");
    console.log("🚀 TELEGRAM USERBOT STARTING");
    console.log("==============================================");

    if (!API_ID) throw new Error("API_ID পাওয়া যায়নি।");
    if (!API_HASH) throw new Error("API_HASH পাওয়া যায়নি।");
    if (!SESSION_STRING) throw new Error("SESSION_STRING পাওয়া যায়নি।");

    const client =
        new TelegramClient(
            new StringSession(SESSION_STRING),
            API_ID,
            API_HASH,
            {
                connectionRetries: 10,
                autoReconnect: true,
                retryDelay: 2000
            }
        );

    console.log("🔄 Connecting to Telegram...");
    await client.connect();

    if (!await client.checkAuthorization()) {
        throw new Error("SESSION_STRING দিয়ে Telegram authorization পাওয়া যায়নি।");
    }

    console.log("==============================================");
    const me = await client.getMe();
    console.log("✅ USERBOT CONNECTED SUCCESSFULLY");
    console.log(`👤 User ID: ${me.id}`);
    console.log(`👤 Username: @${me.username || "NoUsername"}`);
    console.log("==============================================");

    console.log(`🎯 Source: ${SOURCE_CHANNEL}`);
    console.log(`📤 Destinations: ${DESTINATION_CHANNELS.length}`);
    console.log("==============================================");

    const sourceEntity = await client.getEntity(SOURCE_CHANNEL);
    const sourceEntityId = sourceEntity.id ? String(sourceEntity.id).replace("-100", "") : "";
    console.log(`✅ Source channel found: ${SOURCE_CHANNEL} (ID: ${sourceEntityId})`);

    for (const destination of DESTINATION_CHANNELS) {
        try {
            await client.getEntity(destination);
            console.log(`✅ Target channel found: ${destination}`);
        } catch (error) {
            console.error(`❌ Target channel not found: ${destination}`);
        }
    }

    console.log("==============================================");
    console.log("🟢 USERBOT IS NOW LISTENING FOR NEW POSTS...");
    console.log(`👀 Watching ${SOURCE_CHANNEL}`);
    console.log("==============================================");

    client.addEventHandler(
        async (event) => {
            const message = event.message;
            if (!message) return;

            try {
                const chat = await message.getChat().catch(() => null);
                const chatIdStr = message.chatId ? String(message.chatId).replace("-100", "") : "";
                const currentUsername = chat && chat.username ? normalizeUsername(chat.username) : "";
                const sourceUsername = normalizeUsername(SOURCE_CHANNEL);

                const isMatch = 
                    (sourceEntityId && chatIdStr && chatIdStr === sourceEntityId) ||
                    (sourceUsername && currentUsername && currentUsername === sourceUsername);

                if (!isMatch) return;

                if (isAlreadyProcessed(`${sourceUsername}_${message.id}`)) return;

                const rawText =
                    message.message ||
                    message.text ||
                    message.caption ||
                    "";

                if (!rawText.trim()) {
                    console.log("⚠️ Source post has no text.");
                    return;
                }

                console.log("");
                console.log("==============================================");
                console.log("📩 NEW PROMO POST DETECTED");
                console.log(`🆔 Message ID: ${message.id}`);

                const gameName = extractGameName(rawText);
                if (!gameName) {
                    console.log("❌ Game name not detected.");
                    return;
                }

                const promoCode = extractPromoCode(rawText);
                if (!promoCode) {
                    console.log("❌ Promo code not detected.");
                    return;
                }

                console.log(`🎮 Game: ${gameName}`);
                console.log(`🎟️ Promo Code: ${promoCode}`);

                const gameLink = findGameLink(gameName);
                console.log(`🔗 Personal Referral Link Matched Successfully`);

                const formattedText = buildCaption(
                    gameName,
                    promoCode,
                    gameLink
                );

                let successCount = 0;
                for (const targetChat of DESTINATION_CHANNELS) {
                    try {
                        console.log(`📤 Sending post → ${targetChat}`);
                        await sendFinalPost(client, targetChat, gameName, formattedText);
                        successCount++;
                        console.log(`✅ Sent successfully → ${targetChat}`);
                        await new Promise(resolve => setTimeout(resolve, 700));
                    } catch (error) {
                        console.error(`❌ ${targetChat}: ${error.message}`);
                    }
                }

                console.log("==============================================");
                console.log(`✅ POSTING FINISHED: ${successCount}/${DESTINATION_CHANNELS.length}`);
                console.log("==============================================");

            } catch (error) {
                console.error("❌ MESSAGE ERROR:", error.message);
            }
        },
        new NewMessage({
            chats: [SOURCE_CHANNEL]
        })
    );

    setInterval(
        async () => {
            try {
                if (!client.connected) {
                    console.log("🔄 Telegram disconnected. Reconnecting...");
                    await client.connect();
                }
            } catch (error) {
                console.error("❌ Reconnect error:", error.message);
            }
        },
        30000
    );

    process.on("SIGTERM", async () => {
        try { await client.disconnect(); } catch (_) {}
        process.exit(0);
    });

    process.on("SIGINT", async () => {
        try { await client.disconnect(); } catch (_) {}
        process.exit(0);
    });
}

main().catch(
    error => {
        console.log("🔥 MAIN ERROR:", error.message);
        process.exit(1);
    }
);

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Telegram Promo Userbot is running!\n");
});

const PORT = Number(process.env.PORT) || 10000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Render server running on port ${PORT}`);
});
