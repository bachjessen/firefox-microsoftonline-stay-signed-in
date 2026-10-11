const CHECKBOX_SELECTOR = 'input[name="DontShowAgain"]';
const YES_SELECTOR = "#idSIButton9, input[type='submit'][value='Yes']";
const NO_SELECTOR = "#idBtn_Back, input[type='button'][value='No']";
const POLL_MS = 250;
const TIMEOUT_MS = 15_000;
const DEFAULTS = {automationEnabled: true, checkCheckbox: true, response: "yes", handledCount: 0};

function waitFor(selector) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);
      if (Date.now() - startedAt >= TIMEOUT_MS) return reject(new Error(`Timed out waiting for ${selector}`));
      window.setTimeout(check, POLL_MS);
    };
    check();
  });
}

async function handlePrompt() {
  const preferences = await browser.storage.local.get(DEFAULTS);
  if (!preferences.automationEnabled) return;

  const checkbox = await waitFor(CHECKBOX_SELECTOR);
  if (preferences.checkCheckbox && !checkbox.checked) checkbox.click();

  const selector = preferences.response === "no" ? NO_SELECTOR : YES_SELECTOR;
  const button = await waitFor(selector);
  await browser.storage.local.set({handledCount: preferences.handledCount + 1});
  button.click();
}

handlePrompt().catch((error) => console.debug("Stay Signed In, Actually:", error.message));
