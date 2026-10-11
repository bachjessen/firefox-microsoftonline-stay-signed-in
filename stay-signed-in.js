const CHECKBOX_SELECTOR = 'input[name="DontShowAgain"]';
const YES_SELECTOR = "#idSIButton9, input[type='submit'][value='Yes']";
const NO_SELECTOR = "#idBtn_Back, input[type='button'][value='No']";
const POLL_MS = 250;
const TIMEOUT_MS = 15_000;
const DEFAULTS = {
  checkCheckbox: true,
  response: "yes",
  handledCount: 0,
};

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

async function settings() {
  return {...DEFAULTS, ...(await browser.storage.local.get(DEFAULTS))};
}

async function handlePrompt() {
  const checkbox = await waitFor(CHECKBOX_SELECTOR);
  const yesButton = await waitFor(YES_SELECTOR);
  const current = await settings();

  if (current.checkCheckbox && !checkbox.checked) checkbox.click();
  if (current.response === "none") return;

  const button = current.response === "no" ? await waitFor(NO_SELECTOR) : yesButton;
  await browser.storage.local.set({handledCount: current.handledCount + 1});
  button.click();
}

handlePrompt().catch((error) => console.debug("Stay signed in:", error.message));
