// ==============================
// Firebase imports
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// ==============================
// Firebase config
// ==============================
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

// ==============================
// Initialize Firebase
// ==============================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// ==============================
// DOM Elements
// ==============================
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const usernameInput = document.getElementById("username");

// ==============================
// Constants for cleanup
// ==============================
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

// ==============================
// Function: Add message to chat
// ==============================
function addMessageToChat(username, message, timestamp, isOwnMessage) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  if (isOwnMessage) msgDiv.classList.add("own-message");

  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  msgDiv.innerHTML = `
    <div class="message-bubble">
      <div class="message-header">
        <span class="username">${username}</span>
        <span class="timestamp">${time}</span>
      </div>
      <div class="message-text">${message}</div>
    </div>
  `;

  msgDiv.classList.add("fade-in");
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==============================
// Function: Cleanup old messages
// ==============================
function cleanupOldMessages() {
  const now = Date.now();
  get(messagesRef).then(snapshot => {
    snapshot.forEach(childSnap => {
      const data = childSnap.val();
      if (now - data.timestamp > EXPIRATION_TIME) {
        childSnap.ref.remove();
      }
    });
  });
}

// Run cleanup on load and hourly
cleanupOldMessages();
setInterval(cleanupOldMessages, CLEANUP_INTERVAL);

// ==============================
// Listen for new messages
// ==============================
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  if (Date.now() - data.timestamp > EXPIRATION_TIME) {
    snapshot.ref.remove();
    return;
  }

  const currentUser = usernameInput.value.trim() || "Guest";
  const isOwnMessage = data.username === currentUser;

  addMessageToChat(data.username, data.message, data.timestamp, isOwnMessage);
});

// ==============================
// Send message
// ==============================
function sendMessage() {
  const username = usernameInput.value.trim() || "Guest";
  const message = messageInput.value.trim();
  if (!message) return;

  const timestamp = Date.now();
  push(messagesRef, { username, message, timestamp });

  messageInput.value = "";
}

// Button click
sendBtn.addEventListener("click", sendMessage);

// Press Enter
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function setAccentRGB(accentColor) {
  const rgb = hexToRgb(accentColor);
  document.documentElement.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
}

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

