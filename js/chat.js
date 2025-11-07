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
const EXPIRATION_TIME = 6 * 60 * 60 * 1000; // 6 hours

// ==============================
// Helper: convert hex to rgba
// ==============================
function hexToRgba(hex, alpha = 0.25) {
  if (!hex) hex = "#64d2ff";
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ==============================
// Add message to chat
// ==============================
function addMessageToChat(username, message, timestamp) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  msgDiv.innerHTML = `
    <div class="chat-header">
      <strong>${username}</strong>
      <span class="chat-time">${timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
    </div>
    <div class="message-bubble">${message}</div>
  `;

  const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 50;
  chatBox.appendChild(msgDiv);

  // Only auto-scroll if the user is already near the bottom
  if (isAtBottom) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// ==============================
// Cleanup old messages
// ==============================
function cleanupOldMessages() {
  const now = Date.now();
  get(messagesRef).then(snapshot => {
    snapshot.forEach(childSnap => {
      const data = childSnap.val();
      if (!data.timestamp || now - data.timestamp > EXPIRATION_TIME) {
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
  if (!data.timestamp || Date.now() - data.timestamp > EXPIRATION_TIME) {
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
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ==============================
// Theme handling
// ==============================
const themeOptions = document.querySelectorAll('.theme-option');
function applyTheme(hexColor, bg) {
  if (!hexColor) return;

  // Apply accent color
  document.documentElement.style.setProperty('--accent-1', hexColor);
  document.documentElement.style.setProperty('--accent-2', hexColor);

  // Convert hex to RGB for CSS variable
  const rgb = hexColor.replace('#','').match(/.{2}/g).map(x => parseInt(x,16));
  document.documentElement.style.setProperty('--accent-rgb', rgb.join(','));

  // Handle background
  if (bg) {
    document.documentElement.style.setProperty('--bg', bg);

    // Auto adjust text color based on background
    const brightness = (rgb[0]*299 + rgb[1]*587 + rgb[2]*114)/1000;
    const textColor = brightness < 128 ? '#ffffff' : '#111111';
    document.documentElement.style.setProperty('--text', textColor);

    // Save to localStorage
    localStorage.setItem('themeBg', bg);
    localStorage.setItem('themeText', textColor);
  } else {
    // Keep text white by default if no background
    if (!localStorage.getItem('themeText')) {
      document.documentElement.style.setProperty('--text', '#ffffff');
    }
  }

  // Update existing chat bubbles
  document.querySelectorAll('.message-bubble').forEach(bubble => {
    bubble.style.background = `rgba(${rgb.join(',')},0.25)`;
    bubble.style.border = `1px solid rgba(${rgb.join(',')},0.4)`;
  });

  // Save accent color
  localStorage.setItem('themeColor', hexColor);
}
