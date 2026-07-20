const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Botun Render üzerinde 7/24 uyanık ve aktif kalmasını sağlayan web sunucusu
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Botu 7/24 Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif edildi: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Bot başarıyla açıldığında Render konsoluna yazılacak mesaj
client.once('ready', () => {
    console.log(`${client.user.tag} yapay zekayla aktif edildi ve Elmore hazır!`);
});

// Sunucudaki mesajları dinleme alanı
client.on('messageCreate', async message => {
    // Bot kendi yazdığı mesajlara cevap vermesin
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    // Kullanıcı mesajına "!g " ile başlıyorsa yapay zeka devreye girer
    if (msg.startsWith('!g ')) {
        // "!g " (3 karakter) kısmını siler ve sadece temiz soruyu alır
        const soru = message.content.slice(3);
        
        // Sunucuda "Gumball yazıyor..." animasyonunu gösterir
        await message.channel.sendTyping();

        try {
            // Şifresiz çalışan yapay zeka beynine bağlanıp soruyu gönderiyoruz
            const response = await fetch(`https://popcat.xyz{encodeURIComponent(soru)}`);
            const data = await response.json();
            
            // Yapay zekanın cevabını sunucuya Gumball ismiyle gönderir
            return message.channel.send(`🤖 **Gumball:** ${data.response}`);
        } catch (error) {
            console.error(error);
            return message.channel.send('Şu an beynim durdu dostum, sonra tekrar sor!');
        }
    }
});

// Gizli Render ayarlarından bot şifresini (Token) çeker
client.login(process.env.TOKEN);
