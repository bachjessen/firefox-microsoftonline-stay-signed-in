const DEFAULTS = {checkCheckbox:true,response:"yes",measureNext:false,handledCount:0,sampleCount:0,totalManualMs:0};
const checkbox = document.querySelector("#checkCheckbox");
const measure = document.querySelector("#measure");

function duration(ms) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} seconds`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

async function render() {
  const state = {...DEFAULTS, ...(await browser.storage.local.get(DEFAULTS))};
  const average = state.sampleCount ? state.totalManualMs / state.sampleCount : 0;
  document.querySelector("#count").textContent = `${state.handledCount} prompts handled`;
  document.querySelector("#average").textContent = average ? `${duration(average)} (${state.sampleCount} samples)` : "Not measured";
  document.querySelector("#saved").textContent = average ? `${duration(average * state.handledCount)} saved` : "Measure your time saved";
  document.querySelector("#measureStatus").textContent = state.measureNext ? "Automation is paused for the next prompt. Click Yes manually." : "";
  measure.textContent = state.measureNext ? "Measurement armed" : "Measure next prompt";
  measure.disabled = state.measureNext;
  checkbox.checked = state.checkCheckbox;
  document.querySelector(`input[name="response"][value="${state.response}"]`).checked = true;
}

checkbox.addEventListener("change", () => browser.storage.local.set({checkCheckbox: checkbox.checked}));
document.querySelectorAll('input[name="response"]').forEach((radio) => radio.addEventListener("change", () => {
  if (radio.checked) browser.storage.local.set({response: radio.value});
}));
measure.addEventListener("click", async () => {await browser.storage.local.set({measureNext:true}); await render();});
browser.storage.onChanged.addListener(render);
render();
