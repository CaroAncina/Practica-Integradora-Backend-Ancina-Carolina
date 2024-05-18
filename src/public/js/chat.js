const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if (user && message) {
        socket.emit('nuevoMensaje', { user, message });
    }
});

socket.on('mensajes', (messages) => {
    chatMessages.innerHTML = '';
    messages.forEach((msg) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${msg.user}</strong>: ${msg.message}`;
        chatMessages.appendChild(p);
    });
});
