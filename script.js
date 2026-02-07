import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// গুরুত্বপূর্ণ: Google লগইন ফাংশনটি গ্লোবাল করা হলো
window.googleLogin = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Success:", result.user);
            window.location.href = "shop.html";
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("গুগল লগইন করতে সমস্যা হয়েছে: " + error.message);
        });
};

// অ্যানিমেশন লজিক
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

if(registerBtn) registerBtn.onclick = () => container.classList.add('active');
if(loginBtn) loginBtn.onclick = () => container.classList.remove('active');

// ইমেইল সাইন আপ
document.getElementById('registerForm').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    
    createUserWithEmailAndPassword(auth, email, pass).then((res) => {
        updateProfile(res.user, { displayName: name }).then(() => {
            window.location.href = "shop.html";
        });
    }).catch(err => alert("রেজিস্ট্রেশন ব্যর্থ: " + err.message));
};

// ইমেইল লগইন
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => window.location.href = "shop.html")
        .catch(err => alert("ভুল ইমেইল বা পাসওয়ার্ড"));
};

// থ্রি-ডট মেনু
const menuBtn = document.querySelector('.three-dots-btn');
if(menuBtn) {
    menuBtn.onclick = (e) => {
        e.stopPropagation();
        const dropdown = document.querySelector('.admin-dropdown');
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
    };
}
window.onclick = () => {
    const dropdown = document.querySelector('.admin-dropdown');
    if(dropdown) dropdown.style.display = 'none';
};
