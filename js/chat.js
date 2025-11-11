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

// =====================
// Mute system variables + live countdown
// =====================
let muteEndTime = parseInt(localStorage.getItem("muteEndTime")) || 0;
let badWordCount = parseInt(localStorage.getItem("badWordCount")) || 0;
let muteCount = parseInt(localStorage.getItem("muteCount")) || 0;
let muteInterval;

// Create and style countdown display
const muteNotice = document.createElement("div");
muteNotice.id = "muteNotice";
Object.assign(muteNotice.style, {
  display: "none",
  textAlign: "center",
  padding: "10px",
  borderRadius: "10px",
  background: "rgba(255, 80, 80, 0.2)",
  border: "1px solid rgba(255, 80, 80, 0.4)",
  color: "var(--text, #fff)",
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "8px",
  transition: "opacity 0.4s ease",
});
document.querySelector(".chat-input-area").insertAdjacentElement("beforebegin", muteNotice);

function startMuteCountdown(duration) {
  const end = Date.now() + duration;
  muteEndTime = end;
  localStorage.setItem("muteEndTime", end.toString());
  muteNotice.style.display = "block";
  disableChatInput(true);

  if (muteInterval) clearInterval(muteInterval);
  muteInterval = setInterval(() => {
    const remaining = muteEndTime - Date.now();
    if (remaining <= 0) {
  clearInterval(muteInterval);
  muteNotice.style.display = "none";
  disableChatInput(false);
  localStorage.removeItem("muteEndTime");
  return;
}
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    muteNotice.textContent = `⏳ You are muted for ${m}m ${s}s due to inappropriate language.`;
  }, 1000);
}

// Resume mute countdown if page refreshes mid-mute
if (Date.now() < muteEndTime) {
  const remaining = muteEndTime - Date.now();
  startMuteCountdown(remaining);
  disableChatInput(true);
}


function disableChatInput(disabled) {
  messageInput.disabled = disabled;
  sendBtn.disabled = disabled;
  messageInput.style.opacity = disabled ? "0.6" : "1";
  sendBtn.style.opacity = disabled ? "0.6" : "1";
  messageInput.style.cursor = disabled ? "not-allowed" : "text";
  sendBtn.style.cursor = disabled ? "not-allowed" : "pointer";
}



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
// Chat Filter + Timeout + Visual Timer
// ==============================

// 🔒 Comprehensive bad word list (sanitized version, add/remove as needed)
const bannedWords = [
  // General profanity
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "pussy", "slut", "whore",
  "cock", "penis", "vagina", "ballsack", "boobs", "boobies", "blowjob", "handjob",
  "cunt", "wank", "jerkoff", "cum", "jizz", "dildo", "buttplug", "anal", "porn",
  "hentai", "nudes", "sex", "horny", "orgasm", "fap", "masturbate",

  // Insults / harassment
  "idiot", "stupid", "dumb", "moron", "loser", "retard", "r3tard", "dumbass",
  "fatass", "lazyass", "ugly", "kill yourself", "kys", "die", "die in a hole",
  "stfu", "shut up", "loser", "worthless", "trash", "noob",

  // Racist / hate speech (sanitized)
  "nigger", "nigga", "chink", "spic", "beaner", "cracker", "faggot", "fag",
  "dyke", "tranny", "retard", "mongoloid", "gook", "towelhead", "sandnigger",
  "paki", "terrorist", "nazi", "hitler", "gas the jews", "white power",

  // Self-harm / suicide encouragement
  "kill yourself", "kys", "cut yourself", "hang yourself", "jump off", "end it",

  // Coded / obfuscated versions
  "f@ck", "f*ck", "sh1t", "b1tch", "a$$", "c0ck", "c0nt", "fucc", "fukk", "phuck",
  "fuk", "fuc", "sht", "bich", "sl@t", "wh0re", "n1gga", "n1gger", "n!gger", "ret@rd",
  "r3tard", "r3t@rd", "ni99a", "ni99er", "f@ggot", "f@g", "f@gg0t"
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

function isBadUsername(name) {
  return containsBannedWord(name);
}

function showWarning(msg, color = "var(--accent-1)") {
  let warning = document.getElementById("chat-warning");
  if (!warning) {
    warning = document.createElement("div");
    warning.id = "chat-warning";
    Object.assign(warning.style, {
      position: "fixed",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "12px 18px",
      borderRadius: "14px",
      background: "rgba(20,20,30,0.6)",
      backdropFilter: "blur(10px)",
      border: `1px solid ${color}`,
      boxShadow: `0 0 20px ${color}55`,
      color: "var(--text)",
      fontSize: "14px",
      fontWeight: "500",
      zIndex: "9999",
      transition: "opacity 0.4s ease"
    });
    document.body.appendChild(warning);
  }
  warning.textContent = msg;
  warning.style.opacity = 1;
  setTimeout(() => (warning.style.opacity = 0), 3000);
}

// --- Visual mute timer bar ---
function createMuteBar(durationMs) {
  let bar = document.getElementById("mute-timer");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "mute-timer";
    Object.assign(bar.style, {
      position: "fixed",
      bottom: "55px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "300px",
      height: "6px",
      borderRadius: "6px",
      background: "rgba(255,255,255,0.1)",
      overflow: "hidden",
      zIndex: "9998",
      backdropFilter: "blur(6px)",
      border: "1px solid rgba(255,255,255,0.1)"
    });
    const fill = document.createElement("div");
    fill.id = "mute-fill";
    Object.assign(fill.style, {
      width: "100%",
      height: "100%",
      background: "var(--accent-1)",
      boxShadow: "0 0 10px var(--accent-1)",
      transition: `width ${durationMs}ms linear`
    });
    bar.appendChild(fill);
    document.body.appendChild(bar);
    setTimeout(() => {
      fill.style.width = "0%";
    }, 100);
    setTimeout(() => bar.remove(), durationMs);
  }
}

// On load: resume mute if active
document.addEventListener("DOMContentLoaded", () => {
  const now = Date.now();
  if (muteUntil > now) {
    const remaining = muteUntil - now;
    showWarning(`⏳ You’re still muted for ${(remaining / 1000).toFixed(0)}s`, "rgba(255,100,100,0.8)");
    createMuteBar(remaining);
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

  // 🛑 Check username for bad words
  if (isBadUsername(username)) {
    showWarning("🚫 Your username contains inappropriate language. Please change it.", "rgba(255,100,100,0.8)");
    usernameInput.focus();
    return;
  }


  const now = Date.now();

  // Check mute
  if (now < muteUntil) {
    const remaining = Math.ceil((muteUntil - now) / 1000);
    showWarning(`⏳ You’re muted for ${remaining}s`, "rgba(255,100,100,0.8)");
    return;
  }

  // Filter check
if (containsBannedWord(message)) {
  badWordCount++;
  localStorage.setItem("badWordCount", badWordCount);

  if (badWordCount >= 3) {
    muteCount++;
    badWordCount = 0;
    localStorage.setItem("muteCount", muteCount);
    const duration = 30 * 1000 * Math.pow(2, muteCount - 1); // 30s → 1m → 2m → 4m...
    startMuteCountdown(duration);
  } else {
    showWarning("⚠️ Inappropriate language detected. Continued use will result in a mute.", "rgba(255,150,100,0.9)");
  }

  messageInput.value = "";
  return;
}


  // Send message if clean
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
