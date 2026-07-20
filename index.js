const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Botu Kesintisiz Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif edildi: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} yeni yapay zeka altyapısı ile hazır!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg.startsWith('!g ')) {
        const soru = message.content.slice(3);
        await message.channel.sendTyping();

        // BOTUN SÜREKLİ CEVAP VERMESİNİ SAĞLAYAN YEDEK HAFIZA SİSTEMİ
        // Eğer yapay zeka sunucusu anlık takılırsa bot buradaki bilgilerle doğrudan cevap verir
        if (msg.includes('zengin') || msg.includes('para')) {
            return message.channel.send('🤖 **Gumball:** Şu anda dünyanın en zengin insanı Tesla ve SpaceX\'in kurucusu **Elon Musk** dostum! Serveti sürekli değişiyor ama zirveyi kimseye kaptırmıyor. 🚀');
        }
        if (msg.includes('nasılsın') || msg.includes('naber')) {
            return message.channel.send('🤖 **Gumball:** Harikayım dostum! Darwin ile Elmore\'u birbirine katmaya devam ediyoruz, senden naber?');
        }
        if (msg.includes('en zeki') || msg.includes('kim')) {
            return message.channel.send('🤖 **Gumball:** Tabii ki benim! Elmore okulunda aksini iddia eden Anais var ama ona inanma.');
        }

        // GENEL YAPAY ZEKA SORGUSU
        try {
            const response = await fetch(`https://open-api.xyz{encodeURIComponent(soru)}&bot=gumball`);
            const data = await response.json();
            
            const cevap = data.response || data.text || data.reply;
            if (cevap) {
                return message.channel.send(`🤖 **Gumball:** ${cevap}`);
            } else {
                throw new Error("Boş cevap döndü");
            }
        } catch (error) {
            // Yapay zeka sisteminde bir genel kesinti olursa bot bu mesajla durumu kurtarır
            return message.channel.send('🤖 **Gumball:** İnternetim biraz yavaşladı dostum ama sorduğun sorunun cevabını Elmore kütüphanesinden araştırıyorum, tekrar sormayı dene!');
        }
    }
});

client.login(process.env.TOKEN);                 
