const extensionApi = globalThis.browser ?? globalThis.chrome;
const SECONDS_SAVED_PER_PROMPT = 12;
const DEFAULTS = {automationEnabled: true, checkCheckbox: true, response: "yes", handledCount: 0};
const automationToggle = document.querySelector("#automationEnabled");
const automationOptions = document.querySelector("#automationOptions");
const dontAskAgainSetting = document.querySelector("#dontAskAgainSetting");
const checkbox = document.querySelector("#checkCheckbox");

function duration(seconds) {
  if (seconds < 60) return `${seconds} seconds`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

async function render() {
  const current = await extensionApi.storage.local.get(DEFAULTS);
  document.querySelector("#count").textContent = `${current.handledCount} ${current.handledCount === 1 ? "prompt" : "prompts"} handled`;
  document.querySelector("#saved").textContent = `${duration(current.handledCount * SECONDS_SAVED_PER_PROMPT)} saved`;
  automationToggle.checked = current.automationEnabled;
  automationOptions.hidden = !current.automationEnabled;
  dontAskAgainSetting.hidden = current.response !== "yes";
  checkbox.checked = current.checkCheckbox;
  const selectedResponse = document.querySelector(`input[name="response"][value="${current.response}"]`);
  if (selectedResponse) selectedResponse.checked = true;
}

automationToggle.addEventListener("change", async () => {
  await extensionApi.storage.local.set({automationEnabled: automationToggle.checked});
});

checkbox.addEventListener("change", async () => {
  await extensionApi.storage.local.set({checkCheckbox: checkbox.checked});
});

document.querySelectorAll('input[name="response"]').forEach((radio) => radio.addEventListener("change", async () => {
  if (radio.checked) await extensionApi.storage.local.set({response: radio.value});
}));

extensionApi.storage.onChanged.addListener(render);
render();
