// ১. ফায়ারবেস মডিউল ইমপোর্ট (রিয়েল টাইম ডাটাবেসসহ)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ২. আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    databaseURL: "https://ms-sp-97f78-default-rtdb.firebaseio.com", // এটি রিয়েল টাইম ডাটাবেসের জন্য মাস্ট
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

// ৩. ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// ৪. এলিমেন্ট সিলেক্টর
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// ৫. ডাটাবেসে ইউজার ডাটা সেভ করার ফাংশন
function writeUserData(userId, name, email) {
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        lastLogin: new Date().toISOString()
    }).catch(err => console.error("Database Error:", err));
}

// ৬. অ্যানিমেশন ও রিসেট লজিক
window.addEventListener('DOMContentLoaded', () => {
    if (container) container.classList.remove('active');
});

if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add('active'));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ৭. গুগল লগইন ফাংশন
window.googleLogin = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            writeUserData(result.user.uid, result.user.displayName, result.user.email);
            window.location.href = "shop.html";
        })
        .catch((err) => console.log("Google Login Cancelled"));
};

// ৮. ইমেইল সাইন আপ
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        
        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            updateProfile(res.user, { displayName: name }).then(() => {
                writeUserData(res.user.uid, name, email); // ডাটাবেসে সেভ
                window.location.href = "shop.html";
            });
        }).catch(err => alert("রেজিস্ট্রেশন ব্যর্থ: " + err.message));
    });
}

// ৯. ইমেইল লগইন
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => window.location.href = "shop.html")
            .catch(() => alert("ভুল ইমেইল বা পাসওয়ার্ড"));
    });
}

// ১০. মেনু কন্ট্রোল
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
    });
}
window.addEventListener('click', () => { if (dropdownMenu) dropdownMenu.style.display = 'none'; });
