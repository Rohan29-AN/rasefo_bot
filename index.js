const express =require('express');
const bodyParser = require('body-parser');
const app = express();
const {config}=require('dotenv')
const webhook=require('./api/webhook');

config()


const PORT=process.env.PORT || 3000
app.use(bodyParser.json())

app.get('/webhook',(req,res)=>{
    const body=req.body

    if(body.object=='page'){
        body.entry.forEach((entry)=>{
            const webHookEvent=entry.messaging[0]
            webhook.handleWebhookEvent(webHookEvent)
        })
        res.status(200).send('EVENT_RECEIVED')
    }
    else{
        res.sendStatus(400)
    }
    console.log("Hello",process.env.VERIFY_TOKEN)

})

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})