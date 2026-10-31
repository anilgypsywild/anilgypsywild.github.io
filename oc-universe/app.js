'use strict';
const gate=document.querySelector('#gate'), workspace=document.querySelector('#workspace'), input=document.querySelector('#password'), error=document.querySelector('#gate-error'), submit=document.querySelector('#unlock-button');
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
document.querySelector('#show-password').addEventListener('click',e=>{const show=input.type==='password';input.type=show?'text':'password';e.currentTarget.textContent=show?'Hide':'Show';e.currentTarget.setAttribute('aria-label',show?'Hide password':'Show password')});
document.querySelector('#unlock-form').addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;submit.textContent='Opening…';error.textContent='';
try {
 if(!crypto.subtle) throw Error('secure-context');
 const response=await fetch('payload.json',{cache:'no-store'});if(!response.ok)throw Error('network');
 const encrypted=await response.json();
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(encrypted.salt),iterations:encrypted.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(encrypted.iv)},key,bytes(encrypted.ciphertext));
 const payload=JSON.parse(new TextDecoder().decode(plain));workspace.innerHTML=payload.html;
 const sections=[...workspace.querySelectorAll('.page')], links=[...workspace.querySelectorAll('[data-go]')];
 let expanded=false;
 function navigate(id,focus=true){const target=sections.find(s=>s.id===id)||sections[0];sections.forEach(s=>s.hidden=s!==target);links.forEach(a=>{if(a.closest('nav')){if(a.dataset.go===target.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}});workspace.querySelector('#section-label').textContent=target.getAttribute('aria-label');history.replaceState(null,'','#'+target.id);window.scrollTo(0,0);if(focus)workspace.querySelector('#main').focus({preventScroll:true});}
 links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.dataset.go)}));
 workspace.querySelector('#detail-toggle').addEventListener('click',e=>{expanded=!expanded;workspace.querySelectorAll('.full-document').forEach(d=>d.open=expanded);e.currentTarget.setAttribute('aria-pressed',String(expanded));e.currentTarget.innerHTML=expanded?'Collapse research detail <span>−</span>':'Expand research detail <span>＋</span>';});
 workspace.querySelector('#lock').addEventListener('click',()=>{workspace.replaceChildren();workspace.hidden=true;gate.hidden=false;history.replaceState(null,'',location.pathname);input.focus();});
 workspace.querySelectorAll('.prose table').forEach(t=>{const wrap=document.createElement('div');wrap.className='table-wrap';t.before(wrap);wrap.append(t)});
 workspace.querySelectorAll('a[href^="http"]').forEach(a=>{a.target='_blank';a.rel='noopener noreferrer'});
 input.value='';gate.hidden=true;workspace.hidden=false;navigate(location.hash.slice(1),false);workspace.querySelector('#main').focus({preventScroll:true});
} catch(err) {
 error.textContent=err.message==='secure-context'?'Open this workspace over HTTPS or localhost to unlock it.':err.name==='OperationError'?'That password did not open the workspace. Please try again.':'The workspace could not load. Check your connection and try again.';input.focus();
} finally {submit.disabled=false;submit.innerHTML='Open the workspace <span>↗</span>';}
});
