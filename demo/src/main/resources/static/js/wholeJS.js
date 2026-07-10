import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyApaPWH-UM1goclSHsVNtcOe5Bc1bovR6E",
  authDomain: "ryoko-4efb4.firebaseapp.com",
  projectId: "ryoko-4efb4",
  storageBucket: "ryoko-4efb4.firebasestorage.app",
  messagingSenderId: "1079226028961",
  appId: "1:1079226028961:web:3dfa30de86a8d9336c31e0",
  measurementId: "G-12HMYT8RB9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.querySelectorAll('.style-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

function myOrLogin() {
    const loginBtn = document.querySelector("#loginBtn");
    const myPageBtn = document.querySelector("#myPageBtn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginBtn.style.display = "none";
            myPageBtn.style.display = "inline-block";
        } else {
            loginBtn.style.display = "inline-block";
            myPageBtn.style.display = "none";
        }
    });
}

myOrLogin();