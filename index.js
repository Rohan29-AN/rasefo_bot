const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { config } = require('dotenv')
const webhook = require('./api/webhook');
const messenger = require('./api/messenger');

config()


const PORT = process.env.PORT || 3000
app.use(bodyParser.json())


app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];


    console.log("req query: " + req.query);
    if (mode && (token === VERIFY_TOKEN)) {
        console.log("Token Ok")
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }

})

app.post('/webhook', (req, res) => {
    console.log("ATOOOO")
    const body = req.body;
    console.log(body)
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
        console.log("OK")
        body.entry.forEach((entry) => {
            const webhookEvent = entry.messaging[0];
            //check if user clicked on "Get started"
            if (webhookEvent.postback && webhookEvent.postback.payload === 'GET_STARTED') {
                const message = "Tongasoa ny akama, ampidirino ny anarana feno na ny laharana."
                const senderId = webhookEvent.sender.id
                messenger.sendText(senderId, message)
            }
            else {
                webhook.handleWebhookEvent(webhookEvent);
            }

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