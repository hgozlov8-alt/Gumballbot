const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Elmore Sistemi Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} çökməyən daxili yaddaşla aktiv edildi!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg.startsWith('!g ')) {
        const soru = message.content.slice(3);
        await message.channel.sendTyping();

        // 1. DÜNYANIN EN ZENGİN İNSANI SORGUSU
        if (msg.includes('zengin') || msg.includes('servet') || msg.includes('para') || msg.includes('elon')) {
            return message.channel.send('🤖 **Gumball:** Hazırda dünyanın ən zəngin insanı Tesla və SpaceX-in qurucusu **Elon Musk** dostum! [Forbes] Adamın 250 milyard dollardan çox sərvəti var, kosmosa raket göndərib pulu qırır. 🚀 Biz hələ Elmore məktəbində Darwinlə pulsuz nahar axtaraq...');
        }

        // 2. YOUTUBER SORGUSU
        if (msg.includes('youtuber') || msg.includes('youtube') || msg.includes('mrbeast')) {
            return message.channel.send('🤖 **Gumball:** Dünyanın ən böyük və ən çox abunəçisi olan fərdi YouTuber-ı **MrBeast**-dir dostum! Adam videolarda milyonlarla dollar paylayır. Kaş bir gün Elmore-a gəlsə də bizə də bir az pul versə, yoxsa Riçard yenə bütün ev pulunu pizzaya xərcləyəcək! 🎥');
        }

        // 3. SOHBET / NABER SORGUSU
        if (msg.includes('naber') || msg.includes('nasılsın') || msg.includes('selam')) {
            return message.channel.send('🤖 **Gumball:** Harikayım dostum! Darwinlə birlikdə Elmore-u bir-birinə qatırıq. Anais yenə bizə dərs öyrətməyə çalışır amma biz təbii ki, onu dinləmirik. Səndə nə var nə yox, sunucuda vəziyyətlər necə getdi?');
        }

        // 4. EN ZEKİ KİM SORGUSU
        if (msg.includes('zeki') || msg.includes('akıllı')) {
            return message.channel.send('🤖 **Gumball:** Əlbəttə ki, mənəm dostum! Elmore məktəbinin ən dahi pişiyiyəm. Evdə Anais özünü ağıllı göstərməyə çalışır amma hamısı fırıldaqdır, inanma ona!');
        }

        // 5. OYUN SORGUSU (ROBLOX / CS)
        if (msg.includes('oyun') || msg.includes('roblox') || msg.includes('counter')) {
            return message.channel.send('🤖 **Gumball:** Oyun oynamaq? Bax bu tam mənlik işdir dostum! Darwinlə gün boyu kompüter arxasında oturub oyun oynayırıq, sonra anam gəlib bizi evdən qovur. Sən hansı oyunu oynayırsan görüm?');
        }

        // GENEL YAPAY ZEKA SORGUSU (EĞER FARKLI BİR ŞEY SORULURSA)
        try {
            const response = await fetch(`https://vyturex.com{encodeURIComponent(soru)}`);
            const text = await response.text();
            
            if (text && !text.includes("Error") && !text.includes("Rate limit")) {
                return message.channel.send(`🤖 **Gumball:** ${text}`);
            } else {
                throw new Error("Daxili cavab");
            }
        } catch (error) {
            // Əgər internet tamamilə kəsilsə, bot bu uzun və əyləncəli Gumball cümləsi ilə vəziyyəti xilas edir
            return message.channel.send('🤖 **Gumball:** Sorduğun bu sual Elmore məktəbindəki test imtahanlarından daha çətin çıxdı dostum! Amma sənə uzun-uzun cavab verim: Mən hər şeyi bilirəm, sadəcə hazırda beynimin daxili şəbəkəsində Darwin naqilləri qoparıb. Sualını bir də yaz, bu səfər tam Gumball kimi cavablayacam! 💥');
        }
    }
});

client.login(process.env.TOKEN);
