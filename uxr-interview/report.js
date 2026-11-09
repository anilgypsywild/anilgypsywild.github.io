const form = document.querySelector("#unlock-form");
const input = document.querySelector("#report-password");
const submit = form.querySelector("button");
const message = document.querySelector("#gate-message");
const gate = document.querySelector("#gate");
const report = document.querySelector("#report");
const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));

form.addEventListener("submit", async event => {
  event.preventDefault();
  submit.disabled = true;
  message.textContent = "";

  try {
    if (!globalThis.crypto?.subtle) {
      message.textContent = "Open this report on the HTTPS site to unlock it.";
      return;
    }

    const encrypted = JSON.parse(document.querySelector("#encrypted-report").textContent);
    const material = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(input.value), "PBKDF2", false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: fromBase64(encrypted.salt), iterations: encrypted.iterations, hash: "SHA-256" },
      material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
    );
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(encrypted.iv) }, key, fromBase64(encrypted.ciphertext)
    );

    const { html, assets } = JSON.parse(new TextDecoder().decode(plain));
    const template = document.createElement("template");
    template.innerHTML = html;
    for (const [path, asset] of Object.entries(assets)) {
      const url = URL.createObjectURL(new Blob([fromBase64(asset.data)], { type: asset.mime }));
      for (const element of template.content.querySelectorAll("[src], [href]")) {
        if (element.getAttribute("src") === path) element.src = url;
        if (element.getAttribute("href") === path) {
          element.href = url;
          element.target = "_blank";
          element.rel = "noopener";
        }
      }
    }

    for (const button of template.content.querySelectorAll("[data-copy]")) {
      button.hidden = !navigator.clipboard;
    }
    report.replaceChildren(template.content);
    input.value = "";
    gate.hidden = true;
    report.hidden = false;
    document.title = "Staff UX Research · Compassion Causes";
    const target = document.getElementById(location.hash.slice(1)) || document.getElementById("main");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "instant" });
  } catch (error) {
    message.textContent = error.name === "OperationError"
      ? "That password did not unlock the report."
      : "The report could not be opened. Reload the page and try again.";
    input.focus();
    input.select();
  } finally {
    submit.disabled = false;
  }
});

report.addEventListener("click", async event => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  try {
    const code = document.getElementById(button.dataset.copy);
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Select code to copy";
  }
});
