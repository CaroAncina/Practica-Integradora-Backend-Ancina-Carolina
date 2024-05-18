const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;
    
    socket.emit('nuevoMensaje', { user, message });

    document.getElementById('message').value = '';
});

socket.on('mensajes', (mensajes) => {
    chatMessages.innerHTML = '';
    mensajes.forEach(({ user, message }) => {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = `<strong>${user}</strong>: ${message}`;
        chatMessages.appendChild(messageElement);
    });
});

socket.on('nuevoMensaje', (mensaje) => {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${mensaje.user}</strong>: ${mensaje.message}`;
    chatMessages.appendChild(messageElement);
});
