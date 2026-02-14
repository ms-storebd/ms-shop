const CACHE_NAME = 'ms-store-v3';

// ইন্সটল হওয়ার সময় কোনো পেজ ক্যাশ করার দরকার নেই আপাতত
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// মেইন ফিক্স: সব ইউআরএল যেন ঠিকমতো কাজ করে
self.addEventListener('fetch', event => {
    // শুধুমাত্র GET রিকোয়েস্ট হ্যান্ডেল করবে
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
