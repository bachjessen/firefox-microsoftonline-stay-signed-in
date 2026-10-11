const SECONDS_SAVED_PER_PROMPT = 12;
const DEFAULTS = {automationEnabled:true,checkCheckbox:true,response:"yes"};
const automationToggle = document.querySelector("#automationEnabled");
const automationOptions = document.querySelector("#automationOptions");
const checkbox = document.querySelector("#checkCheckbox");
const syncToggle = document.querySelector("#syncEnabled");

function duration(seconds) {
  if (seconds < 60) return `${seconds} seconds`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

async function ensureDeviceId(local) {
  if (local.deviceId) return local.deviceId;
  const deviceId = crypto.randomUUID();
  await browser.storage.local.set({deviceId});
  return deviceId;
}

function totalCount(handledCounts) {
  return Object.values(handledCounts).reduce((sum, count) => sum + count, 0);
}

async function state() {
  const local = await browser.storage.local.get({syncEnabled:false,deviceId:"",handledCount:0,...DEFAULTS});
  if (!local.syncEnabled) return {...local, totalCount: local.handledCount};
  const synced = await browser.storage.sync.get({handledCounts:{},...DEFAULTS});
  return {...local, ...synced, totalCount: totalCount(synced.handledCounts)};
}

async function render() {
  const current = await state();
  document.querySelector("#count").textContent = `${current.totalCount} ${current.totalCount === 1 ? "prompt" : "prompts"} handled`;
  document.querySelector("#saved").textContent = `${duration(current.totalCount * SECONDS_SAVED_PER_PROMPT)} saved`;
  automationToggle.checked = current.automationEnabled;
  automationOptions.hidden = !current.automationEnabled;
  checkbox.checked = current.checkCheckbox;
  syncToggle.checked = current.syncEnabled;
  document.querySelector(`input[name="response"][value="${current.response}"]`).checked = true;
}

async function activeArea() {
  const {syncEnabled} = await browser.storage.local.get({syncEnabled:false});
  return syncEnabled ? browser.storage.sync : browser.storage.local;
}

automationToggle.addEventListener("change", async () => {
  (await activeArea()).set({automationEnabled: automationToggle.checked});
});
checkbox.addEventListener("change", async () => (await activeArea()).set({checkCheckbox: checkbox.checked}));
document.querySelectorAll('input[name="response"]').forEach((radio) => radio.addEventListener("change", async () => {
  if (radio.checked) (await activeArea()).set({response: radio.value});
}));

syncToggle.addEventListener("change", async () => {
  const local = await browser.storage.local.get({deviceId:"",handledCount:0,...DEFAULTS});
  const id = await ensureDeviceId(local);

  if (syncToggle.checked) {
    const synced = await browser.storage.sync.get({handledCounts:{},...DEFAULTS});
    await browser.storage.sync.set({automationEnabled:local.automationEnabled,checkCheckbox:local.checkCheckbox,response:local.response,handledCounts:{...synced.handledCounts,[id]:Math.max(synced.handledCounts[id] || 0,local.handledCount)}});
  } else {
    const synced = await browser.storage.sync.get({handledCounts:{},...DEFAULTS});
    await browser.storage.local.set({automationEnabled:synced.automationEnabled,checkCheckbox:synced.checkCheckbox,response:synced.response,handledCount:synced.handledCounts[id] || 0});
  }

  await browser.storage.local.set({syncEnabled: syncToggle.checked});
  await render();
});

browser.storage.onChanged.addListener(render);
render();
