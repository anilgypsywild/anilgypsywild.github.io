(function () {
  const KEY = "agw_causes_portfolio_access";
  const PASSWORD = "causes";

  const style = document.createElement("style");
  style.textContent = `
    html.locked body > :not(.password-gate) {
      display: none !important;
    }

    .password-gate {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px 20px;
      background: #ffffff;
      color: #050505;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .password-gate__panel {
      width: min(460px, 100%);
      border: 1px solid #d7d7d7;
      border-radius: 8px;
      padding: 28px;
      background: #ffffff;
    }

    .password-gate__eyebrow {
      margin: 0 0 10px;
      color: #555555;
      font-size: 0.78rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .password-gate h1 {
      margin: 0 0 10px;
      font-size: clamp(1.6rem, 6vw, 2.4rem);
      line-height: 1.05;
    }

    .password-gate p {
      margin: 0 0 18px;
      color: #555555;
      line-height: 1.5;
    }

    .password-gate label {
      display: block;
      margin-bottom: 8px;
      font-weight: 750;
    }

    .password-gate input {
      width: 100%;
      min-height: 44px;
      border: 1px solid #bdbdbd;
      border-radius: 8px;
      padding: 10px 12px;
      font: inherit;
    }

    .password-gate button {
      margin-top: 12px;
      width: 100%;
      min-height: 44px;
      border: 1px solid #111111;
      border-radius: 8px;
      background: #111111;
      color: #ffffff;
      font: inherit;
      font-weight: 850;
      cursor: pointer;
    }

    .password-gate__error {
      min-height: 1.4em;
      margin-top: 10px;
      color: #111111;
      font-weight: 750;
    }
  `;
  document.head.appendChild(style);

  function unlock() {
    sessionStorage.setItem(KEY, "granted");
    document.documentElement.classList.remove("locked");
    const gate = document.querySelector(".password-gate");
    if (gate) gate.remove();
  }

  if (sessionStorage.getItem(KEY) === "granted") {
    document.documentElement.classList.remove("locked");
    return;
  }

  document.documentElement.classList.add("locked");

  document.addEventListener("DOMContentLoaded", function () {
    const gate = document.createElement("div");
    gate.className = "password-gate";
    gate.innerHTML = `
      <form class="password-gate__panel" autocomplete="off">
        <p class="password-gate__eyebrow">Private portfolio page</p>
        <h1>Enter password</h1>
        <p>This page is shared selectively for a Compassion Causes UX research case study.</p>
        <label for="portfolio-password">Password</label>
        <input id="portfolio-password" name="portfolio-password" type="password" autofocus>
        <button type="submit">Open portfolio</button>
        <div class="password-gate__error" aria-live="polite"></div>
      </form>
    `;
    document.body.prepend(gate);

    const form = gate.querySelector("form");
    const input = gate.querySelector("input");
    const error = gate.querySelector(".password-gate__error");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (input.value.trim() === PASSWORD) {
        unlock();
      } else {
        error.textContent = "Incorrect password.";
        input.select();
      }
    });
  });
})();
