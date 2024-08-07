const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const userIdElement = document.getElementById('userId');
const errorContainer = document.getElementById('error-container');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = userIdElement.value; 
    const message = document.getElementById('message').value;

    if (!message.trim()) {
        alert('Debe ingresar un mensaje');
        return;
    }

    socket.emit('nuevoMensaje', { user: userId, message });

    document.getElementById('message').value = '';
});

socket.on('mensajes', (mensajes) => {
    chatMessages.innerHTML = '';
    mensajes.forEach(({ user, text }) => {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = `<strong>${user.email}</strong>: ${text}`;
        chatMessages.appendChild(messageElement);
    });
});

socket.on('errorMensaje', (error) => {
    errorContainer.innerText = error;
    errorContainer.style.display = 'block';
});
