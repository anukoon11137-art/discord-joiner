const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// ระบบกันบอทหลับสำหรับสายฟรี
app.get('/', (req, res) => res.send('Bot is Online!'));
app.listen(3000);

client.on('messageCreate', async (message) => {
    // พิมพ์ !setup ในดิสเพื่อเรียกเมนูหน้าตาแบบในรูป Master
    if (message.content === '!setup') {
        const embed = new EmbedBuilder()
            .setTitle('· ปั๊มคนเข้า >> แบบออฟไลน์ ·')
            .setDescription('**รายละเอียดของสินค้า**\n\n```เรทราคา 0.1700 ต่อคน\nขั้นต่ำ 10 คน -> สูงสุด 4388 คน```\n[💬] กรุณาป้อนจำนวนที่ต้องการปั๊ม')
            .setColor('#FF6600');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('btn_pump')
                .setLabel('จำนวนที่ต้องการปั๊ม')
                .setEmoji('👥')
                .setStyle(ButtonStyle.Primary)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'btn_pump') {
        const modal = new ModalBuilder().setCustomId('modal_pump').setTitle('ป้อนจำนวนที่ต้องการ');
        const input = new TextInputBuilder()
            .setCustomId('pump_amount')
            .setLabel('จำนวนที่ต้องการปั๊ม')
            .setPlaceholder('ตัวอย่าง: 100')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        modal.addComponents(new ActionRowBuilder().addComponents(input));
        await interaction.showModal(modal);
    }
    
    if (interaction.isModalSubmit() && interaction.customId === 'modal_pump') {
        const amount = interaction.fields.getTextInputValue('pump_amount');
        await interaction.reply({ content: `🚀 ระบบกำลังเริ่มดึงคนจำนวน ${amount} คนเข้าเซิร์ฟ... (สถานะ: กำลังดำเนินการ)`, ephemeral: true });
    }
});

// บรรทัดสำคัญ: เอา Token บอทของ Master มาใส่ในเครื่องหมาย ' ' นะครับ
client.login(process.env.TOKEN)
