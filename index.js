const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const http = require('http');

// রেন্ডারের Environment Variables থেকে ডাটা নেওয়া
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

// স্ট্রিং সেশন ব্যবহার করা (যাতে বারবার ওটিপি না লাগে)
const stringSession = new StringSession(process.env.SESSION_STRING || "");

const GITHUB_USER = "newmp3info-glitch";
const REPO_NAME = "Userbot";

const SOURCE_CHANNEL = 'AllYonoPromoCodes';

const DESTINATION_CHANNELS = [
    'vipyonofreecode',
    'allyonorummycode',
    'totalyonocode',
    'fullyonocode',
    'superyonocode',
    'LootYonoCode',
    'FastYonoCode',
    'RealYonoCode',
    'VipFreeYonoCode',
    'WinRummynet'
];

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

async function main() {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => process.env.PHONE_NUMBER,
        phoneCode: async () => process.env.PHONE_CODE,
        password: async () => process.env.TWO_FA_PASSWORD, // যদি টু-স্টেপ ভেরিফিকেশন থাকে
        onError: (err) => console.log(err),
    });

    // প্রথমবার সফলভাবে লগইন হলে সেশন স্ট্রিং প্রিন্ট করবে (যা পরে রেন্ডারে বসাতে হবে)
    console.log("SESSION_STRING:", client.session.save());

    console.log("🚀 Userbot is successfully running and connected!");

    client.addEventHandler(async (event) => {
        const message = event.message;
        if (!message) return;

        try {
            const chat = await message.getChat();
            if (chat && (chat.username === SOURCE_CHANNEL || chat.title === SOURCE_CHANNEL)) {
                let rawText = message.text || message.caption || '';
                
                let gameNameMatch = rawText.match(/(.*?)\s+New\s+PromoCode/i);
                let promoMatch = rawText.match(/Claim\s*>>\s*(.*)/i);

                if (!gameNameMatch || !promoMatch) {
                    return; 
                }

                let gameName = gameNameMatch.trim();
                let promoCodeText = promoMatch.trim();

                if (!promoCodeText) {
                    return;
                }

                let cleanGameKey = gameName.toLowerCase();

                if (!GAME_LINKS[cleanGameKey]) {
                    return; 
                }

                let userCustomLink = GAME_LINKS[cleanGameKey];

                let imageFileName = cleanGameKey.replace(/\s+/g, '-') + '.jpg';
                let githubImageUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/${imageFileName}`;

                let formattedText = `<b>${gameName} ➔ New promo code fast claim now!!</b>\n\n` +
                    `🎁 <b>PROMO CODE ➔</b> <code>${promoCodeText}</code>\n\n` +
                    `🎁 <b>New Users 🎉 SignUp Bonus Upto ₹49 - ₹199</b> <b>"</b>\n\n` +
                    `🎰 <b>${gameName.toUpperCase()} LINK</b> ➔ <a href="${userCustomLink}"><b>Download Now</b></a>📱\n\n` +
                    `💰 <b>Minimum Amount ₹100 First Withdrawal</b> <b>"</b>\n\n` +
                    `🔥 <b>Join & Pin this channel for daily promo codes!</b> <b>"</b>`;

                for (let targetChat of DESTINATION_CHANNELS) {
                    try {
                        await client.sendFile(targetChat, {
                            file: githubImageUrl,
                            caption: formattedText,
                            parseMode: "html"
                        });
                    } catch (err) {
                        console.error(`Error sending to ${targetChat}:`, err.message);
                    }
                }
            }
        } catch (e) {
            console.error("Error handling message:", e.message);
        }
    }, new NewMessage({}));
}

main();

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Userbot server is running 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Keep-alive server listening on port ${PORT}`);
});
