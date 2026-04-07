const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-lite"
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
	    '--no-first-run',
	    '--no-zygote',
	    '--single-process',
	    '--disable-gpu',
        ]
    }
});

// 🔥 ID GROUP
const targetGroup = "120363424159405775@g.us";

// 🔥 DATABASE KATA KASAR
const bannedWords = [
    "anjing","babi","kontol","memek","bangsat","tolol",
    "goblok","idiot","brengsek","kampret","ngentot",
    "jancok","pepek","puki","lonte"
];

// 🔥 NORMALIZE ANTI BYPASS
function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[@4]/g, "a")
        .replace(/[!1|]/g, "i")
        .replace(/3/g, "e")
        .replace(/0/g, "o")
        .replace(/5/g, "s")
        .replace(/7/g, "t")
        .replace(/[^a-z]/g, "")
        .replace(/(.)\1+/g, "$1");
}

// QR
client.on('qr', qr => {
    console.log("Scan QR:");
    qrcode.generate(qr, { small: true });
});

// READY
client.on('ready', () => {
    console.log("Bot ringan siap 🚀");
});

// 🔥 MAIN
client.on('message_create', async message => {
    try {
        if (!message.from.includes('@g.us')) return;
        if (message.from !== targetGroup) return;

        // 🔥 gabung body + caption
        const textContent = (message.body || "") + " " + (message.caption || "");

        if (!textContent.trim()) return;

        console.log("TEXT:", textContent);

        const clean = normalize(textContent);

        const isBad = bannedWords.some(word => clean.includes(word));

        if (isBad) {
            await message.delete(true);
            await message.reply("⚠️ Jangan ngomong kasar!");
        }

    } catch (err) {
        console.log("Error:", err);
    }
});

// auto reconnect
client.on('disconnected', () => {
    console.log("Reconnect...");
    client.initialize();
});

client.initialize();