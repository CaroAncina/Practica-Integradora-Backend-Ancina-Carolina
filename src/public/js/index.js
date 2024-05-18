const socket = io();
socket.emit('message', "Conectado con WebSocket");
socket.on('individual', data => {console.log(data)});