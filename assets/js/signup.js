/* =========================
   Toast system
========================= */

let toastTimer = null;

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastClose = document.querySelector(".toast__close");
  if (!toast || !toastMessage) return;

  toast.hidden = false;
  toastMessage.textContent = message;
  toast.className = `toast toast--${type} toast--visible`;

  if (toastClose && !toastClose.dataset.bound) {
    toastClose.addEventListener("click", closeToast);
    toastClose.dataset.bound = "true"; // ensure we bind only once
  }

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    closeToast();
  }, 4000);
}

function closeToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.classList.remove("toast--visible");
  toast.hidden = true;
}

/* =========================
   Newsletter forms
========================= */

document.querySelectorAll(".js-email-subscriber").forEach((form) => {
  const btn = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[type="email"]');

  if (!btn || !emailInput) return;

  const originalBtnText = btn.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") {
      showToast("Thanks! If this was a mistake, just submit the form again.");
      form.reset();
      btn.textContent = originalBtnText;
      btn.disabled = !emailInput.value.trim();
      return;
    }

    btn.disabled = true;
    btn.textContent = "Signing you up…";

    try {
      const body = new URLSearchParams(new FormData(form));
      const res = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showToast("✅ You’re in! Check your inbox for confirmation.", "success");
      form.reset();
    } catch (err) {
      console.error(err);
      showToast("❌ Something went wrong—please try again.", "error");
    } finally {
      btn.textContent = originalBtnText;

      // Re-disable if empty (so it stays disabled after reset)
      btn.disabled = !emailInput.value.trim();
    }
  });

  // Disable button when blank (live)
  const syncBtnState = () => {
    btn.disabled = !emailInput.value.trim();
  };

  emailInput.addEventListener("input", syncBtnState);
  syncBtnState();
});
