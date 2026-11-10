'use strict';
const form = document.querySelector('#unlock');
const field = document.querySelector('#navopt-password');
const status = document.querySelector('#unlock-status');
const button = form.querySelector('button');
const bytes = value => Uint8Array.from(atob(value), ch => ch.charCodeAt(0));
const encoder = new TextEncoder();
form.addEventListener('submit', async event => {
  event.preventDefault();
  button.disabled = true;
  status.textContent = 'Unlocking…';
  try {
    if (!globalThis.crypto?.subtle) throw new Error('Secure browser context required');
    const payload = JSON.parse(document.querySelector('#protected-navopt').textContent);
    const material = await crypto.subtle.importKey('raw', encoder.encode(field.value), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({name: 'PBKDF2', salt: bytes(payload.salt), iterations: payload.iterations, hash: 'SHA-256'}, material, {name: 'AES-GCM', length: 256}, false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({name: 'AES-GCM', iv: bytes(payload.iv)}, key, bytes(payload.ciphertext));
    const doc = new DOMParser().parseFromString(new TextDecoder().decode(decrypted), 'text/html');
    for (const style of doc.head.querySelectorAll('style')) document.head.append(document.importNode(style, true));
    document.title = doc.title;
    document.body.className = doc.body.className;
    document.body.replaceChildren(...doc.body.childNodes);
    document.querySelector('#protected-navopt')?.remove();
    const target = document.getElementById(location.hash.slice(1)) || document.querySelector('main');
    if (target) { target.tabIndex = -1; target.focus({preventScroll: true}); target.scrollIntoView(); }
  } catch (error) {
    status.textContent = error.name === 'OperationError' ? 'That password didn’t unlock the case study.' : 'The case study couldn’t load. Open it over HTTPS and try again.';
    field.focus();
    field.select();
  } finally { button.disabled = false; }
});
