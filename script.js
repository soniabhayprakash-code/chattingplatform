const socket = io();
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const messagesList = document.getElementById("messages");
const chatBox = document.getElementById("chat-box");
function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function addMessage(text, type) {
    const li = document.createElement("li");
    const messageBubble = document.createElement("div");
    messageBubble.classList.add(type);
    messageBubble.textContent = text;

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = getTime();
    messageBubble.appendChild(timestamp);

    li.appendChild(messageBubble);
    messagesList.appendChild(li);
    chatBox.scrollTop = chatBox.scrollHeight;
}
function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;
    addMessage(text, "sent");
    socket.emit('chat message', text);
    saveMessageToStorage(text, "sent");
    input.value = "";
}
socket.on('chat message', (text) => {
    addMessage(text, "received");
    saveMessageToStorage(text, "received");
});
function saveMessageToStorage(text, type) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages.push({ text: text, type: type, time: getTime() });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
window.addEventListener('load', () => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        messages.forEach(msg => {
            addMessage(msg.text, msg.type);
        });
    }
});



