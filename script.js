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

// ১. ফায়ারবেস কনফিগারেশন
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

// লগইন সেশন ধরে রাখা
setPersistence(auth, browserLocalPersistence);

// --- ২. পপ-আপ (Modal) কন্ট্রোল ---
window.showModal = (email) => {
    const modal = document.getElementById('customModal');
    if(modal) {
        document.getElementById('modalMessage').innerText = `আমরা ${email} ঠিকানায় একটি লিঙ্ক পাঠিয়েছি। ভেরিফাই করার পর আপনি সরাসরি শপে যেতে পারবেন।`;
        modal.style.display = 'flex';
    }
}

window.closeModal = () => {
    const modal = document.getElementById('customModal');
    if(modal) modal.style.display = 'none';
}

// --- ৩. অটো-রিডাইরেক্ট লজিক (ইন্ডেক্স পেজে থাকলে) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        user.reload().then(() => {
            if (user.emailVerified) {
                if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
                    window.location.href = "shop.html"; 
                }
            }
        });
    }
});

// --- ৪. সাইন-আপ লজিক (Redirect Settings সহ) ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        const actionCodeSettings = {
    // সঠিক এবং ফুল লিঙ্ক
    url: 'https://tasnimtonni426-ui.github.io/ms-shop/shop.html', 
    handleCodeInApp: true,
};


        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ভেরিফিকেশন ইমেইল পাঠানো
            sendEmailVerification(res.user, actionCodeSettings).then(() => {
                showModal(email); // পপ-আপ দেখাবে
                
                // ডাটাবেসে তথ্য রাখা
                updateProfile(res.user, { displayName: name }).then(() => {
                    set(ref(db, 'users/' + res.user.uid), {
                        username: name,
                        email: email,
                        joinedAt: serverTimestamp()
                    });
                });
            });
        }).catch(err => {
            if(err.code === 'auth/invalid-continue-uri') {
                alert("Error: ফায়ারবেস কনসোলে ডোমেইনটি (tasnimtonni426-ui.github.io) অ্যাড করা নেই।");
            } else {
                alert("Error: " + err.message);
            }
        });
    });
}

// --- ৫. সাইন-ইন লজিক ---
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
                alert("দয়া করে আগে আপনার জিমেইল ভেরিফাই করুন।");
            }
        }).catch(() => alert("ভুল ইমেইল অথবা পাসওয়ার্ড।"));
    });
}

// --- ৬. এনিমেশন ও গুগল লগইন ---
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => container.classList.add('active'));
    loginBtn.addEventListener('click', () => container.classList.remove('active'));
}

window.googleLogin = function() {
    signInWithPopup(auth, provider).then(() => {
        window.location.href = "shop.html";
    }).catch((err) => console.error(err));
};
    
