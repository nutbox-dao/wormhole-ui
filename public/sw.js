import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)
const CACHE_VERSION = 17
const CACHE_NAME = 'cache_v' + CACHE_VERSION

const clearCache = () => {
  return caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== CACHE_NAME) {
        caches.delete(key)
      }
    })
  })
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    clearCache()
  )
})

self.addEventListener('activated', (event) => {
  console.log('activated')
  event.waitUntil(
    clearCache()
  )
})
