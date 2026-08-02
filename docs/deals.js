/* deals.js - v1
   Loads https://aceg-pl.github.io/dealfeeds/feed.json
*/
(()=>{

const FEED="https://aceg-pl.github.io/dealfeeds/feed.json";

if(window.__dealOverlay){
  window.__dealOverlay.remove();
  delete window.__dealOverlay;
  return;
}

const d=document;

const o=d.createElement("div");
o.id="__dealOverlay";
o.style.cssText="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.94);overflow:auto;padding:12px;color:#fff;font:12px Arial";

const close=d.createElement("button");
close.textContent="✕";
close.style.cssText="position:fixed;top:6px;right:6px;padding:6px 10px;font-size:18px";
close.onclick=()=>o.remove();

const grid=d.createElement("div");
grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px";

o.append(close,grid);
d.body.appendChild(o);
window.__dealOverlay=o;

function age(v){
 let s=((Date.now()-new Date(v))/1000)|0;
 if(s<60)return s+"s";
 if(s<3600)return (s/60|0)+"m";
 if(s<86400)return (s/3600|0)+"h";
 if(s<604800)return (s/86400|0)+"d";
 return (s/604800|0)+"w";
}

function zoom(src){
 let b=d.createElement("div");
 b.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center";
 let i=d.createElement("img");
 i.src=src;
 i.style.cssText="max-width:95%;max-height:95%";
 b.onclick=()=>b.remove();
 b.appendChild(i);
 d.body.appendChild(b);
}

fetch(FEED)
.then(r=>r.json())
.then(a=>{
 a.sort((x,y)=>new Date(y.time)-new Date(x.time));
 a.forEach(v=>{
   let c=d.createElement("div");
   c.style.cssText="display:flex;background:#222;border:1px solid #444;border-radius:4px;padding:6px;height:82px";

   let img=d.createElement("img");
   img.src=v.img||"";
   img.style.cssText="width:60px;height:60px;object-fit:contain;cursor:pointer;flex:0 0 auto";
   img.onclick=()=>zoom(v.img);

   let t=d.createElement("div");
   t.style.cssText="display:flex;flex-direction:column;flex:1;margin-left:6px;overflow:hidden";

   let a1=d.createElement("a");
   a1.href=v.link;
   a1.target="_blank";
   a1.textContent=v.title;
   a1.style.cssText="color:#5bf;text-decoration:none;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical";

   let meta=d.createElement("div");
   meta.style.cssText="margin-top:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap";

   let cc=d.createElement("span");
   cc.textContent=v.cc;
   cc.style.cssText="background:#555;padding:2px 5px;border-radius:3px;font-weight:bold";

   let tm=d.createElement("span");
   tm.textContent=age(v.time);
   tm.style.color="#ccc";

   meta.append(cc,tm);
   t.append(a1,meta);

   c.append(img,t);
   grid.appendChild(c);
 });
})
.catch(e=>{
 grid.textContent="Error: "+e;
});

})();
