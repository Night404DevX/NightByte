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
// Time constants
// ==============================
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour, keeps checking for old messages
const EXPIRATION_TIME = 6 * 60 * 60 * 1000;  // 6 hours (messages older than this will be removed)


// ==============================
// Convert hex to RGB for CSS variable
// ==============================
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

// ==============================
// Apply theme color to chat bubbles
// ==============================
function updateAccentRgb() {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim() || '#64d2ff';
  document.documentElement.style.setProperty('--accent-rgb', hexToRgb(accent));
}

// Initial call
updateAccentRgb();

// ==============================
// Add message to chat box
// ==============================
function addMessageToChat(username, message, timestamp, isOwn = false) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  if (isOwn) msgDiv.classList.add("own-message");

  const date = new Date(timestamp);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="message-bubble">
      <div class="message-header">
        <strong>${username}</strong>
        <span class="message-time">${timeString}</span>
      </div>
      <div class="message-text">${message}</div>
    </div>
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==============================
// Cleanup old messages from Firebase
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

// Run cleanup on load and schedule hourly
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
  addMessageToChat(data.username, data.message, data.timestamp);
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

// ==============================
// Event listeners
// ==============================
sendBtn.addEventListener("click", sendMessage);

// Enter to send, Shift+Enter for newline
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
