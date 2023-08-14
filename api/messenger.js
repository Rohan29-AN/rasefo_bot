const { default: axios } = require("axios");

function sendAPI(senderId,input){
    //check type of message
    const isNumber = /^-?\d+(\.\d+)?$/.test(input);
    let filter=''
    if(isNumber){
        filter=''
    }
    else{
        filter='name'
    }
    let url_base=process.env.API_BACC+'/'+filter+'/'+input
    console.log(url_base)
    axios.get(url_base).then((res)=>{
        console.log(`Status: ${res.status}`)
        console.log('Body',res.data)
        const result=res.data

        sendText(senderId,result)
    }).catch((err)=>{
        console.log("Error: ${err.message}")
    });
}

function sendText(senderId,messageData){
    const PAGE_ACCESS_TOKEN=process.env.PAGE_ACCESS_TOKEN
    const messageData={
        text:messageData
    }

    axios.post('https://graph.facebook.com/v13.0/me/messages', {
        recipient: { id: senderId },
        message: messageData,
      }, {
        params: { access_token: PAGE_ACCESS_TOKEN },
      })
      .then(response => {
        console.log('Message sent:', response.data);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
}

module.exports={
    sendAPI
}