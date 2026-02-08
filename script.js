// ১. ফায়ারবেস মডিউল ইমপোর্ট
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    updateProfile, 
    sendEmailVerification, 
    setPersistence, 
    browserLocalPersistence, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    databaseURL: "https://ms-sp-97f78-default-rtdb.firebaseio.com",
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);

// --- পেজ সিকিউরিটি চেক ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            // যদি ভেরিফাইড থাকে তবেই শপে যাবে
            if(window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                window.location.href = "shop.html";
            }
        } else {
            // ভেরিফাইড না থাকলে লগআউট করে ইনডেক্স পেজে রাখবে
            signOut(auth);
        }
    }
});

const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

function writeUserData(userId, name, email) {
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        lastLogin: serverTimestamp(),
        role: "customer"
    });
}

if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add('active'));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove('active'));

// গুগল লগইন (গুগল ইমেইল সাধারণত ভেরিফাইড থাকে)
window.googleLogin = function() {
    signInWithPopup(auth, provider).then((result) => {
        writeUserData(result.user.uid, result.user.displayName, result.user.email);
        window.location.href = "shop.html";
    });
};

// --- সাইন আপ লজিক ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ১. ভেরিফিকেশন লিঙ্ক পাঠানো
            sendEmailVerification(res.user).then(() => {
                // ২. পেন্ডিং পপআপ শো করা
                showVerificationPopup(email);
                
                updateProfile(res.user, { displayName: name }).then(() => {
                    writeUserData(res.user.uid, name, email);
                    signOut(auth); // ভেরিফাই না করা পর্যন্ত সেশন অফ
                });
            });
        }).catch(err => alert("Error: " + err.message));
    });
}

// --- লগইন লজিক ---
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass).then((res) => {
            if (res.user.emailVerified) {
                window.location.href = "shop.html";
            } else {
                // ভেরিফাই না করা থাকলে আবার পপআপ দেখাবে
                showVerificationPopup(email);
                signOut(auth);
            }
        }).catch(() => alert("ভুল ইমেইল/পাসওয়ার্ড অথবা একাউন্ট ভেরিফাই করা নেই।"));
    });
}

// --- ভেরিফিকেশন পেন্ডিং পপআপ ফাংশন ---
function showVerificationPopup(email) {
    const message = `
        ভেরিফিকেশন পেন্ডিং! 📩
        
        আমরা ${email} ঠিকানায় একটি লিঙ্ক পাঠিয়েছি। 
        দয়া করে আপনার ইনবক্স (বা স্প্যাম) চেক করে লিঙ্কে ক্লিক করুন। 
        
        ভেরিফাই করার পর আবার লগইন করার চেষ্টা করুন।
    `;
    alert(message); // আপনি চাইলে এখানে কাস্টম সুইট এলার্ট (SweetAlert) ব্যবহার করতে পারেন
}

// মেনু কন্ট্রোল
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
    });
}
window.addEventListener('click', () => { if (dropdownMenu) dropdownMenu.style.display = 'none'; });
