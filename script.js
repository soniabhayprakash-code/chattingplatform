document.addEventListener("DOMContentLoaded", () => {

    const socket = io("https://chattingplatform.onrender.com", {
    transports: ["websocket"]
    });

    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("messageInput");
    const messagesList = document.getElementById("messages");
    const chatBox = document.getElementById("chat-box");
    const typing = document.getElementById("typing");

    function scrollToBottom() {
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
        }, 50);
    }
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;

        navigator.virtualKeyboard.addEventListener('geometrychange', (event) => {
            const keyboardHeight = event.target.boundingRect.height;
            typing.style.bottom = keyboardHeight + "px";
            scrollToBottom();
        });
    }

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

        scrollToBottom();
    }
    function sendMessage() {
        const text = input.value.trim();
        if (text === "") return;

        addMessage(text, "sent");
        socket.emit('chat message', text);
        input.value = "";
        input.style.height = "52px";
        input.style.overflowY = "hidden";
    }
    socket.on('chat message', (text) => {
        addMessage(text, "received");
    });
    sendBtn.addEventListener("click", sendMessage);

    input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
        input.style.height = "52px";
    }
    });

    input.addEventListener('focus', () => {
        setTimeout(() => {
            typing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            scrollToBottom();
        }, 400);
    });

    input.addEventListener("input", () => {
    input.style.height = "52px"; 

    if (input.scrollHeight > 52) {
        input.style.height = Math.min(input.scrollHeight, 120) + "px";
        input.style.overflowY = "auto";
    } else {
        input.style.overflowY = "hidden";
    }
    });

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
        navigator.serviceWorker.register("/chattingplatform/service-worker.js")
        .then((registration) => {
               console.log("Service Worker Registered");

               registration.update();
      })
      .catch(err => console.log("SW error", err));
     });
     }
     navigator.serviceWorker.getRegistrations().then(regs => {
          console.log("SW registrations:", regs);
     });

    
});

