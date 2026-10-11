# Stay Signed In, Actually

A personal Firefox extension that handles the recurring **Stay signed in?** prompt on Microsoft sign-in pages, because apparently **Don't show this again** was only a suggestion. It can automatically choose **Yes** or **No**, optionally select **Don't show this again**, and can be disabled from its popup.

> [!IMPORTANT]
> This repository is an independent personal fork of the already published [Microsoft Online: Stay signed in extension on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/ms-online-stay-signed-in/). It is not affiliated with, endorsed by, or maintained by Microsoft or the original extension developer.

![Microsoft's Stay signed in prompt](screenshot.png)

## Privacy and security

- Runs only on `https://login.microsoftonline.com/*`.
- Stores settings and the handled-prompt counter only in local Firefox extension storage.
- Does not use Firefox Sync, analytics, telemetry, remote code, or external services.
- Does not collect or transmit account credentials or page contents.
- Uses the minimum extension permission required: `storage`.

## Development

Requirements: Node.js 22 and npm.

```sh
npm ci
npm run audit
npm run lint
npm run build
```

For a temporary Firefox profile:

```sh
npx web-ext run
```

`test-page.html` and `test-page-11oct2026.html` provide local manual tests.

## Private releases

This fork is self-distributed and is not intended for public listing on Firefox Add-ons. Public publishing and automated AMO metadata updates are intentionally disabled.

The **Private Firefox Update** workflow:

1. Runs only after a manual dispatch by the repository owner.
2. audits dependencies and lints the extension;
3. submits the extension through Mozilla's `unlisted` signing channel;
4. uploads the signed XPI as a short-lived GitHub Actions artifact.

It requires the `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` repository secrets. Rotate either secret immediately if it is ever printed, copied into a file, or otherwise exposed.

In AMO Developer Hub, **Self** means Mozilla signed the extension for self-distribution. It is not listed in AMO search or product pages. Install the downloaded signed XPI through Firefox's **Add-ons and themes** page using **Install Add-on From File**.

## Naming and attribution

The project name describes compatibility with Microsoft sign-in pages. Microsoft is a trademark of the Microsoft group of companies. This project uses no Microsoft logos or product icons and does not claim Microsoft affiliation or endorsement.

This repository is derived from the published [Microsoft Online: Stay signed in extension](https://addons.mozilla.org/firefox/addon/ms-online-stay-signed-in/). The icon comes from [Google Material Symbols](https://fonts.google.com/icons) and is used under the [Creative Commons Attribution-ShareAlike 3.0 license](https://creativecommons.org/licenses/by-sa/3.0/).

## License

Released under the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).
