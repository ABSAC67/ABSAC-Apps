const CACHE_NAME = 'absac-shell-v1.4';

const SHELL_ASSETS = [
  './',
  './index.html',
  './tankFilling.html',
  './installCompLog.html',
  './styles.css?v=1.3',
  './icons/diveSiteAtlas.png',
  './icons/diveManagerReportForm.png',
  './icons/checklists.png',
  './icons/SPG.png',
  './icons/UKTides.png',
  './icons/calendar.png',
  './icons/fees.png',
  './icons/tankFilling.png',
  './icons/compressorLog.png',
  './icons/diveGuidelines.png',
  './icons/WIKI.png',
  './icons/expDiverForm.png',
  './icons/Safeguarding.png',
  './icons/appIcon192x192.png',
  './icons/appIcon180x180.png',
  './icons/appIcon152x152.png',
  './icons/appIcon120x120.png',
  './icons/appIcon32x32.png',
  './icons/appIcon16x16.png',
  './images/mdDropOff.jpg',
  './images/mdPallets.jpg',
  './images/mdParking.jpg',
  './images/compLogInstall/android-1-menu.jpg',
  './images/compLogInstall/android-2-install-option.jpg',
  './images/compLogInstall/android-3-install-dialog.jpg',
  './images/compLogInstall/android-4-home-screen.jpg',
  './images/compLogInstall/ios-1-address-bar.jpg',
  './images/compLogInstall/ios-2-page-menu.jpg',
  './images/compLogInstall/ios-3-share-sheet.jpg',
  './images/compLogInstall/ios-4-add-dialog.jpg',
  './images/compLogInstall/ios-5-home-screen.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Cache-first for the app shell, so the landing page always shows even offline.
// Falls back to the network (and updates the cache) when a shell asset is missing.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return; // Let external app links go straight to the network.
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
