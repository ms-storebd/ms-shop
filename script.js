const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// স্লাইডিং অ্যানিমেশন ট্রিগার
registerBtn.onclick = () => {
    container.classList.add('active');
};

loginBtn.onclick = () => {
    container.classList.remove('active');
};

// থ্রি-ডট মেনু লজিক
const dotBtn = document.querySelector('.three-dots-btn');
const dropdown = document.querySelector('.admin-dropdown');

dotBtn.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
};

// বাইরে ক্লিক করলে মেনু বন্ধ হওয়া
window.onclick = () => {
    dropdown.style.display = 'none';
};

