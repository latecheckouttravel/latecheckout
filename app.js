function setStatus(element, message, kind) {
  element.textContent = message;
  element.classList.remove("success", "error");
  if (kind) element.classList.add(kind);
}

async function submitForm({ formId, statusId, successMessage }) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;
  const arrivalDate = form.querySelector('input[name="arrivalDate"]');
  const departureDate = form.querySelector('input[name="departureDate"]');

  if (arrivalDate && departureDate) {
    const syncDepartureDate = () => {
      const arrivalValue = arrivalDate.value;
      departureDate.min = arrivalValue || "";
      if (arrivalValue && (!departureDate.value || departureDate.value < arrivalValue)) {
        departureDate.value = arrivalValue;
      }
    };

    arrivalDate.addEventListener("change", syncDepartureDate);
    departureDate.addEventListener("focus", syncDepartureDate);
    syncDepartureDate();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const endpoint = (form.getAttribute("action") || "").trim();
    const unconfigured = !endpoint || /REPLACE_ME/i.test(endpoint);
    const isAppsScript = /script\.google\.com\/macros\/s\//i.test(endpoint);

    if (unconfigured) {
      setStatus(
        status,
        "Form endpoint not configured. Add your form endpoint to this form's action attribute.",
        "error"
      );
      return;
    }

    button.disabled = true;
    setStatus(status, "Submitting...", null);

    try {
      if (isAppsScript) {
        const payload = Object.fromEntries(new FormData(form).entries());
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) {
          throw new Error("Unable to submit right now.");
        }
      }

      form.reset();
      setStatus(status, successMessage, "success");
    } catch (error) {
      setStatus(status, error.message || "Unable to submit right now.", "error");
    } finally {
      button.disabled = false;
    }
  });
}

submitForm({
  formId: "tracking-form",
  statusId: "tracking-status",
  successMessage: "We're now monitoring for a better hotel stay. Keep an eye on your inbox."
});

submitForm({
  formId: "quote-form",
  statusId: "quote-status",
  successMessage: "You're on your way to a great hotel stay. Keep an eye on your inbox."
});
