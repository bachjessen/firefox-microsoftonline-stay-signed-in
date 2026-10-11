import crypto from "node:crypto";

const required = ["AMO_JWT_ISSUER", "AMO_JWT_SECRET", "AMO_ADDON_ID", "AMO_VERSION"];
for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const header = encode({ alg: "HS256", typ: "JWT" });
const payload = encode({
  iss: process.env.AMO_JWT_ISSUER,
  jti: crypto.randomUUID(),
  iat: now,
  exp: now + 60,
});
const signature = crypto
  .createHmac("sha256", process.env.AMO_JWT_SECRET)
  .update(`${header}.${payload}`)
  .digest("base64url");
const token = `${header}.${payload}.${signature}`;

const metadata = {
  release_notes: {
    "en-US": "Initial private release. Automatically selects Don't show this again and confirms the Microsoft Online Stay signed in prompt. Runs only on the relevant Microsoft sign-in page and collects, stores, and transmits no user data.",
  },
  approval_notes: "Unlisted extension intended for personal use. Runs only on https://login.microsoftonline.com/common/SAS/ProcessAuth. The readable content script selects the DontShowAgain checkbox and clicks the submit input, with a 15-second timeout. No data collection, storage, transmission, analytics, telemetry, remote code, external services, transpilation, bundling, minification, or obfuscation.",
};

const addonId = encodeURIComponent(process.env.AMO_ADDON_ID);
const version = encodeURIComponent(process.env.AMO_VERSION);
const response = await fetch(
  `https://addons.mozilla.org/api/v5/addons/addon/${addonId}/versions/${version}/`,
  {
    method: "PATCH",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  },
);

if (!response.ok) {
  throw new Error(`AMO metadata update failed (${response.status}): ${await response.text()}`);
}

console.log("AMO version notes and reviewer notes updated.");
