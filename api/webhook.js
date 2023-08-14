const axios=require('axios');

function handleWebhookEvent(event){
    if(event.message){
        const senderId=event.sender.id;
        const messageText=event.message.text;
    }
    
}

module.exports={
    handleWebhookEvent
}