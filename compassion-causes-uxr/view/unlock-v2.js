'use strict';

const form = document.getElementById('unlock-form');
const password = document.getElementById('password');
const unlock = document.getElementById('unlock');
const unlockStatus = document.getElementById('unlock-status');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let encryptedStart;

async function fetchPacket(path) {
  const response = await fetch(path, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('Presentation file unavailable');
  return new Uint8Array(await response.arrayBuffer());
}

async function deriveKey(phrase, salt) {
  const material = await crypto.subtle.importKey(
    'raw', encoder.encode(phrase), 'PBKDF2', false, ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 1_000_000, hash: 'SHA-256' },
    material, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
}

function decrypt(key, packet, path) {
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: packet.subarray(0, 12), additionalData: encoder.encode(path) },
    key, packet.subarray(12),
  );
}

function launchPresentation(presentation, key) {
  const assetUrls = new Map();
  window.resolveDeckAsset = (asset) => {
    if (!assetUrls.has(asset)) {
      const download = Promise.all(presentation.assets[asset].map(async (path) => {
        const packet = await fetchPacket(path).catch(() => fetchPacket(path));
        return decrypt(key, packet, path);
      })).then((parts) => URL.createObjectURL(new Blob(parts, { type: 'image/webp' })));
      assetUrls.set(asset, download);
      download.catch(() => assetUrls.delete(asset));
    }
    return assetUrls.get(asset);
  };

  const layout = new DOMParser().parseFromString(presentation.html, 'text/html');
  const style = document.createElement('style');
  style.textContent = presentation.css;
  const dataScript = document.createElement('script');
  dataScript.textContent = 'const deck = ' + JSON.stringify(presentation.deck) + ';';
  const playerScript = document.createElement('script');
  playerScript.textContent = presentation.player;

  document.title = layout.title;
  document.body.replaceChildren(...layout.body.children);
  document.getElementById('gate-style').replaceWith(style);
  document.body.append(dataScript, playerScript);
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) assetUrls.forEach((asset) => asset.then(URL.revokeObjectURL).catch(() => {}));
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const phrase = password.value;
  password.value = '';
  unlock.disabled = true;
  unlockStatus.textContent = 'Checking password…';

  try {
    encryptedStart ??= await fetchPacket('start.bin');
    const key = await deriveKey(phrase, encryptedStart.subarray(0, 16));
    const data = await decrypt(key, encryptedStart.subarray(16), 'start.bin');
    launchPresentation(JSON.parse(decoder.decode(data)), key);
    encryptedStart = undefined;
  } catch (error) {
    unlockStatus.textContent = error.name === 'OperationError'
      ? 'That password didn’t unlock the presentation. Try again.'
      : 'The connection couldn’t load the presentation. Check your connection and try again.';
    unlock.disabled = false;
    password.focus();
  }
});
