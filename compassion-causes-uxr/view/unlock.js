'use strict';

const form = document.getElementById('unlock-form');
const password = document.getElementById('password');
const unlock = document.getElementById('unlock');
const status = document.getElementById('unlock-status');
const decoder = new TextDecoder();
let encryptedBundle;

async function getBundle() {
  if (!encryptedBundle) {
    const response = await fetch('data.bin');
    if (!response.ok) throw new Error('Could not download presentation');
    encryptedBundle = new Uint8Array(await response.arrayBuffer());
  }
  return encryptedBundle;
}

async function decrypt(bundle, phrase) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(phrase), 'PBKDF2', false, ['deriveKey'],
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: bundle.subarray(0, 16), iterations: 1_000_000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bundle.subarray(16, 28) }, key, bundle.subarray(28),
  );
}

function openPresentation(plaintext) {
  const headerSize = new DataView(plaintext).getUint32(0);
  const contentsStart = 4 + headerSize;
  const files = JSON.parse(decoder.decode(new Uint8Array(plaintext, 4, headerSize)));
  const read = (path) => {
    const { offset, length } = files[path];
    return new Uint8Array(plaintext, contentsStart + offset, length);
  };
  const readText = (path) => decoder.decode(read(path));

  const slideData = JSON.parse(readText('slides.json'));
  const assetUrls = new Map();
  function localAsset(path) {
    if (!assetUrls.has(path)) {
      const type = path.endsWith('.gif') ? 'image/gif' : 'image/webp';
      assetUrls.set(path, URL.createObjectURL(new Blob([read(path)], { type })));
    }
    return assetUrls.get(path);
  }
  for (const slide of slideData) {
    slide.thumb = localAsset(slide.thumb);
    if (slide.cover) slide.cover.src = localAsset(slide.cover.src);
    for (const frame of slide.frames) {
      frame.src = localAsset(frame.src);
      if (frame.layer) frame.layer = localAsset(frame.layer);
    }
  }

  const presentation = new DOMParser().parseFromString(readText('index.html'), 'text/html');
  const style = document.createElement('style');
  style.textContent = readText('style.css');
  const slideScript = document.createElement('script');
  slideScript.textContent = 'const deck = ' + JSON.stringify(slideData) + ';';
  const player = document.createElement('script');
  player.textContent = readText('player.js');

  document.title = presentation.title;
  document.body.replaceChildren(...presentation.body.children);
  document.getElementById('gate-style').replaceWith(style);
  document.body.append(slideScript, player);
  // Refreshing or leaving the page closes the unlocked session.
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) assetUrls.forEach((url) => URL.revokeObjectURL(url));
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const phrase = password.value;
  password.value = '';
  unlock.disabled = true;
  status.textContent = 'Unlocking presentation…';
  try {
    const bundle = await getBundle();
    const plaintext = await decrypt(bundle, phrase);
    openPresentation(plaintext);
    encryptedBundle = undefined;
  } catch (error) {
    status.textContent = error.name === 'OperationError'
      ? 'That password didn’t unlock the presentation. Try again.'
      : 'The presentation could not open. Reload the page and try again.';
    unlock.disabled = false;
    password.focus();
  }
});
