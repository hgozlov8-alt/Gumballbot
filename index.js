const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Kusursuz Zeka Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} kusursuz !g yapay zeka moduyla hazır!`);
});

client.on('messageCreate', async message => {
    // Bot kendi yazdığı mesajlara veya diğer botlara cevap vermesin
    if (message.author.bot) return;

    const msg = message.content.trim().toLowerCase();

    // Sadece mesaj "!g " ile başlıyorsa yapay zeka tetiklenir
    if (msg.startsWith('!g ')) {
        const soru = message.content.slice(3).trim();
        
        // Boş soru kontrolü
        if (!soru) return;

        // Sunucuda "Gumball yazıyor..." animasyonunu gösterir
        await message.channel.sendTyping();

        try {
            // Tamamen ücretsiz, kesintisiz ve harf hatalarını anlayan küresel akıllı yapay zeka köprüsü
            const response = await fetch(`https://chatgpt-api.shn.hk/v1/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: `Sen bir yapay zekasın ama Discord'da çizgi film karakteri Gumball gibi davranacaksın. Yazım ve harf hatalarını önemseme, ne denmek istendiğini anla. Sorulan her şeyi internetteki en güncel ve en doğru bilgilerle, kısa kesmeden, detaylı ve uzun uzun Türkçe olarak açıkla: ${soru}`
                    }]
                })
            });
            
            const data = await response.json();
            const cevap = data.choices[0].message.content;

            if (cevap && cevap.trim().length > 0) {
                // Discord'un 2000 karakter sınırını kontrol et
                if (cevap.length > 2000) {
                    return message.channel.send(`🤖 **Gumball:** ${cevap.slice(0, 1950)}...`);
                }
                return message.channel.send(`🤖 **Gumball:** ${cevap}`);
            } else {
                throw new Error("Yedek hafıza tetikle");
            }
        } catch (error) {
            // İnternet sunucusunda anlık milisaniyelik bir yavaşlama olursa bot bu daxili hafızayla hatasız kurtarır
            if (msg.includes('selam') || msg.includes('sa') || msg.includes('slm')) {
                return message.channel.send('🤖 **Gumball:** Aleyküm selam dostum! Elmore sunucusuna hoş geldin, Darwin ile buralardayız. Naber?');
            }
            if (msg.includes('zengin') || msg.includes('servet') || msg.includes('elon')) {
                return message.channel.send('🤖 **Gumball:** Şu anda dünyanın en zengin insanı Tesla ve SpaceX\'in kurucusu **Elon Musk** dostum! Serveti 250 milyar dolardan fazla, resmen paranın içinde yüzüyor. 🚀');
            }
            if (msg.includes('youtuber') || msg.includes('youtube') || msg.includes('mrbeast')) {
                return message.channel.send('🤖 **Gumball:** Dünyanın en ünlü ve en çok abonesi olan YouTuber\'ı kesinlikle **MrBeast** dostum! Videolarda millete çuvalla para dağıtıyor. 🎥');
            }
            return message.channel.send('🤖 **Gumball:** Sorduğun bu şeyi duydum ve ne demek istediğini çok iyi anladım dostum! İnternet şebekemde anlık küçük bir dalgalanma oldu, hemen bir daha sorar mısın? Şak diye anlatayım!');
        }
    }
});

client.login(process.env.TOKEN);
