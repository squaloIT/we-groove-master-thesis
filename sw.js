importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { googleFontsCache, imageCache, offlineFallback, staticResourceCache } from 'workbox-recipes';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies';

workbox.setConfig({ debug: true });
// workbox.skipWaiting();

precacheAndRoute([
  // { url: '/', revision: 'dasdasczxczxc2323' }, - Ne moze da bude ovde jer onda dodavanje novog posta ne bude procitano. 
  { url: '/offline' },
  { url: '/script.bundle.js', revision: '123123asdasdasd' },
  { url: '/app_js_index_js.bundle.js', revision: 'asdasdasd' },
  { url: '/assets/coverPic.jpg', revision: '2e12ue1u2en' },
  { url: '/assets/coverPic.png', revision: 'daknsduabdbbdbd' },
  { url: '/assets/loading-dots.gif', revision: null },
  { url: '/assets/profilePic.jpeg', revision: null },
  { url: '/assets/we_groove_logo.png', revision: null },
  { url: 'https://kit.fontawesome.com/adf7886e69.js', revision: null },
  { url: 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@%5E1/en/emojibase/data.json', revision: null },
  { url: 'https://fonts.googleapis.com/css?family=Roboto:400,700', revision: null },
  { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', revision: null },
  { url: 'https://fonts.googleapis.com/css2?family=Lobster&family=Roboto&family=Ubuntu:ital,wght@0,400;1,700&display=swap', revision: null },
  { url: 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@%5E1/en/emojibase/data.json', revision: null },
])

imageCache()
staticResourceCache()

setDefaultHandler(
  new NetworkOnly({
    networkTimeoutSeconds: 5
  })
);

setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case "document": {
      return caches.match("/offline");
    }

    default:
      return Response.error();
  }
});

offlineFallback({
  pageFallback: '/offline'
})
// Caching font-awesome should be in this order
registerRoute(
  ({ url }) => url.hostname === 'fonts.gstatic.com' || url.hostname === 'ka-f.fontawesome.com',
  new CacheFirst({
    cacheName: 'font-awesome-cache'
  }),
);
googleFontsCache()


const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});


registerRoute(
  ({ url }) => url.pathname.startsWith('/socket.io/'),
  new NetworkOnly()
);

registerRoute(
  ({ request, sameOrigin, url }) => sameOrigin && request.destination === 'document', // && !isInNetworkFirstList(request, url)
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
        maxEntries: 50
      }),
    ]
  }),

);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
    networkTimeoutSeconds: 5,
  }),
  'POST'
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
    networkTimeoutSeconds: 5
  }),
  'PUT'
);


// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)