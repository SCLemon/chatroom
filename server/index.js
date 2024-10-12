const express = require('express');
const { Server } = require('ws');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

const wss = new Server({ server });

var clients = {}; // 當前使用者列表
var messageDatabase = []; // 訊息暫存

wss.on('connection', (ws,req) => {
    ws.send(JSON.stringify({type:'init', msg:messageDatabase})); // {username:'',type:'init',msg:[{},{}]}

    const clientIp = req.socket.remoteAddress;
    clients[clientIp] = ws;
    
    ws.on('message', data => {
        var receviedFromClient = JSON.parse(data); // {username:'',type:'broadcast',msg:''}
        messageDatabase.push(receviedFromClient);
        try {
            broadcast(clients,receviedFromClient);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', (code, reason) => {
        delete clients[clientIp];
    });

    ws.on('error', (error) => {});
});

// 群發或單發 --> 欲發送之目標用戶名單, 欲發送之訊息
function broadcast(clients,receviedFromClient){
    var sendToClient = JSON.stringify(receviedFromClient); // {username:'',type:'broadcast',msg:''}
    for (const userId in clients) {
        if (clients.hasOwnProperty(userId) && clients[userId].readyState === 1) {
            clients[userId].send(sendToClient);
        }
    }
}
