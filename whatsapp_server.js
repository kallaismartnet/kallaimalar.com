const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

let qrCodeHtml = "<h3 style='text-align:center; margin-top:50px; font-family:sans-serif;'>QR Code thayaragukirathu... Sirithu neram kaathirukkavum...</h3>";

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "smartnet-session" }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', async (qr) => {
    console.log('✅ QR Code Ready! Browser link-il paarkavum.');
    const qrImage = await qrcode.toDataURL(qr);
    qrCodeHtml = `
        <div style="text-align:center; margin-top:50px; font-family: Arial, sans-serif;">
            <h2>WhatsApp-ai Connect seyya Scan seyyavum</h2>
            <img src="${qrImage}" style="width:300px; height:300px; border:2px solid #000; padding:10px; border-radius:10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"/>
            <p style="color: #666; margin-top: 20px;">Scan seitha pinpu, intha page-ai refresh seyyavum...</p>
        </div>
    `;
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp Authenticated aagivittathu!');
});

client.on('ready', () => {
    console.log('✅ WhatsApp Vetrigaramaga Connect Aagivittathu!');
    qrCodeHtml = `
        <div style="text-align:center; margin-top:50px; font-family: Arial, sans-serif;">
            <h2 style="color:green;">✅ WhatsApp Vetrigaramaga Connect Aagivittathu!</h2>
            <p>Inimel messages thaanaaga sellum.</p>
        </div>
    `;
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp Authentication Failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp Disconnected:', reason);
    client.initialize();
});

client.initialize();

app.get('/qr', (req, res) => {
    res.send(qrCodeHtml);
});

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 API Server Port ${PORT}-il iyangugirathu...`);
});
