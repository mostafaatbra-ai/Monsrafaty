const C="masrofati-v2";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./manifest.json"])));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(clients.claim())});
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(e.request.method==="POST"&&u.pathname.endsWith("/index.html")){
  e.respondWith((async()=>{
   const q=new URLSearchParams();
   try{
    const f=await e.request.formData(),img=f.get("media");
    if(img&&img.size){const c=await caches.open("share-inbox");await c.put("/shared-image",new Response(img,{headers:{"Content-Type":img.type||"image/png"}}));q.set("share","img")}
    else["title","text","url"].forEach(k=>{const v=f.get(k);if(v&&typeof v==="string")q.set(k,v)});
   }catch(err){}
   return Response.redirect(new URL("index.html?"+q.toString(),self.registration.scope).href,303);
  })());return}
 if(e.request.method!=="GET")return;
 e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
