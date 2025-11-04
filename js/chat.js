// Import Firebase (ESM version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// 🔧 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDqT79o5AxFMTUmfiyelG-mPX7axmu1TE4",
    authDomain: "silentgames-f9785.firebaseapp.com",
    databaseURL: "https://silentgames-f9785-default-rtdb.firebaseio.com",
    projectId: "silentgames-f9785",
    storageBucket: "silentgames-f9785.firebasestorage.app",
    messagingSenderId: "114016702963",
    appId: "1:114016702963:web:11573d14ef695c81670286",
    measurementId: "G-7M1W2RMNHE"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const usernameInput = document.getElementById("username");

// Listen for new messages
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  const msg = document.createElement("div");
  msg.classList.add("chat-message");
  msg.innerHTML = `<span>${data.username}:</span> ${data.message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
sendBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim() || "Guest";
  const message = messageInput.value.trim();
  if (message === "") return;

  push(messagesRef, { username, message });
  messageInput.value = "";
});
