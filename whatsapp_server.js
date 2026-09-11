const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

let qrCodeHtml = "<h3 style='text-align:center; margin-top:50px;'>QR Code இன்னும் தயாராகவில்லை... 1 நிமிடம் கழித்து Page-ஐ Refresh செய்யவும்...</h3>";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async (qr) => {
    console.log('✅ QR Code ரெடி! பிரவுசர் லிங்கில் பார்க்கவும்.');
    const qrImage = await qrcode.toDataURL(qr);
    qrCodeHtml = `<div style="text-align:center; margin-top:50px;">
                    <h2>WhatsApp-ஐ Connect செய்ய ஸ்கேன் செய்யவும்</h2>
                    <img src="${qrImage}" style="width:300px; height:300px; border:2px solid #000; padding:10px;"/>
                  </div>`;
});

client.on('ready', () => {
    console.log('✅ WhatsApp வெற்றிகரமாக கனெக்ட் ஆகிவிட்டது!');
    qrCodeHtml = `<h2 style="color:green; text-align:center; margin-top:50px;">✅ WhatsApp வெற்றிகரமாக கனெக்ட் ஆகிவிட்டது!</h2>`;
});

client.initialize();

// பிரவுசரில் QR கோடைப் பார்ப்பதற்கான புதிய வழி
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Server Port ${PORT}-ல் இயங்குகிறது...`);
});
