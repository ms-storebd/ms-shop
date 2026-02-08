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
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ফায়ারবেস কনফিগারেশন
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

// ১. কাস্টম প্রফেশনাল পপ-আপ কন্ট্রোল
window.showModal = (email) => {
    const modal = document.getElementById('customModal');
    if(modal) {
        document.getElementById('modalMessage').innerText = `আমরা ${email} ঠিকানায় একটি সিকিউর লিঙ্ক পাঠিয়েছি। দয়া করে ইনবক্স চেক করে লিঙ্কটি কনফার্ম করুন।`;
        modal.style.display = 'flex'; // পপ-আপ শো করবে
    }
}

window.closeModal = () => {
    const modal = document.getElementById('customModal');
    if(modal) modal.style.display = 'none'; // পপ-আপ বন্ধ হবে
}

// ২. অটো-লগইন রিডাইরেক্ট
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "shop.html"; // লগইন থাকলে শপ পেজে যাবে
    }
});

// ৩. সাইন-আপ (Sign Up) এনিমেশন ও ইমেইল ভেরিফিকেশন
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ইমেইল ভেরিফিকেশন লিঙ্ক পাঠানো
            sendEmailVerification(res.user);
            
            // সুন্দর পপ-আপ দেখানো
            showModal(email);
            
            updateProfile(res.user, { displayName: name }).then(() => {
                set(ref(db, 'users/' + res.user.uid), {
                    username: name, email: email, role: "customer", joinedAt: serverTimestamp()
                });
            });
        }).catch(err => alert("ত্রুটি: " + err.message));
    });
}

// ৪. সাইন-ইন (Sign In) লজিক
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => { window.location.href = "shop.html"; })
            .catch((err) => alert("ভুল ইমেইল বা পাসওয়ার্ড।"));
    });
}

// ৫. স্লাইডিং এনিমেশন (SignUp/SignIn পরিবর্তন)
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add('active'); // CSS এর মাধ্যমে এনিমেশন ট্রিগার করবে
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove('active'); // এনিমেশন রিভার্স করবে
    });
}

// ৬. গুগল লগইন
window.googleLogin = function() {
    signInWithPopup(auth, provider).then(() => {
        window.location.href = "shop.html";
    }).catch((err) => console.log("Login Cancelled"));
};
