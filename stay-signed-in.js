const CHECKBOX_SELECTOR = 'input[name="DontShowAgain"]';
const YES_SELECTOR = "#idSIButton9, input[type='submit'][value='Yes']";
const NO_SELECTOR = "#idBtn_Back, input[type='button'][value='No']";
const POLL_MS = 250;
const TIMEOUT_MS = 15_000;
const DEFAULTS = {checkCheckbox: true, response: "yes"};

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

async function localState() {
  return browser.storage.local.get({syncEnabled: false, deviceId: "", handledCount: 0});
}

async function deviceId(current) {
  if (current.deviceId) return current.deviceId;
  const value = crypto.randomUUID();
  await browser.storage.local.set({deviceId: value});
  return value;
}

async function settings(current) {
  const area = current.syncEnabled ? browser.storage.sync : browser.storage.local;
  return {...DEFAULTS, ...(await area.get(DEFAULTS))};
}

async function incrementCount(current) {
  if (!current.syncEnabled) {
    await browser.storage.local.set({handledCount: current.handledCount + 1});
    return;
  }
  const id = await deviceId(current);
  const {handledCounts = {}} = await browser.storage.sync.get({handledCounts: {}});
  await browser.storage.sync.set({handledCounts: {...handledCounts, [id]: (handledCounts[id] || 0) + 1}});
}

async function handlePrompt() {
  const checkbox = await waitFor(CHECKBOX_SELECTOR);
  const yesButton = await waitFor(YES_SELECTOR);
  const current = await localState();
  const preferences = await settings(current);

  if (preferences.checkCheckbox && !checkbox.checked) checkbox.click();
  if (preferences.response === "none") return;

  const button = preferences.response === "no" ? await waitFor(NO_SELECTOR) : yesButton;
  await incrementCount(current);
  button.click();
}

handlePrompt().catch((error) => console.debug("Stay signed in:", error.message));
