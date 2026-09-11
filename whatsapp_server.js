const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

// 🔴 சரிசெய்யப்பட்ட Client அமைப்பு மற்றும் Cloud Server கமாண்டுகள்
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('கீழே உள்ள QR கோடை உங்கள் மொபைல் WhatsApp-ல் ஸ்கேன் செய்யவும்:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp வெற்றிகரமாக கனெக்ட் ஆகிவிட்டது!');
});

client.initialize();

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const formattedNumber = `91${number}@c.us`; 
    
    try {
        await client.sendMessage(formattedNumber, message);
        res.json({ status: 'success', message: 'Message sent!' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// 🔴 Cloud Server-க்கு ஏற்ற Port அமைப்பு
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Node.js WhatsApp API Port ${PORT}-ல் இயங்குகிறது...`);
});
