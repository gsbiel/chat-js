const express = require('express');
const path = require("path");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});


let messages = [];

// Configura conexão dos clientes através do socket
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('contentChat', messages);
    
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit("receivedMessage", data);
    });
   
});

server.listen(3000);


/*
    O socket tem três eventos basicamente:
    socket.on() -> Usado para ouvir a chegada de mensagens pelo socket. Cada mensagem que chega possui uma identificação. Então você pode configurar diferentes lógicas para diferentes tipos de mensagens que chegam pelo socket.

    socket.emit() -> Envia uma mensagem via socket do servidor para o cliente, através do socket que conecta ambos

    socket.broadcast.emit() -> Envia uma mensagem para todos os sockets com os quais o servidor possui conexão. Essa mensagem também recebe uma identificação, e assim, no lado do cliente, você programa o socket para ouvir por notificações dos tipos identificados.
*/