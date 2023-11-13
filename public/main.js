const socket = io();

const clientTotal = document.getElementById("clients-total");
socket.on("client-total", (data) => {
    console.log(data);
    clientTotal.innerText = `Total clients active :${data}`;
});
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});
function sendMessage() {
    if(messageInput.value === "")return;
    console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dataTime: new Date(),
    };
    socket.emit("message", data);
    addMessageToUI(true,data);
    messageInput.value = "";
}
socket.on("chatMessage", (data) => {
    console.log(data);
    addMessageToUI(false,data);
});
function addMessageToUI(isOwnMessage,data) {
    const element = `
        <li class="${isOwnMessage?"message-right":"message-left"}">
          <p class="message">
            ${data.message}
            <span>${data.name}</span>
          </p>
        </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}
function scrollToBottom(){
    messageContainer.scroll(0,messageContainer.scrollHeight);
}