// Firebase imports (use same config as your chat or other Firebase feature)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const popup = document.getElementById('announcement-popup');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const popupClose = document.getElementById('popup-close');

// Show popup with fade animation
function showPopup(title, message) {
  popupTitle.textContent = title;
  popupMessage.textContent = message;
  popup.hidden = false;
  setTimeout(() => popup.classList.add('show'), 10);
}

popupClose.addEventListener('click', () => {
  popup.classList.remove('show');
  setTimeout(() => popup.hidden = true, 400);
  localStorage.setItem('announcementSeen', 'true');
});

// Check if announcement is seen
const seen = localStorage.getItem('announcementSeen');
if (!seen) {
  // Listen for latest announcement
  const announcementsRef = collection(db, 'announcements');
  onSnapshot(announcementsRef, snapshot => {
    let latest = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!latest || new Date(data.timestamp) > new Date(latest.timestamp)) {
        latest = data;
      }
    });
    if (latest) showPopup(latest.title, latest.message);
  });
}
