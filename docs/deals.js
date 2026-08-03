/* deals.js - v1
   Loads https://aceg-pl.github.io/dealfeeds/feed.json
*/
(()=>{

const FEED="https://aceg-pl.github.io/dealfeeds/feed.json";

const FLAGS={
 ALL:"🌍",
 PL:"🇵🇱",
 DE:"🇩🇪",
 AT:"🇦🇹",
 FR:"🇫🇷",
 ES:"🇪🇸"
};

let deals=[];
let filter=new Set(["ALL"]);
let storeFilter="ALL";

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

const bar=d.createElement("div");
bar.style.cssText="position:sticky;top:-12px;background:#111;padding:8px;display:flex;gap:6px;flex-wrap:wrap;z-index:10;border-bottom:1px solid #333";

const stores=d.createElement("div");
stores.style.cssText="padding:4px 8px;display:flex;gap:4px;flex-wrap:wrap;background:#181818;border-bottom:1px solid #333";

o.append(close,bar,stores,grid);
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

function render(){

 grid.innerHTML="";
 bar.innerHTML="";
 stores.innerHTML="";

 let cnt={ALL:deals.length};
 let scnt={};

deals
.filter(x=>filter.has("ALL")||filter.has(x.cc))
.forEach(x=>{
 if(x.store)
   scnt[x.store]=(scnt[x.store]||0)+1;
});

 deals.forEach(x=>cnt[x.cc]=(cnt[x.cc]||0)+1);

 Object.keys(FLAGS).forEach(k=>{

   let b=d.createElement("button");

   b.textContent=FLAGS[k]+(cnt[k]||"");

   b.style.cssText=
   "font-size:22px;padding:2px 8px;border:none;border-radius:5px;cursor:pointer;background:"+
   (filter.has(k)?"#0a84ff":"#333")+
   ";color:#fff";

   b.onclick=()=>{

      if(k=="ALL"){
         filter=new Set(["ALL"]);
      }else{
         filter.delete("ALL");
         filter.has(k)?filter.delete(k):filter.add(k);
         if(filter.size==0)filter.add("ALL");
      }

      render();

   };

   bar.appendChild(b);
 });

    let all=d.createElement("button");
all.textContent="🏪 All";
all.style.cssText="background:"+(storeFilter=="ALL"?"#0a84ff":"#333")+";color:#fff;border:none;border-radius:4px;padding:2px 8px";
all.onclick=()=>{
 storeFilter="ALL";
 render();
};
stores.appendChild(all);

Object.keys(scnt)
.sort((a,b)=>scnt[b]-scnt[a])
.forEach(s=>{

 let b=d.createElement("button");

 b.textContent=s+" "+scnt[s];

 b.style.cssText=
 "background:"+(storeFilter==s?"#0a84ff":"#333")+
 ";color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:11px;cursor:pointer";

 b.onclick=()=>{
   storeFilter=s;
   render();
 };

 stores.appendChild(b);

});

 deals
 .filter(x=>

(filter.has("ALL")||filter.has(x.cc))

&&

(storeFilter=="ALL"||x.store==storeFilter)

)
 .forEach(v=>{

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

if(v.store){
    let st=d.createElement("span");
    st.textContent=v.store;
    st.style.cssText="color:#9cf;font-size:11px;font-weight:bold";
    meta.appendChild(st);
}

let cc=d.createElement("span");
cc.textContent=FLAGS[v.cc];
cc.style.cssText="font-size:18px";

let tm=d.createElement("span");
tm.textContent=age(v.time);
tm.style.color="#ccc";

meta.append(cc,tm);

t.append(a1,meta);

   c.append(img,t);

   grid.appendChild(c);

 });

}

   
fetch(FEED)
.then(r=>r.json())
.then(a=>{

 deals=a.sort((x,y)=>new Date(y.time)-new Date(x.time));

 render();

})
.catch(e=>{

 grid.innerHTML="";

 let x=d.createElement("div");
 x.style.cssText="padding:20px;color:#f66;font-size:16px";
 x.textContent="Error loading feed: "+e;

 grid.appendChild(x);

});
   
})();
