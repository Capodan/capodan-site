// cookie-module.js
(function () {
  if (!localStorage.getItem("cookiesAccepted")) {
    const banner = document.getElementById("cookie-banner");
    const backdrop = document.getElementById("cookie-backdrop");
    if (banner) banner.style.display = "flex";
    if (backdrop) backdrop.style.display = "block";
  }
})(); // ✅ <-- This line is essential to invoke the function

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-banner").style.display = "none";
  document.getElementById("cookie-backdrop").style.display = "none";
}

function rejectCookies() {
  localStorage.setItem("cookiesAccepted", "false");
  document.getElementById("cookie-banner").style.display = "none";
  document.getElementById("cookie-backdrop").style.display = "none";
}

function manageCookies() {
  document.getElementById("cookie-modal").classList.add("show");
}

function closeCookieModal() {
  document.getElementById("cookie-modal").classList.remove("show");
}

function saveCookieSettings() {
  const analytics = document.getElementById("analytics-cookies").checked;
  const personalisation = document.getElementById("personalisation-cookies").checked;

  localStorage.setItem("cookiesAccepted", "true");
  localStorage.setItem("allowAnalytics", analytics);
  localStorage.setItem("allowPersonalisation", personalisation);

  document.getElementById("cookie-banner").style.display = "none";
  document.getElementById("cookie-backdrop").style.display = "none";
  closeCookieModal();
}
