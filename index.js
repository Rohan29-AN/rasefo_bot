const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { config } = require('dotenv')
const webhook = require('./api/webhook');
const messenger = require('./api/messenger');

config()


const PORT = process.env.PORT || 3000
app.use(bodyParser.json())


app.get('/',(req,res) => {
    res.send("Welcome to Rasefo Bot")
})

app.get('/test',(req,res) => {
    res.send("Mode test indray")
})

app.get('/webhook', (req, res) => {
    console.log("GET WEBHOOK")
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];


    if (mode && (token === VERIFY_TOKEN)) {
        console.log("TOKEN OK")
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }

})

app.post('/webhook', (req, res) => {
    console.log("post WEBHOOK")
    const body = req.body;
    if (body.object === 'user') {
        const userEvent = body.entry && body.entry[0];

        if (userEvent && userEvent.messaging && userEvent.messaging[0]) {
            const userMessaging = userEvent.messaging[0];

            const userMessage = userMessaging.message && userMessaging.message.text;
            const senderId = userMessaging.sender && userMessaging.sender.id;

            if (userMessage && senderId) {
                webhook.handleWebhookEvent(userEvent);
            } else {
                console.error('Missing user message or sender ID');
            }
        } else {
            console.error('Invalid user event data:', userEvent);
        }
    }

    else if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhookEvent = entry.messaging[0];
            webhook.handleWebhookEvent(webhookEvent);


        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        console.log("ERROR")
        res.sendStatus(404);
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})