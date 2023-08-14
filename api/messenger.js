const { default: axios } = require("axios");

function sendAPI(senderId, input) {
    console.log("Tonga aty", senderId)
    console.log("Message: " + input)
    //check type of message
    const isNumber = /^-?\d+(\.\d+)?$/.test(input);
    let filter = ''
    if (isNumber) {
        filter = ''
    }
    else {
        filter = 'name'
    }
    let url_base = process.env.API_BACC + filter + '/' + input.trim()
    console.log(url_base)
    axios.get(url_base).then((res) => {
        /* console.log(`Status: ${res.status}`)*/
        console.log('Body', res.data.bacc)
        let result = ''
        if (res.data.bacc.length > 0) {

            console.log("Atoooo")
            let data_user = res.data.bacc[0]
            if (data_user.resultat === 'Admis') {
                result = 'Arahabaina enao Rasefo ' + data_user.nom + ' (' + data_user.num + ' - Serie' + data_user.serie + ') fa afaka avec mention ' + data_user.mention

            }
            else {
                result = 'Mahereza ry akamako , aza kivy fa ataovy milay ny @ heritaona. Vitanao io Sefo a'
            }
        }
        else {
            result = 'Ooops, hamarino tsara ny anarana na ny laharana azafady'
        }

        console.log(result)

        sendText(senderId, result)
    }).catch((err) => {
        console.log("Error: ${err.message}")
    });
}

function sendText(senderId, messageData) {
    console.log("SenderId ", senderId)
    console.log("MessageData ", messageData)


    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            access_token: PAGE_ACCESS_TOKEN,
        }
    };

    let url_base = 'https://graph.facebook.com/v17.0/' + process.env.PAGE_ID + '/messages'
    console.log("Url base", url_base)
    console.log("Message alefa", messageData)
    axios.post(url_base, {
        recipient: { id: senderId},
        message: {
            text: messageData
        },
    }, axiosConfig)
        .then(response => {
            console.log('Message sent:', response.data);
        })
        .catch(error => {
            console.error('Error sending message:', error.response.data);
        });
}

module.exports = {
    sendAPI
}