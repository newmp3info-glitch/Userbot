const { TelegramClient, Button } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const http = require("http");

// ============================================================
// TELEGRAM USERBOT ENVIRONMENT
// ============================================================

const API_ID = parseInt(process.env.API_ID, 10);
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

const SOURCE_CHANNEL = "AllYonorummyCode";

// ============================================================
// 8 DESTINATION CHANNELS
// ============================================================

const DESTINATION_CHANNELS = [
    "totalyonocode",
    "fullyonocode",
    "superyonocode",
    "LootYonoCode",
    "FastYonoCode",
    "RealYonoCode",
    "VipFreeYonoCode",
    "WinRummynet"
];

// ============================================================
// FIXED 5 BUTTONS
//
// Row 1 = 2 buttons
// Row 2 = 2 buttons
// Row 3 = 1 button
//
// এগুলো Source Channel থেকে নেওয়া হবে না।
// প্রতিটি নতুন পোস্টে একই 5টি button থাকবে.
//
// IMPORTANT:
// Telegram URL buttons-এর নিজস্ব "primary/success" color
// সেট করা যায় না। Telegram client নিজে button appearance
// দেখায়। তাই এখানে শুধু text + URL ব্যবহার করা হয়েছে.
// ============================================================

const FIXED_BUTTONS = [
    [
        Button.url(
            "🎰 New Game 45",
            "https://t.me/VipYonoFreeCode/3783"
        ),

        Button.url(
            "🎰 Total Game 70",
            "https://t.me/AllYonoRummyCode/138"
        )
    ],

    [
        Button.url(
            "🤖 Yono AI Bot 🤖",
            "https://t.me/YonoGamingHeadAIBot"
        ),

        Button.url(
            "🤖 Promo Code Bot 🤖",
            "https://t.me/spin_crush_bot"
        )
    ],

    [
        Button.url(
            "🔥 Yono Master App 🔥",
            "https://www.fastyonoapp.online/"
        )
    ]
];

// ============================================================
// GAME LINKS
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
    "jaiho rummy": "https://jaiho-rummy.com/?code=E74M53JS26R&t=1776974460",
    "joy rummy": "https://joyrummy.cc/?code=J5KNNUXTNLW&t=1768444922",
    "rummy 888": "https://rummy888vip10.com/?code=EVSZMHU9AC2&t=1764567211",
    "rummy 77": "https://rummy77a.com/?code=F3V7TB9KD5H&t=1763692367",
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
    "love rummy": "https://www.loverummy6.com/?code=AFC6FQSG7VX&t=1755829901",
    "share slots": "https://shareslots66.com/?code=GFV2UHKQ3XL&t=1754885021",
    "maha games": "https://mahagames.store/?code=J24VEQEGY9F&t=1776974564",
    "hi rummy": "https://hirummyrefer.vip/?code=RX389XDH2V6&t=1753063336",
    "gogo rummy": "https://www.gogorummy8.com/?code=8FWMTAM8CUF&t=1743101440",
    "ind club": "https://indclubc.com/?code=34UZ2SRRL2A&t=1751337884",
    "top rummy": "https://toprummy.cc/?code=7K9BTEX2Z7J&t=1750740391",
    "ind rummy": "https://indrummy7.com/?code=2BA8ADDPWEJ&t=1749436463",
    "abc rummy": "https://www.abcrummy1.com/?code=75CN7R7Y8PY&t=1743100250",
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
    "slots winner": "https://slotswinnerf.com/?code=K4EHSWHN9C1&t=1778259858",
    "inr rummy": "https://inrrummy.cc/?code=JMQESK3J5UR&t=1767494008",
    "saga slots": "https://sagaslotsw.com/?code=0QHPZS4EJXM&t=1747969670",
    "yono 777": "https://freeyono777bonus.com/?code=F9MQW121H9H&t=1750740205",
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
    return String(value || "")
        .replace(/^@/, "")
        .trim()
        .toLowerCase();
}

