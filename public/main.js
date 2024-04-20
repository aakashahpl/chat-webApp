
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
    if (messageInput.value === "") return;
    const selectedFile = document.getElementById('document-input').files[0];
    const data = new FormData();
    data.append('name', nameInput.value);
    data.append('message', messageInput.value);
    data.append('dataTime', new Date());
    if (selectedFile) {
        data.append('file', selectedFile);
    }
    console.log(data.get('message'));
    // addMessageToUI(true, {message:data.get('message'),name:data.get('name')});
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: data,

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the server sends JSON response
        })
        .then(data => {
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    messageInput.value = "";
}
socket.on("chatMessage", (data) => {
    console.log(data);
    addMessageToUI(false, data);
});
function addMessageToUI(isOwnMessage, data) {
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
          <p class="message">
            ${data.message}
            <a href="${data.filePath? data.filePath : '#'}">${data.filePath? data.filePath : ''}</a>
            <span>${data.name}</span>
          </p>
        </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}
function scrollToBottom() {
    messageContainer.scroll(0, messageContainer.scrollHeight);
}