
'use strict';

const form = document.getElementById('unlock');
const input = document.getElementById('password');
const note = document.getElementById('feedback');
const gate = document.getElementById('gate');
const frame = document.getElementById('wiki');
const button = form.querySelector('button');

const decoder = new TextDecoder();
const encoder = new TextEncoder();

const bytes = s =>
  Uint8Array.from(atob(s), c => c.charCodeAt(0));

let data = null;
let pathId = null;
let encrypted = null;
let currentId = null;
let currentAnchor = '';
let renderVersion = 0;

const assets = new Map();
const base = location.href.split('#')[0];
const wikiRoot = 'https://wiki.invalid/';

function route(id, anchor = '') {
  const params = new URLSearchParams();
  params.set('p', String(id));

  if (anchor) params.set('a', anchor);

  return base + '#' + params.toString();
}

function assetURL(id) {
  if (!assets.has(id)) {
    const file = data[id];

    if (!file) return null;

    const blob = new Blob(
      [bytes(file.data)],
      { type: file.mime }
    );

    assets.set(id, URL.createObjectURL(blob));
  }

  return assets.get(id);
}

function targetFor(raw, currentPath) {
  if (!raw) return null;

  try {
    const value = raw.trim();

    if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(value)) {
      return null;
    }

    const currentURL = new URL(currentPath, wikiRoot);
    const targetURL = new URL(value, currentURL);

    if (targetURL.origin !== wikiRoot.slice(0, -1)) {
      return null;
    }

    let path = decodeURIComponent(targetURL.pathname);
    path = path.replace(/^\/+/, '');

    if (!path || path.endsWith('/')) {
      path += 'index.html';
    }

    let id = pathId.get(path);

    if (id === undefined) {
      id = pathId.get(path + '/index.html');
    }

    if (id === undefined) {
      return null;
    }

    return {
      id,
      anchor: targetURL.hash.slice(1)
    };

  } catch (error) {
    console.warn('Unresolved wiki link:', raw, error);
    return null;
  }
}

function scrollToAnchor(anchor) {
  if (!anchor) return;

  try {
    const doc = frame.contentDocument;
    if (!doc) return;

    const decoded = decodeURIComponent(anchor);

    const target =
      doc.getElementById(decoded) ||
      doc.getElementsByName(decoded)[0];

    if (target) {
      target.scrollIntoView();
    }
  } catch (error) {
    console.warn('Anchor navigation failed:', error);
  }
}

function navigate(id, anchor = '', updateHistory = true) {
  if (!data || !data[id]) return;

  const file = data[id];

  if (!file.mime.startsWith('text/html')) {
    console.warn('Not an HTML page:', file.path);
    return;
  }

  if (currentId === id && frame.contentDocument) {
    currentAnchor = anchor;

    if (updateHistory) {
      history.pushState(null, '', route(id, anchor));
    }

    scrollToAnchor(anchor);
    return;
  }

  currentId = id;
  currentAnchor = anchor;

  if (updateHistory) {
    history.pushState(null, '', route(id, anchor));
  }

  renderPage(id, anchor);
}

