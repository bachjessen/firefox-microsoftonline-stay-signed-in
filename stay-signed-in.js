const CHECKBOX_NAME = "DontShowAgain";
const POLL_INTERVAL_MS = 250;
const TIMEOUT_MS = 15_000;

function waitForElement(findElement) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      const element = findElement();
      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startedAt >= TIMEOUT_MS) {
        reject(new Error("Timed out waiting for the Microsoft sign-in prompt"));
        return;
      }

      window.setTimeout(check, POLL_INTERVAL_MS);
    };

    check();
  });
}

async function confirmStaySignedIn() {
  const checkbox = await waitForElement(() =>
    document.querySelector(`input[name="${CHECKBOX_NAME}"]`),
  );
  checkbox.click();

  const submitButton = await waitForElement(() =>
    document.querySelector('input[type="submit"]'),
  );
  submitButton.click();
}

confirmStaySignedIn().catch((error) => {
  console.debug("Microsoft Online: Stay signed in:", error.message);
});
