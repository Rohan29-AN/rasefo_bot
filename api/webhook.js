const axios=require('axios');
const apiMessenger=require('./messenger')

function handleWebhookEvent(event){
        console.log("HandleWebhookEvent")
        const senderId=event.sender.id;
        const messageText=event.message.text;

        apiMessenger.sendAPI(senderId,messageText)


    
}

module.exports={
    handleWebhookEvent
}