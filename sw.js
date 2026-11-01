const V='lw-v1';const SHELL=['./','index.html','styles.css','app.js','data.js','manifest.webmanifest','icons/icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='lw-cdn').map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 if(u.pathname.endsWith('versions.json')){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open('lw-cdn').then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return;}
 if(u.hostname.includes('ddragon')||u.hostname.includes('fonts')||u.hostname.includes('fontshare')){e.respondWith(caches.open('lw-cdn').then(c=>c.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')c.put(e.request,r.clone());return r}))));return;}
 if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));}
});
