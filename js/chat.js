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

  // Time handling
  let timeString = "";
  if (timestamp && !isNaN(timestamp)) {
    const date = new Date(timestamp);
    timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  msgDiv.innerHTML = `
    <div class="message-bubble">
      <div class="message-header">
        <strong>${username}</strong>
        ${timeString ? `<span class="message-time">${timeString}</span>` : ""}
      </div>
      <div class="message-text">${message}</div>
    </div>
  `;
  
   // Check if user is near the bottom before appending
  const isNearBottom =
    chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 50;

  chatBox.appendChild(msgDiv);

  // Only scroll if the user was near the bottom
  if (isNearBottom) {
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
// Chat Filter + Timeout (Persistent)
// ==============================
const bannedWords = [
  "badword1", "badword2", "slur1", "slur2", "offensiveword", "curseword"
];

let userWarnings = parseInt(localStorage.getItem("userWarnings")) || 0;
let muteUntil = parseInt(localStorage.getItem("muteUntil")) || 0;

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[\s._\-@#$%^&*()+=!~`|\\\/[\]{};:'",<>?]/g, "")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");
}

function containsBannedWord(text) {
  const normalized = normalizeText(text);
  return bannedWords.some(word => normalized.includes(normalizeText(word)));
}

function showWarning(msg, color = "var(--accent-1)") {
  let warning = document.getElementById("chat-warning");
  if (!warning) {
    warning = document.createElement("div");
    warning.id = "chat-warning";
    warning.style.position = "fixed";
    warning.style.bottom = "70px";
    warning.style.left = "50%";
    warning.style.transform = "translateX(-50%)";
    warning.style.padding = "12px 18px";
    warning.style.borderRadius = "14px";
    warning.style.background = "rgba(20,20,30,0.6)";
    warning.style.backdropFilter = "blur(10px)";
    warning.style.border = `1px solid ${color}`;
    warning.style.boxShadow = `0 0 20px ${color}55`;
    warning.style.color = "var(--text)";
    warning.style.fontSize = "14px";
    warning.style.fontWeight = "500";
    warning.style.zIndex = "9999";
    warning.style.transition = "opacity 0.4s ease";
    document.body.appendChild(warning);
  }
  warning.textContent = msg;
  warning.style.opacity = 1;
  setTimeout(() => (warning.style.opacity = 0), 3000);
}

// On load, show mute status if still muted
document.addEventListener("DOMContentLoaded", () => {
  const now = Date.now();
  if (muteUntil > now) {
    const remaining = Math.ceil((muteUntil - now) / 1000);
    showWarning(`⏳ You are still muted for ${remaining}s`, "rgba(255,100,100,0.8)");
  } else {
    localStorage.removeItem("muteUntil");
  }
});


// ==============================
// Send message
// ==============================
function sendMessage() {
  const username = usernameInput.value.trim() || "Guest";
  const message = messageInput.value.trim();
  if (!message) return;

  const now = Date.now();

  // Check mute status
  if (now < muteUntil) {
    const remaining = Math.ceil((muteUntil - now) / 1000);
    showWarning(`⏳ You’re muted for ${remaining}s`, "rgba(255,100,100,0.8)");
    return;
  }

  // Filter for bad words
  if (containsBannedWord(message)) {
    userWarnings++;
    localStorage.setItem("userWarnings", userWarnings);

    let muteTime = 0;
    if (userWarnings >= 3) {
      // Escalating mute durations
      if (userWarnings === 3) muteTime = 1 * 60 * 1000;       // 1 min
      else if (userWarnings === 4) muteTime = 2 * 60 * 1000;  // 2 min
      else if (userWarnings === 5) muteTime = 5 * 60 * 1000;  // 5 min
      else muteTime = 10 * 60 * 1000;                         // 10+ min

      muteUntil = now + muteTime;
      localStorage.setItem("muteUntil", muteUntil);
      showWarning(`🚫 You’ve been muted for ${muteTime / 60000} minutes`, "rgba(255,80,80,0.8)");
    } else {
      showWarning("⚠️ Message blocked — inappropriate language detected", "rgba(255,150,100,0.9)");
    }

    messageInput.value = "";
    return;
  }

  // If allowed, send the message
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

// ==============================
// Image Preview Functionality
// ==============================
const imagePreviewOverlay = document.getElementById("image-preview-overlay");
const previewImg = document.getElementById("preview-img");

chatBox.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".message-text")) {
    previewImg.src = e.target.src;
    imagePreviewOverlay.style.display = "flex";
  }
});

imagePreviewOverlay.addEventListener("click", () => {
  imagePreviewOverlay.style.display = "none";
  previewImg.src = "";
});

