import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// --- Replace with your Firebase Config ---
const firebaseConfig = {
 apiKey: "AIzaSyDqT79o5AxFMTUmfiyelG-mPX7axmu1TE4",
  authDomain: "silentgames-f9785.firebaseapp.com",
  databaseURL: "https://silentgames-f9785-default-rtdb.firebaseio.com",
  projectId: "silentgames-f9785",
  storageBucket: "silentgames-f9785.firebasestorage.app",
  messagingSenderId: "114016702963",
  appId: "1:114016702963:web:6d6e53e966e8b4de670286",
  measurementId: "G-ECS8Z3WEZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Elements ---
const titleInput = document.getElementById("title");
const messageInput = document.getElementById("message");
const publishBtn = document.getElementById("publishBtn");
const statusDiv = document.getElementById("status");

// --- Publish to Firestore ---
publishBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  if (!title || !message) {
    statusDiv.textContent = "Please fill out both fields!";
    statusDiv.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "announcements"), {
      title,
      message,
      timestamp: serverTimestamp(),
    });

    statusDiv.textContent = "✅ Announcement published!";
    statusDiv.style.color = "#64d2ff";

    titleInput.value = "";
    messageInput.value = "";

  } catch (error) {
    console.error("Error adding document:", error);
    statusDiv.textContent = "❌ Failed to publish.";
    statusDiv.style.color = "red";
  }
});
