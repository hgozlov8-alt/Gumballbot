const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Canli Sohbet Modu Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Sohbet geçmişini tutan havuz
const sohbetGecmisi = new Map();

client.once('ready', () => {
    console.log(`${client.user.tag} derin sohbet hafizasiyla aktif!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg.startsWith('!g ')) {
        const soru = message.content.slice(3);
        const userId = message.author.id;

        if (!sohbetGecmisi.has(userId)) {
            sohbetGecmisi.set(userId, "");
        }
        
        let eskiKonusmalar = sohbetGecmisi.get(userId);
        await message.channel.sendTyping();

        try {
            // ŞİFRESİZ ve doğrudan en güncel yapay zekaya bağlanan akıllı köprü
            const response = await fetch(`https://kastg.xyz{encodeURIComponent("Sen Discord'daki çizgi film karakteri Gumball'sın. Tıpkı gelişmiş bir yapay zeka gibi her şeyi bil. Kelimeler yanlış yazılsa bile anla. Uzun, detaylı cümlelerle esprili fırlama bir Gumball gibi konuş. Geçmiş konuşma özeti şudur: " + eskiKonusmalar + " Yeni Soru: " + soru)}`);
            const data = await response.json();
            
            const cevap = data.result || data.response || data.text;
            
            if (cevap) {
                // Yeni konuşmayı hafızaya ekle
                sohbetGecmisi.set(userId, eskiKonusmalar + ` Kullanici: ${soru} | Gumball: ${cevap} \n`);
                return message.channel.send(`🤖 **Gumball:** ${cevap}`);
            } else {
                throw new Error("Boş cevap");
            }
        } catch (error) {
            return message.channel.send('🤖 **Gumball:** Uzun uzun konuşalım diyordun ama internetim biraz yavaşladı dostum. Sorunu hemen bir daha sorsana!');
        }
    }
});

client.login(process.env.TOKEN);
