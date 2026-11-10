'use strict';
const form=document.getElementById('unlock'), input=document.getElementById('password'), note=document.getElementById('feedback'), gate=document.getElementById('gate'), frame=document.getElementById('wiki');
const button=form.querySelector('button');
const bytes=(s)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const decoder=new TextDecoder(), enc=new TextEncoder();
let data, pathId, assets=new Map(), encrypted;
const base=location.href.split('#')[0];
const route=(id,anchor='')=>base+'#'+new URLSearchParams({p:String(id),...(anchor?{a:anchor}:{})});
function assetURL(id) {
 if(!assets.has(id)){const f=data[id];assets.set(id,URL.createObjectURL(new Blob([bytes(f.data)],{type:f.mime})));}
 return assets.get(id);
}
function targetFor(raw, path) {
  try {
    if (!raw || /^(#|mailto:|tel:|javascript:|data:)/i.test(raw)) {
      if (!raw?.startsWith('#')) return null;
    }

    const root = 'https://wiki.invalid/';
    const current = new URL(path, root);
    const u = new URL(raw, current);

    if (u.origin !== current.origin) return null;

    let k = decodeURIComponent(u.pathname).replace(/^\/+/, '');

    if (!k || k.endsWith('/')) k += 'index.html';

    const id = pathId.get(k) ?? pathId.get(k + '/index.html');

    return id === undefined
      ? null
      : { id, anchor: decodeURIComponent(u.hash.slice(1)) };
  } catch (error) {
    console.error('Wiki link resolution failed:', raw, path, error);
    return null;
  }
}

function show(){
 if(!data)return;
 const query=new URLSearchParams(location.hash.slice(1));let id=Number(query.get('p')??pathId.get('index.html'));
 if(!data[id]?.mime.startsWith('text/html'))id=pathId.get('index.html');
 const file=data[id];const doc=new DOMParser().parseFromString(decoder.decode(bytes(file.data)),'text/html');
 doc.querySelectorAll('script,base,iframe,object,embed,form,meta[http-equiv]').forEach(x=>x.remove());
 for(const tag of doc.querySelectorAll('[href],[src]')){
  const attr=tag.hasAttribute('href')?'href':'src', raw=tag.getAttribute(attr), dest=targetFor(raw,file.path);
  if(!dest){
   if(!/^(https?:|mailto:|tel:|data:)/i.test(raw))tag.removeAttribute(attr);
   else if(tag.localName==='a'){tag.target='_blank';tag.rel='noopener noreferrer';}
   continue;
  }
  const f=data[dest.id];
  if(tag.localName==='link'&&tag.rel==='stylesheet'&&f.mime.startsWith('text/css')){
   const style=doc.createElement('style');style.textContent=decoder.decode(bytes(f.data));tag.replaceWith(style);
  }else if(f.mime.startsWith('text/html')&&tag.localName==='a'){
   tag.setAttribute('href', '#');
   tag.dataset.wiki = route(dest.id, dest.anchor);
  }else{
   tag.setAttribute(attr,assetURL(dest.id));
   if(tag.localName==='a')tag.download=f.path.split('/').at(-1);
  }
 }
 const title=doc.title||'CVG Research Hub';document.title=title;
 frame.addEventListener('load',()=>{
  const inner=frame.contentDocument;if(!inner)return;
  inner.addEventListener('click',event=>{
   const a=event.target.closest?.('a[data-wiki]');if(!a)return;
   event.preventDefault();
   if(new URL(a.dataset.wiki).hash === location.hash){const id=new URLSearchParams(location.hash.slice(1)).get('a');if(id)inner.getElementById(decodeURIComponent(id))?.scrollIntoView();}

   else {
  location.hash = new URL(a.dataset.wiki).hash;
}
  });
  const filter=inner.querySelector('#q'), results=[...inner.querySelectorAll('#results li')], count=inner.querySelector('#matches');
  if(filter&&count)filter.addEventListener('input',()=>{const terms=filter.value.toLowerCase().trim().split(/\s+/);let n=0;for(const row of results){row.hidden=!terms.every(t=>row.textContent.toLowerCase().includes(t));if(!row.hidden)n++;}count.textContent=n+' pages';});
  const anchor=query.get('a');if(anchor)try{inner.getElementById(decodeURIComponent(anchor))?.scrollIntoView();}catch{}
 },{once:true});
 frame.srcdoc='<!doctype html>'+doc.documentElement.outerHTML;
}
form.addEventListener('submit',async event=>{
 event.preventDefault();button.disabled=true;note.textContent='Unlocking…';
 try{
  if(!crypto?.subtle)throw Error('secure context');
  encrypted??=await fetch('./wiki.enc.json').then(r=>{if(!r.ok)throw Error('download');return r.json();});
  const material=await crypto.subtle.importKey('raw',enc.encode(input.value),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(encrypted.salt),iterations:encrypted.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  let clear;try{clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(encrypted.iv)},key,bytes(encrypted.ciphertext));}
  catch{note.textContent='That password didn’t unlock the wiki.';input.select();return;}
  data=JSON.parse(decoder.decode(clear));pathId=new Map(data.map((f,i)=>[f.path,i]));input.value='';gate.hidden=true;frame.hidden=false;show();
 }catch{note.textContent='The wiki could not load. Refresh this page and try again.';}
 finally{button.disabled=false;}
});
window.addEventListener('hashchange',show);