function renderPage(id, anchor = '') {
  const file = data[id];

  if (!file) return;

  const version = ++renderVersion;

  try {
    const html = decoder.decode(bytes(file.data));

    const doc = new DOMParser().parseFromString(
      html,
      'text/html'
    );

    // Remove executable and embedded content.
    doc.querySelectorAll(
      'script, base, iframe, object, embed, form, meta[http-equiv]'
    ).forEach(element => element.remove());

    // Rewrite links and assets.
    for (const tag of doc.querySelectorAll('[href], [src]')) {
      const attr = tag.hasAttribute('href') ? 'href' : 'src';
      const raw = tag.getAttribute(attr);

      if (!raw) continue;

      const destination = targetFor(raw, file.path);

      if (!destination) {
        if (tag.localName === 'a') {
          if (/^https?:\/\//i.test(raw)) {
            tag.target = '_blank';
            tag.rel = 'noopener noreferrer';
          } else if (
            !/^(mailto:|tel:|#)/i.test(raw)
          ) {
            tag.removeAttribute('href');
          }
        } else if (
          !/^(https?:|data:)/i.test(raw)
        ) {
          tag.removeAttribute(attr);
        }

        continue;
      }

      const linkedFile = data[destination.id];

      if (!linkedFile) continue;

      if (
        tag.localName === 'link' &&
        tag.rel === 'stylesheet' &&
        linkedFile.mime.startsWith('text/css')
      ) {
        const style = doc.createElement('style');
        style.textContent = decoder.decode(
          bytes(linkedFile.data)
        );
        tag.replaceWith(style);
        continue;
      }

      if (
        tag.localName === 'a' &&
        linkedFile.mime.startsWith('text/html')
      ) {
        tag.setAttribute(
          'href',
          route(destination.id, destination.anchor)
        );

        tag.dataset.wikiId = String(destination.id);
        tag.dataset.wikiAnchor = destination.anchor;

        continue;
      }

      const url = assetURL(destination.id);

      if (url) {
        tag.setAttribute(attr, url);

        if (tag.localName === 'a') {
          tag.download = linkedFile.path.split('/').pop();
        }
      }
    }

    document.title = doc.title || 'CVG Research Hub';

    // Install the handler after this iframe document loads.
    frame.addEventListener('load', function onFrameLoad() {
      if (version !== renderVersion) return;

      let inner;

      try {
        inner = frame.contentDocument;
      } catch (error) {
        console.error('Cannot access wiki iframe:', error);
        return;
      }

      if (!inner) {
        console.error('Wiki iframe document unavailable');
        return;
      }

      inner.addEventListener('click', event => {
        const target = event.target;

        const element =
          target.nodeType === 1
            ? target
            : target.parentElement;

        const link = element?.closest?.('a[data-wiki-id]');

        if (!link) return;

        event.preventDefault();
        event.stopPropagation();

        const nextId = Number(link.dataset.wikiId);
        const nextAnchor = link.dataset.wikiAnchor || '';

        navigate(nextId, nextAnchor, true);

      }, true);

      // Restore built-in wiki search.
      const filter = inner.querySelector('#q');
      const results = [
        ...inner.querySelectorAll('#results li')
      ];
      const count = inner.querySelector('#matches');

      if (filter && count) {
        filter.addEventListener('input', () => {
          const search = filter.value.toLowerCase().trim();

          const terms = search
            ? search.split(/\s+/)
            : [];

          let matches = 0;

          for (const row of results) {
            const content = row.textContent.toLowerCase();

            const visible = terms.every(term =>
              content.includes(term)
            );

            row.hidden = !visible;

            if (visible) matches++;
          }

          count.textContent = matches + ' pages';
        });
      }

      scrollToAnchor(anchor);

    }, { once: true });

    frame.srcdoc =
      '<!doctype html>\n' +
      doc.documentElement.outerHTML;

  } catch (error) {
    console.error('Wiki rendering failed:', error);

    frame.srcdoc =
      '<!doctype html><html><body>' +
      '<h2>Unable to display this research page.</h2>' +
      '<p>Check the browser console for details.</p>' +
      '</body></html>';
  }
}

function show() {
  if (!data || !pathId) return;

  const params = new URLSearchParams(
    location.hash.slice(1)
  );

  const requested = params.get('p');

  let id = requested === null
    ? pathId.get('index.html')
    : Number(requested);

  if (
    !Number.isInteger(id) ||
    !data[id] ||
    !data[id].mime.startsWith('text/html')
  ) {
    id = pathId.get('index.html');
  }

  if (id === undefined) {
    console.error('Wiki homepage not found');
    return;
  }

  navigate(id, params.get('a') || '', false);
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  button.disabled = true;
  note.textContent = 'Unlocking…';

  try {
    if (!crypto.subtle) {
      throw new Error('Secure context required');
    }

    if (!encrypted) {
      const response = await fetch('./wiki.enc.json');

      if (!response.ok) {
        throw new Error('Encrypted wiki download failed');
      }

      encrypted = await response.json();
    }

    const material = await crypto.subtle.importKey(
      'raw',
      encoder.encode(input.value),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: bytes(encrypted.salt),
        iterations: encrypted.iterations,
        hash: 'SHA-256'
      },
      material,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['decrypt']
    );

    let clear;

    try {
      clear = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: bytes(encrypted.iv)
        },
        key,
        bytes(encrypted.ciphertext)
      );
    } catch (error) {
      note.textContent =
        'That password didn’t unlock the wiki.';
      input.select();
      return;
    }

    const parsed = JSON.parse(decoder.decode(clear));

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid wiki data format');
    }

    data = parsed;

    pathId = new Map(
      data.map((file, index) => [file.path, index])
    );

    if (!pathId.has('index.html')) {
      throw new Error('Wiki homepage missing');
    }

    input.value = '';
    gate.hidden = true;
    frame.hidden = false;

    currentId = null;
    currentAnchor = '';

    show();

  } catch (error) {
    console.error('Wiki unlock failed:', error);

    note.textContent =
      'The wiki could not load. Refresh this page and try again.';

  } finally {
    button.disabled = false;
  }
});

// Handle browser Back and Forward.
window.addEventListener('popstate', show);

// Handle manually entered wiki URLs.
window.addEventListener('hashchange', show);
