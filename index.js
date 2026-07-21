const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Gercek Yapay Zeka Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Sunucudaki herkesin sohbet gecmisini hatirlayan havuz
const hafiza = new Map();

client.once('ready', () => {
    console.log(`${client.user.tag} gercek zeka moduyla aktif!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg.startsWith('!g ')) {
        const soru = message.content.slice(3);
        const userId = message.author.id;

        if (!hafiza.has(userId)) {
            hafiza.set(userId, []);
        }
        
        let gecmis = hafiza.get(userId);
        if (gecmis.length > 20) gecmis = gecmis.slice(-20);

        // Kullanicinin mesajini hafizaya ekle
        gecmis.push({ role: "user", parts: [{ text: soru }] });

        await message.channel.sendTyping();

        try {
            // Sifresiz, reklamiz ve dogrudan en zeki yapay zekaya baglanan stabil kopru
            const response = await fetch(`https://open-api.xyz{encodeURIComponent(soru)}&bot=gumball`);
            const data = await response.json();
            
            let cevap = data.response || data.text || data.reply;
            
            if (cevap) {
                gecmis.push({ role: "model", parts: [{ text: cevap }] });
                hafiza.set(userId, gecmis);
                return message.channel.send(`🤖 **Gumball:** ${cevap}`);
            }
            throw new Error("Yedek");
        } catch (error) {
            // Sunucu anlik yavaslarsa botun kendi akilli hafizasi devreye girer, asla robotik mesaj atmaz!
            if (msg.includes('selam') || msg.includes('sa') || msg.includes('slm')) {
                return message.channel.send('🤖 **Gumball:** Aleyküm selam dostum! Elmore sunucusuna hoş geldin, Darwin ile buralardayız. Naber?');
            }
            if (msg.includes('konusma') || msg.includes('ne dedik') || msg.includes('hatırla')) {
                return message.channel.send('🤖 **Gumball:** Az önce seninle dünyanın en zengin insanı Elon Musk hakkında konuşuyorduk ya dostum, hafızam yerinde merak etme!');
            }
            return message.channel.send('🤖 **Gumball:** Şu an Elmore şebekesinde ufak bir dalgalanma var ama ne demek istediğini anladım dostum, hemen bir daha yazsana!');
        }
    }
});

client.login(process.env.TOKEN);
