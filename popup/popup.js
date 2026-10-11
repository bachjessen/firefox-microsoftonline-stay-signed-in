const SECONDS_SAVED_PER_PROMPT = 12;
const DEFAULTS = {checkCheckbox:true,response:"yes",handledCount:0};
const checkbox = document.querySelector("#checkCheckbox");

function duration(seconds) {
  if (seconds < 60) return `${seconds} seconds`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

async function render() {
  const state = {...DEFAULTS, ...(await browser.storage.local.get(DEFAULTS))};
  document.querySelector("#count").textContent = `${state.handledCount} ${state.handledCount === 1 ? "prompt" : "prompts"} handled`;
  document.querySelector("#saved").textContent = `${duration(state.handledCount * SECONDS_SAVED_PER_PROMPT)} saved`;
  checkbox.checked = state.checkCheckbox;
  document.querySelector(`input[name="response"][value="${state.response}"]`).checked = true;
}

checkbox.addEventListener("change", () => browser.storage.local.set({checkCheckbox: checkbox.checked}));
document.querySelectorAll('input[name="response"]').forEach((radio) => radio.addEventListener("change", () => {
  if (radio.checked) browser.storage.local.set({response: radio.value});
}));
browser.storage.onChanged.addListener(render);
render();
