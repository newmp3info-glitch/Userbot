const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const http = require("http");

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH || "";
const sessionString = process.env.SESSION_STRING || "";

// ============================================================
// GITHUB
// ============================================================

const GITHUB_USER = "newmp3info-glitch";
const REPO_NAME = "Userbot";
const GITHUB_BRANCH = "main";

// ============================================================
// SOURCE CHANNEL
// ============================================================

const SOURCE_CHANNEL = "AllYonorummyCode";

// ============================================================
// DESTINATION CHANNELS
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
// FIXED BUTTONS
//
// Userbot-এর জন্য শুধু text + url ব্যবহার করা হচ্ছে.
// কোনো BOT_TOKEN প্রয়োজন নেই.
//
// Row 1 = 2 buttons
// Row 2 = 2 buttons
// Row 3 = 1 button
// ============================================================

const FIXED_BUTTONS = [
    [
        {
            text: "🎰 New Game 45",
            url: "https://t.me/VipYonoFreeCode/3783"
        },
        {
            text: "🎰 Total Game 70",
            url: "https://t.me/AllYonoRummyCode/138"
        }
    ],

    [
        {
            text: "🤖 Yono AI Bot 🤖",
            url: "https://t.me/YonoGamingHeadAIBot"
        },
        {
            text: "🤖 Promo Code Bot 🤖",
            url: "https://t.me/spin_crush_bot"
        }
    ],

    [
        {
            text: "🔥 Yono Master App 🔥",
            url: "https://www.fastyonoapp.online/"
        }
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
// HELPER
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
    if (!rawText) return null;

    const lines = rawText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    for (const line of lines) {

        let clean = line
            .replace(/<[^>]+>/g, " ")
            .replace(/[*_`]/g, "")
            .trim();

        const match = clean.match(
            /^(.+?)\s+➞?\s*New\s+(?:App\s+)?(?:New\s+)?Promo\s*Code\b/i
        );

        if (match && match[1]) {
            return match[1]
                .replace(
                    /^[^\p{L}\p{N}]+/u,
                    ""
                )
                .replace(
                    /[^\p{L}\p{N}]+$/u,
                    ""
                )
                .trim();
        }

        const match2 = clean.match(
            /^(.+?)\s+New\s+App\b/i
        );

        if (match2 && match2[1]) {
            return match2[1]
                .replace(
                    /^[^\p{L}\p{N}]+/u,
                    ""
                )
                .replace(
                    /[^\p{L}\p{N}]+$/u,
                    ""
                )
                .trim();
        }
    }

    // Fallback:
    // GAME_LINKS-এর নামগুলোর মধ্যে source text-এ কোনটি আছে
    const lowerText = normalizeGameName(rawText);

    for (const key of Object.keys(GAME_LINKS)) {

        const normalizedKey =
            normalizeGameName(key);

        if (
            lowerText.includes(normalizedKey)
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
    if (!rawText) return null;

    const patterns = [

        /PROMO\s*CODE\s*(?:➜|➔|→|>>|:|-)\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i,

        /PROMO\s*CODE\s*[\r\n]+\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i,

        /CLAIM\s*(?:➜|➔|→|>>|:|-)\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i,

        /PROMOCODE\s*(?:➜|➔|→|>>|:|-)\s*([A-Za-z0-9][A-Za-z0-9._-]*)/i
    ];

    for (const pattern of patterns) {

        const match =
            rawText.match(pattern);

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
// GAME LINK
// ============================================================

function findGameLink(gameName) {

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
        normalized.replace(
            /\s+/g,
            "-"
        ) + ".jpg";

    return (
        "https://raw.githubusercontent.com/" +
        GITHUB_USER +
        "/" +
        REPO_NAME +
        "/" +
        GITHUB_BRANCH +
        "/" +
        imageFileName
    );
}

// ============================================================
// BUTTON VALIDATION
// ============================================================

function validateFixedButtons() {

    for (const row of FIXED_BUTTONS) {

        if (!Array.isArray(row)) {
            throw new Error(
                "Fixed button row invalid."
            );
        }

        for (const button of row) {

            if (
                !button.text ||
                !button.url
            ) {
                throw new Error(
                    "একটি button-এর text অথবা URL খালি আছে।"
                );
            }

            if (
                !/^https?:\/\//i.test(
                    button.url
                )
            ) {
                throw new Error(
                    `Invalid button URL: ${button.url}`
                );
            }
        }
    }
}

// ============================================================
// CONVERT BUTTONS FOR USERBOT
// ============================================================

function createTelegramButtons() {

    return FIXED_BUTTONS.map(row => {

        return row.map(button => {

            return Api.KeyboardButtonUrl({
                text: button.text,
                url: button.url
            });

        });

    });
}

// ============================================================
// BUILD CAPTION
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

    return (
        `<b>${safeGameName} ➞ New promo code fast claim now!!</b> 💰\n\n` +

        `🎟️ <b>PROMO CODE ➜</b> ` +
        `<code>${safePromoCode}</code>\n\n` +

        `<blockquote>` +
        `🎁 New Users 🎉 SignUp Bonus Upto ₹49 - ₹199` +
        `</blockquote>\n\n` +

        `🎰 <b>${safeGameName.toUpperCase()} LINK</b> 👉 ` +
        `<a href="${gameLink}">` +
        `<b>Download Now</b>` +
        `</a> 📱\n\n` +

        `💰 <i>Minimum Amount ₹100 First Withdrawal</i> 💸\n\n` +

        `<blockquote>` +
        `🔥 Join &amp; Pin this channel for daily promo codes!` +
        `</blockquote>`
    );
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
        processedMessages.size > 1000
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
// SEND PHOTO USING USER ACCOUNT
// ============================================================

async function sendFinalPost(
    client,
    targetChat,
    imageUrl,
    caption
) {

    const buttons =
        createTelegramButtons();

    return await client.sendFile(
        `@${normalizeUsername(targetChat)}`,
        {
            file: imageUrl,

            caption: caption,

            parseMode: "html",

            buttons: buttons
        }
    );
}

// ============================================================
// MAIN
// ============================================================

async function main() {

    console.log("");
    console.log(
        "=============================================="
    );
    console.log(
        "🚀 TELEGRAM USERBOT STARTING"
    );
    console.log(
        "=============================================="
    );

    // --------------------------------------------------------
    // ENV CHECK
    // --------------------------------------------------------

    if (
        !apiId ||
        Number.isNaN(apiId)
    ) {

        throw new Error(
            "❌ API_ID পাওয়া যায়নি।"
        );
    }

    if (!apiHash) {

        throw new Error(
            "❌ API_HASH পাওয়া যায়নি।"
        );
    }

    if (!sessionString) {

        throw new Error(
            "❌ SESSION_STRING পাওয়া যায়নি।"
        );
    }

    validateFixedButtons();

    console.log(
        "✅ API_ID found"
    );

    console.log(
        "✅ API_HASH found"
    );

    console.log(
        "✅ SESSION_STRING found"
    );

    console.log(
        "❌ BOT_TOKEN লাগবে না"
    );

    // --------------------------------------------------------
    // TELEGRAM CLIENT
    // --------------------------------------------------------

    const client =
        new TelegramClient(
            new StringSession(
                sessionString
            ),
            apiId,
            apiHash,
            {
                connectionRetries: 10,
                autoReconnect: true
            }
        );

    console.log(
        "🔄 Connecting to Telegram..."
    );

    // SESSION_STRING ব্যবহার করছি।
    // তাই Render-এ phone/code/password চাইবে না।

    await client.connect();

    // --------------------------------------------------------
    // AUTH CHECK
    // --------------------------------------------------------

    const authorized =
        await client.checkAuthorization();

    if (!authorized) {

        throw new Error(
            "❌ SESSION_STRING valid নয় অথবা session expired হয়েছে।"
        );
    }

    // --------------------------------------------------------
    // USER INFORMATION
    // --------------------------------------------------------

    const me =
        await client.getMe();

    console.log("");
    console.log(
        "=============================================="
    );

    console.log(
        "✅ USERBOT CONNECTED SUCCESSFULLY"
    );

    console.log(
        `👤 User ID: ${me.id}`
    );

    if (me.username) {

        console.log(
            `👤 Username: @${me.username}`
        );

    } else {

        console.log(
            "👤 Username: নেই"
        );
    }

    console.log(
        "=============================================="
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
        "=============================================="
    );

    // --------------------------------------------------------
    // CHECK SOURCE
    // --------------------------------------------------------

    try {

        const sourceEntity =
            await client.getEntity(
                `@${normalizeUsername(SOURCE_CHANNEL)}`
            );

        console.log(
            `✅ Source channel found: @${SOURCE_CHANNEL}`
        );

    } catch (error) {

        console.error(
            `❌ Source channel পাওয়া যাচ্ছে না: @${SOURCE_CHANNEL}`
        );

        console.error(
            error.message
        );
    }

    // --------------------------------------------------------
    // NEW MESSAGE EVENT
    // --------------------------------------------------------

    client.addEventHandler(

        async (event) => {

            const message =
                event.message;

            if (!message) {
                return;
            }

            try {

                // ------------------------------------------------
                // GET CHAT
                // ------------------------------------------------

                const chat =
                    await message.getChat();

                if (!chat) {
                    return;
                }

                const currentUsername =
                    normalizeUsername(
                        chat.username
                    );

                const sourceUsername =
                    normalizeUsername(
                        SOURCE_CHANNEL
                    );

                if (
                    currentUsername !==
                    sourceUsername
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

                    console.log(
                        `⏭️ Duplicate message skipped: ${message.id}`
                    );

                    return;
                }

                // ------------------------------------------------
                // TEXT / CAPTION
                // ------------------------------------------------

                const rawText =
                    message.message ||
                    message.text ||
                    message.caption ||
                    "";

                if (
                    !rawText ||
                    !rawText.trim()
                ) {

                    console.log(
                        "⚠️ Source post has no text."
                    );

                    return;
                }

                console.log("");
                console.log(
                    "=============================================="
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
                        "❌ Game name not detected."
                    );

                    console.log(
                        "SOURCE TEXT:"
                    );

                    console.log(
                        rawText.substring(
                            0,
                            1000
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
                        "❌ Promo code not detected."
                    );

                    console.log(
                        "SOURCE TEXT:"
                    );

                    console.log(
                        rawText.substring(
                            0,
                            1000
                        )
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
                // CAPTION
                // ------------------------------------------------

                const formattedText =
                    buildCaption(
                        gameName,
                        promoCode,
                        gameLink
                    );

                // ------------------------------------------------
                // TELEGRAM BUTTONS
                // ------------------------------------------------

                const telegramButtons =
                    createTelegramButtons();

                console.log(
                    "🔘 5 fixed buttons prepared."
                );

                // ------------------------------------------------
                // SEND TO DESTINATIONS
                // ------------------------------------------------

                let successCount = 0;
                let failedCount = 0;

                for (
                    const targetChat
                    of DESTINATION_CHANNELS
                ) {

                    try {

                        console.log("");
                        console.log(
                            `📤 Sending → @${targetChat}`
                        );

                        await sendFinalPost(
                            client,
                            targetChat,
                            imageUrl,
                            formattedText
                        );

                        successCount++;

                        console.log(
                            `✅ Sent → @${targetChat}`
                        );

                        // Delay
                        await new Promise(
                            resolve =>
                                setTimeout(
                                    resolve,
                                    800
                                )
                        );

                    } catch (error) {

                        failedCount++;

                        console.error(
                            `❌ Failed → @${targetChat}`
                        );

                        console.error(
                            error.message
                        );

                        // Flood wait handling
                        if (
                            error.message &&
                            /flood|wait/i.test(
                                error.message
                            )
                        ) {

                            console.log(
                                "⏳ Telegram FloodWait detected."
                            );

                            await new Promise(
                                resolve =>
                                    setTimeout(
                                        resolve,
                                        5000
                                    )
                            );
                        }
                    }
                }

                // ------------------------------------------------
                // RESULT
                // ------------------------------------------------

                console.log("");
                console.log(
                    "=============================================="
                );

                console.log(
                    "📊 POST RESULT"
                );

                console.log(
                    `✅ Success: ${successCount}`
                );

                console.log(
                    `❌ Failed: ${failedCount}`
                );

                console.log(
                    `📤 Total: ${DESTINATION_CHANNELS.length}`
                );

                console.log(
                    "=============================================="
                );

            } catch (error) {

                console.error(
                    "❌ MESSAGE ERROR:"
                );

                console.error(
                    error
                );
            }
        },

        new NewMessage({})
    );

    console.log("");
    console.log(
        "🟢 USERBOT IS NOW LISTENING FOR NEW POSTS..."
    );

    console.log(
        `👀 Watching: @${SOURCE_CHANNEL}`
    );

    console.log(
        "=============================================="
    );
}

// ============================================================
// START USERBOT
// ============================================================

main().catch(
    (error) => {

        console.error("");
        console.error(
            "🔥 USERBOT START ERROR"
        );

        console.error(
            error.message ||
            error
        );

        console.error("");
    }
);

// ============================================================
// RENDER HEALTH SERVER
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
    process.env.PORT || 3000;

server.listen(
    PORT,
    () => {

        console.log(
            `🌐 Render server running on port ${PORT}`
        );
    }
);
