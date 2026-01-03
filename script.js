const socket = io();

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const messagesList = document.getElementById("messages");
const chatBox = document.getElementById("chat-box");

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, type, messageId = generateId()) {
    const li = document.createElement("li");
    li.dataset.id = messageId;

    const messageBubble = document.createElement("div");
    messageBubble.classList.add(type);
    messageBubble.textContent = text;

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = getTime();
    messageBubble.appendChild(timestamp);
    if (type === "sent") {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "⊗";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => deleteMessage(messageId, li);
        messageBubble.appendChild(deleteBtn);
    }

    li.appendChild(messageBubble);
    messagesList.appendChild(li);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function deleteMessage(messageId, element) {
    element.remove();
    socket.emit('delete message', messageId);
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    const messageId = generateId();
    addMessage(text, "sent", messageId);
    socket.emit('chat message', { text: text, id: messageId });
    saveMessageToStorage(text, "sent", messageId);

    input.value = "";
}
socket.on('chat message', (data) => {
    addMessage(data.text, "received", data.id);
    saveMessageToStorage(data.text, "received", data.id);
});
socket.on('delete message', (messageId) => {
    const messageElement = messagesList.querySelector(`li[data-id="${messageId}"]`);
    if (messageElement) {
        messageElement.remove();
    }
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
});
function saveMessageToStorage(text, type, messageId) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages.push({ text, type, id: messageId, time: getTime() });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}
window.addEventListener('load', () => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        messages.forEach(msg => {
            addMessage(msg.text, msg.type, msg.id);
        });
    }
});
input.addEventListener('focus', () => {
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 300);
});
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
