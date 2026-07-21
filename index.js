const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Saf Turkce Modu Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} sadece Türkiye Türkçesi moduyla aktif edildi!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg.startsWith('!g ')) {
        const soru = message.content.slice(3);
        await message.channel.sendTyping();

        try {
            // Sadece Türkiye Türkçesi Wikipedia veritabanından her şeyi canli arıyoruz
            const searchRes = await fetch(`https://wikipedia.org{encodeURIComponent(soru)}&format=json&origin=*`);
            const searchData = await searchRes.json();
            
            if (searchData.query && searchData.query.search.length > 0) {
                const enYakinBaslik = searchData.query.search[0].title;
                
                // Bulunan bilginin detaylı Türkçe açıklamasını çekiyoruz
                const detailRes = await fetch(`https://wikipedia.org{encodeURIComponent(enYakinBaslik)}&format=json&origin=*`);
                const detailData = await detailRes.json();
                
                const pages = detailData.query.pages;
                const pageId = Object.keys(pages)[0];
                let bilgi = pages[pageId].extract;

                if (bilgi && bilgi.trim().length > 0) {
                    let gumballCevabi = `🤖 **Gumball:** Bak dostum, interneti altüst ettim ve senin için buldum! **${enYakinBaslik}** hakkında bilmen gereken her şey tam olarak burada yazıyor: \n\n${bilgi}`;
                    
                    if (gumballCevabi.length > 2000) {
                        gumballCevabi = gumballCevabi.slice(0, 1950) + "... Devamı Elmore kütüphanesinde, git kendin oku artık!";
                    }
                    return message.channel.send(gumballCevabi);
                }
            }
            throw new Error("Yedek sisteme gec");
        } catch (error) {
            // Eğer aratılan şey çok özel veya argo içeren bir şeyse botun kendi iç Türkçe hafızası devreye girer
            if (msg.includes('zengin') || msg.includes('servet') || msg.includes('elon')) {
                return message.channel.send('🤖 **Gumball:** Şu anda dünyanın en zengin insanı Tesla ve SpaceX\'in patronu olan **Elon Musk** dostum! [Forbes] 250 milyar dolardan fazla parası var, adam resmen paranın içinde yüzüyor!');
            }
            if (msg.includes('youtuber') || msg.includes('youtube') || msg.includes('mrbeast')) {
                return message.channel.send('🤖 **Gumball:** Dünyanın en ünlü ve en çok abonesi olan YouTuber\'ı kesinlikle **MrBeast** dostum! Videolarında millete çuvalla para dağıtıyor, keşke bize de biraz koklatsa.');
            }
            if (msg.includes('naber') || msg.includes('nasilsin') || msg.includes('selam')) {
                return message.channel.send('🤖 **Gumball:** Harikayım dostum, artık tamamen ve sadece Türkiye Türkçesi konuşuyorum! Darwin\'le sunucuyu birbirine katmaya geldik. Senden naber, sunucuda ortamlar nasıl gidiyor?');
            }
            return message.channel.send(`🤖 **Gumball:** "${soru}" hakkında internetteki her şeyi araştırdım dostum! İstediğin her bilgiye sahibim. Kelimeleri tam doğru yazıp bana tekrar sormayı dene, şak diye Türkçe anlatayım! 💥`);
        }
    }
});

client.login(process.env.TOKEN);
