const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => { res.send("Gumball Aktif!"); });
app.listen(PORT, () => console.log(`Port aktif: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} yapay zekayla aktif edildi!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase();

    if (msg.startsWith('!gumball ')) {
        const soru = message.content.slice(9);
        await message.channel.sendTyping();

        try {
            const response = await fetch(`https://popcat.xyz{encodeURIComponent(soru)}`);
            const data = await response.json();
            return message.channel.send(`🤖 **Gumball:** ${data.response}`);
        } catch (error) {
            return message.channel.send('Şu an beynim durdu dostum, sonra tekrar sor!');
        }
    }
});

client.login(process.env.TOKEN);
