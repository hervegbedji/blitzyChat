const express = require('express');
const app = express();
const httpGeneratedServer = require('http').Server(app);
const port = process.env.PORT || 3000;

// Get my funcs
const chatEvents = require('./utils/events');

// Web Socket Protocol 
const socketio = require('socket.io');
const io = socketio(httpGeneratedServer);

// Serving static files
const path = require('path');
const publicDirectoryPath = path.join(__dirname, '../public');// __dirname, './public/ change dirname later. 

// Middleware
app.use(express.static(publicDirectoryPath));
chatEvents(io);

// Routers
app.get('/rv', (req, res) => { 
    res.send('No woman no cry');
})

app.get('/chat-app', (req, res) => {
    res.sendFile(publicDirectoryPath + "/index.html");
});

app.get('/chat', (req, res) => {
    res.sendFile(publicDirectoryPath + '/chat.html');
});


httpGeneratedServer.listen(port, () =>{
    console.log(`server is listening on port ${port}`);
})