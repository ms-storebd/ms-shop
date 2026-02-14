// sw.js ফাইলটি এই কোড দিয়ে রিপ্লেস করুন
self.addEventListener('install', (event) => {
    self.skipWaiting(); // পুরোনো সার্ভিস ওয়ার্কারকে সাথে সাথে সরিয়ে দেবে
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => caches.delete(cache)) // সব পুরোনো ক্যাশ ডিলিট করে দেবে
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // কোনো রিকোয়েস্ট আটকে রাখবে না, সরাসরি নেটওয়ার্ক থেকে আনবে
    return; 
});