function normalizeGameName(value) {
    return String(value || "")
        .toLowerCase()
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
// GAME NAME DETECTION
// ============================================================

function extractGameName(rawText) {
    if (!rawText) {
        return null;
    }

    const lines = String(rawText)
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    // --------------------------------------------------------
    // Method 1:
    // "Yono Rummy ➜ New promo code..."
    // --------------------------------------------------------

    for (const line of lines) {

        const match = line.match(
            /^(.*?)\s+New\s+(?:App\s*[➜➔→>-]+\s*)?(?:New\s+)?Promo\s*Code\b/i
        );

        if (match && match[1]) {

            const result = match[1]
                .replace(/^[^\p{L}\p{N}]+/u, "")
                .replace(/[^\p{L}\p{N}]+$/u, "")
                .trim();

            if (result) {
                return result;
            }
        }
    }

    // --------------------------------------------------------
    // Method 2:
    // "Yono Rummy ➜ New App..."
    // --------------------------------------------------------

    for (const line of lines) {

        const match = line.match(
            /^(.*?)\s+New\s+App\b/i
        );

        if (match && match[1]) {

            const result = match[1]
                .replace(/^[^\p{L}\p{N}]+/u, "")
                .replace(/[^\p{L}\p{N}]+$/u, "")
                .trim();

            if (result) {
                return result;
            }
        }
    }

    // --------------------------------------------------------
    // Method 3:
    // Try matching known game names directly.
    // --------------------------------------------------------

    const lowerText =
        normalizeGameName(rawText);

    for (const key of Object.keys(GAME_LINKS)) {

        if (
            lowerText.includes(
                normalizeGameName(key)
            )
        ) {
            return key;
        }
    }

    return null;
}

// ============================================================
// PROMO CODE DETECTION
// ============================================================

function extractPromoCode(rawText) {

    if (!rawText) {
        return null;
    }

    const patterns = [

        /PROMO\s*CODE\s*(?:➜|➔|→|>>|:|-)\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i,

        /PROMO\s*CODE\s+([A-Za-z0-9][A-Za-z0-9._-]*)/i,

        /CLAIM\s*(?:➜|➔|→|>>|:|-)\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i,

        /PROMO\s*[:\-]\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i
    ];

    for (const pattern of patterns) {

        const match =
            String(rawText).match(pattern);

        if (
            match &&
            match[1]
        ) {
            return match[1].trim();
        }
    }

    return null;
}

// ============================================================
// FIND GAME LINK
// ============================================================

function findGameLink(gameName) {

    if (!gameName) {
        return null;
    }

    const normalized =
        normalizeGameName(gameName);

    if (GAME_LINKS[normalized]) {
        return GAME_LINKS[normalized];
    }

    for (
        const [key, url]
        of Object.entries(GAME_LINKS)
    ) {

        if (
            normalizeGameName(key) ===
            normalized
        ) {
            return url;
        }
    }

    return null;
}

// ============================================================
// IMAGE URL
// ============================================================

function getImageUrl(gameName) {

    const normalized =
        normalizeGameName(gameName);

    const imageFileName =
        normalized.replace(/\s+/g, "-") +
        ".jpg";

    return (
        "https://raw.githubusercontent.com/" +
        `${GITHUB_USER}/${REPO_NAME}/` +
        `${GITHUB_BRANCH}/${imageFileName}`
    );
}

// ============================================================
// CAPTION TEMPLATE
// ============================================================

function buildCaption(
    gameName,
    promoCode,
    gameLink
) {

    const safeGameName =
        escapeHtml(gameName);

    const safePromoCode =
        escapeHtml(promoCode);

    const safeGameLink =
        escapeHtml(gameLink);

    return (
        `<b>${safeGameName} ➞ New promo code fast claim now!!</b> 💰\n\n` +

        `🎟️ <b>PROMO CODE ➜</b> ` +
        `<code>${safePromoCode}</code>\n\n` +

        `<blockquote>` +
        `🎁 New Users 🎉 SignUp Bonus Upto ₹49 - ₹199` +
        `</blockquote>\n\n` +

        `🎰 <b>${safeGameName.toUpperCase()} LINK</b> 👉 ` +
        `<a href="${safeGameLink}">` +
        `<b>Download Now</b>` +
        `</a> 📱\n\n` +

        `💰 <i>Minimum Amount ₹100 First Withdrawal</i> 💸\n\n` +

        `<blockquote>` +
        `🔥 Join &amp; Pin this channel for daily promo codes!` +
        `</blockquote>`
    );
}

// ============================================================
// FLOOD WAIT HANDLER
// ============================================================

async function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

async function sendToChannel(
    client,
    targetChannel,
    imageUrl,
    caption
) {

    const entity =
        await client.getEntity(
            targetChannel
        );

    let attempts = 0;

    while (attempts < 3) {

        attempts++;

        try {

            // ------------------------------------------------
            // Send photo + caption + fixed buttons
            // ------------------------------------------------

            await client.sendFile(
                entity,
                {
                    file: imageUrl,

                    caption: caption,

                    parseMode: "html",

                    buttons: FIXED_BUTTONS,

                    forceDocument: false
                }
            );

            return true;

        } catch (error) {

            const message =
                String(
                    error &&
                    error.message
                    ? error.message
                    : error
                );

            // ----------------------------------------------
            // FloodWait
            // ----------------------------------------------

            if (
                error &&
                error.seconds
            ) {

                const seconds =
                    Number(error.seconds) || 10;

                console.log(
                    `⏳ FloodWait @${targetChannel}: ${seconds}s`
                );

                await sleep(
                    (seconds + 2) * 1000
                );

                continue;
            }

            if (
                /FLOOD_WAIT/i.test(message)
            ) {

                console.log(
                    `⏳ FloodWait detected @${targetChannel}`
                );

                await sleep(15000);

                continue;
            }

            // ----------------------------------------------
            // Photo failed
            // ----------------------------------------------

            if (
                attempts === 1
            ) {

                console.log(
                    `⚠️ Image send failed @${targetChannel}`
                );

                console.log(
                    "⚠️ Trying text post instead..."
                );

                try {

                    await client.sendMessage(
                        entity,
                        {
                            message: caption,

                            parseMode: "html",

                            buttons: FIXED_BUTTONS
                        }
                    );

                    return true;

                } catch (textError) {

                    console.error(
                        `❌ Text fallback failed @${targetChannel}:`,
                        textError.message
                    );
                }
            }

            console.error(
                `❌ Send failed @${targetChannel}:`,
                message
            );

            return false;
        }
    }

    return false;
}

// ============================================================
// DUPLICATE PROTECTION
// ============================================================

const processedMessages =
    new Set();

function isAlreadyProcessed(
    messageId
) {

    if (!messageId) {
        return false;
    }

    const id =
        String(messageId);

    if (
        processedMessages.has(id)
    ) {
        return true;
    }

    processedMessages.add(id);

    if (
        processedMessages.size > 2000
    ) {

        const first =
            processedMessages
                .values()
                .next()
                .value;

        processedMessages.delete(
            first
        );
    }

    return false;
}

// ============================================================
// MAIN USERBOT
// ============================================================

async function main() {

    console.log("");
    console.log(
        "================================================"
    );
    console.log(
        "🚀 TELEGRAM USERBOT STARTING"
    );
    console.log(
        "================================================"
    );

    // --------------------------------------------------------
    // Environment validation
    // --------------------------------------------------------

    if (
        !API_ID ||
        Number.isNaN(API_ID)
    ) {

        throw new Error(
            "API_ID পাওয়া যায়নি। Render Environment Variables চেক করুন।"
        );
    }

    console.log(
        "✅ API_ID found"
    );

    if (!API_HASH) {

        throw new Error(
            "API_HASH পাওয়া যায়নি। Render Environment Variables চেক করুন।"
        );
    }

    console.log(
        "✅ API_HASH found"
    );

    if (!SESSION_STRING) {

        throw new Error(
            "SESSION_STRING পাওয়া যায়নি। Render Environment Variables চেক করুন।"
        );
    }

    console.log(
        "✅ SESSION_STRING found"
    );

    // --------------------------------------------------------
    // IMPORTANT:
    // No BOT_TOKEN here.
    // This is a pure Telegram Userbot.
    // --------------------------------------------------------

    console.log(
        "✅ BOT_TOKEN not required"
    );

    // --------------------------------------------------------
    // Create Telegram client
    // --------------------------------------------------------

    const client =
        new TelegramClient(
            new StringSession(
                SESSION_STRING
            ),
            API_ID,
            API_HASH,
            {
                connectionRetries: 10,
                autoReconnect: true
            }
        );

    console.log(
        "📡 Connecting to Telegram..."
    );

    // --------------------------------------------------------
    // Connect using existing session
    // --------------------------------------------------------

    await client.connect();

    const authorized =
        await client.checkAuthorization();

    if (!authorized) {

        throw new Error(
            "SESSION_STRING valid নয় অথবা Telegram authorization পাওয়া যায়নি। নতুন SESSION_STRING তৈরি করুন।"
        );
    }

    // --------------------------------------------------------
    // Get current user
    // --------------------------------------------------------

    const me =
        await client.getMe();

    console.log("");
    console.log(
        "================================================"
    );

    console.log(
        "✅ USERBOT CONNECTED SUCCESSFULLY"
    );

    console.log(
        `👤 User ID: ${me.id}`
    );

    console.log(
        `👤 Username: @${me.username || "NoUsername"}`
    );

    console.log(
        "================================================"
    );

    console.log(
        `🎯 Source: @${SOURCE_CHANNEL}`
    );

    console.log(
        `📤 Destinations: ${DESTINATION_CHANNELS.length}`
    );

    console.log(
        "🔘 Fixed buttons: 5"
    );

    console.log(
        "================================================"
    );

    // --------------------------------------------------------
    // Resolve source channel
    // --------------------------------------------------------

    let sourceEntity;

    try {

        sourceEntity =
            await client.getEntity(
                SOURCE_CHANNEL
            );

        console.log(
            `✅ Source channel found: @${SOURCE_CHANNEL}`
        );

    } catch (error) {

        throw new Error(
            `Source channel পাওয়া যায়নি: @${SOURCE_CHANNEL} | ${error.message}`
        );
    }

    // --------------------------------------------------------
    // Verify destination channels
    // --------------------------------------------------------

    console.log("");
    console.log(
        "🔎 Checking destination channels..."
    );

    for (
        const target
        of DESTINATION_CHANNELS
    ) {

        try {

            await client.getEntity(
                target
            );

            console.log(
                `✅ Target OK: @${target}`
            );

        } catch (error) {

            console.error(
                `❌ Target NOT accessible: @${target}`
            );

            console.error(
                `   ${error.message}`
            );
        }
    }

    console.log("");
    console.log(
        "================================================"
    );

    console.log(
        "🟢 USERBOT IS NOW LISTENING FOR NEW POSTS..."
    );

    console.log(
        `👀 Watching: @${SOURCE_CHANNEL}`
    );

    console.log(
        "================================================"
    );

    // ========================================================
    // NEW MESSAGE LISTENER
    // ========================================================

    client.addEventHandler(

        async (event) => {

            const message =
                event.message;

            if (!message) {
                return;
            }

            try {

                // ------------------------------------------------
                // SOURCE CHAT CHECK
                // ------------------------------------------------

                const chatId =
                    message.chatId;

                if (!chatId) {
                    return;
                }

                const sourceId =
                    sourceEntity.id;

                if (
                    String(chatId) !==
                    String(sourceId)
                ) {

                    return;
                }

                // ------------------------------------------------
                // DUPLICATE CHECK
                // ------------------------------------------------

                if (
                    isAlreadyProcessed(
                        message.id
                    )
                ) {

                    return;
                }

                // ------------------------------------------------
                // GET TEXT
                // ------------------------------------------------

                const rawText =
                    message.message ||
                    message.text ||
                    "";

                if (
                    !String(rawText).trim()
                ) {

                    console.log(
                        "⚠️ Source post has no text."
                    );

                    return;
                }

                console.log("");
                console.log(
                    "================================================"
                );

                console.log(
                    "📩 NEW PROMO POST DETECTED"
                );

                console.log(
                    `🆔 Message ID: ${message.id}`
                );

                // ------------------------------------------------
                // GAME NAME
                // ------------------------------------------------

                const gameName =
                    extractGameName(
                        rawText
                    );

                if (!gameName) {

                    console.log(
                        "❌ Game name could not be detected."
                    );

                    console.log(
                        rawText.substring(
                            0,
                            700
                        )
                    );

                    return;
                }

                console.log(
                    `🎮 Game: ${gameName}`
                );

                // ------------------------------------------------
                // PROMO CODE
                // ------------------------------------------------

                const promoCode =
                    extractPromoCode(
                        rawText
                    );

                if (!promoCode) {

                    console.log(
                        "❌ Promo code could not be detected."
                    );

                    return;
                }

                console.log(
                    `🎟️ Promo Code: ${promoCode}`
                );

                // ------------------------------------------------
                // GAME LINK
                // ------------------------------------------------

                const gameLink =
                    findGameLink(
                        gameName
                    );

                if (!gameLink) {

                    console.log(
                        `❌ GAME_LINKS-এ "${gameName}" পাওয়া যায়নি।`
                    );

                    return;
                }

                console.log(
                    `🔗 Game Link: ${gameLink}`
                );

                // ------------------------------------------------
                // IMAGE
                // ------------------------------------------------

                const imageUrl =
                    getImageUrl(
                        gameName
                    );

                console.log(
                    `🖼️ Image: ${imageUrl}`
                );

                // ------------------------------------------------
                // BUILD TEMPLATE
                // ------------------------------------------------

                const caption =
                    buildCaption(
                        gameName,
                        promoCode,
                        gameLink
                    );

                console.log(
                    "📝 Template created"
                );

                // ------------------------------------------------
                // SEND TO ALL 8 CHANNELS
                // ------------------------------------------------

                let successCount = 0;
                let failedCount = 0;

                console.log("");
                console.log(
                    "📤 STARTING 8-CHANNEL POSTING..."
                );

                for (
                    const target
                    of DESTINATION_CHANNELS
                ) {

                    console.log("");
                    console.log(
                        `📤 Sending → @${target}`
                    );

                    const success =
                        await sendToChannel(
                            client,
                            target,
                            imageUrl,
                            caption
                        );

                    if (success) {

                        successCount++;

                        console.log(
                            `✅ SENT → @${target}`
                        );

                    } else {

                        failedCount++;

                        console.log(
                            `❌ FAILED → @${target}`
                        );
                    }

                    // ------------------------------------------------
                    // Small delay between channels
                    // ------------------------------------------------

                    await sleep(
                        1000
                    );
                }

                console.log("");
                console.log(
                    "================================================"
                );

                console.log(
                    "📊 POSTING COMPLETE"
                );

                console.log(
                    `✅ Successful: ${successCount}/8`
                );

                console.log(
                    `❌ Failed: ${failedCount}/8`
                );

                console.log(
                    "================================================"
                );

            } catch (error) {

                console.error(
                    "❌ MESSAGE PROCESSING ERROR:"
                );

                console.error(
                    error
                );
            }
        },

        new NewMessage({})
    );

    // --------------------------------------------------------
    // Keep connection alive
    // --------------------------------------------------------

    setInterval(
        async () => {

            try {

                if (
                    !client.connected
                ) {

                    console.log(
                        "🔄 Telegram connection lost. Reconnecting..."
                    );

                    await client.connect();

                    console.log(
                        "✅ Telegram reconnected."
                    );
                }

            } catch (error) {

                console.error(
                    "❌ Reconnect error:",
                    error.message
                );
            }

        },
        30000
    );
}

// ============================================================
// START USERBOT
// ============================================================

main().catch(
    (error) => {

        console.error("");
        console.error(
            "================================================"
        );

        console.error(
            "🔥 USERBOT START ERROR"
        );

        console.error(
            error.message || error
        );

        console.error(
            "================================================"
        );
    }
);

// ============================================================
// RENDER WEB SERVER
// ============================================================

const server =
    http.createServer(
        (req, res) => {

            res.writeHead(
                200,
                {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                }
            );

            res.end(
                "Telegram Promo Userbot is running!\n"
            );
        }
    );

const PORT =
    process.env.PORT || 10000;

server.listen(
    PORT,
    () => {

        console.log(
            `🌐 Render server running on port ${PORT}`
        );
    }
);
