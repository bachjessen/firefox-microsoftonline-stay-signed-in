# Microsoft Online: Stay signed in

A personal Firefox extension fork that controls Microsoft's **Stay signed in?** prompt. It can automatically choose **Yes** or **No**, optionally select **Don't show this again**, and can be disabled from its popup.

> [!IMPORTANT]
> This repository is a personal fork of the already published [Microsoft Online: Stay signed in extension on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/ms-online-stay-signed-in/). It is maintained for the repository owner's personal use and is not the official source or a replacement for the published extension.

![Microsoft's Stay signed in prompt](screenshot.png)

## Privacy and permissions

The extension runs only on `login.microsoftonline.com` and does not collect, store, or transmit data. It needs access to that site solely to interact with the stay-signed-in prompt.

## Development

Requirements: Node.js 22 and npm.

```sh
npm ci
npm run lint
npm run build
```

For a temporary Firefox profile:

```sh
npx web-ext run
```

`test-page.html` provides a local manual test for the delayed checkbox and submit button.

## Releases

CI validates every push and pull request and uploads an unsigned ZIP artifact. This personal fork must not be submitted as a listed public Firefox Add-ons extension without a separate, explicit publication decision by the repository owner.

The repository contains Mozilla Add-ons tooling for signing and submission. Configure these GitHub Actions repository secrets only when that tooling is intentionally used:

- `AMO_JWT_ISSUER`
- `AMO_JWT_SECRET`

Mozilla review and signing happen after submission; a source ZIP artifact is not a signed XPI.

## Attribution

This repository is derived from the published [Microsoft Online: Stay signed in extension](https://addons.mozilla.org/firefox/addon/ms-online-stay-signed-in/). The icon comes from [Google Material Symbols](https://fonts.google.com/icons) and is used under the [Creative Commons Attribution-ShareAlike 3.0 license](https://creativecommons.org/licenses/by-sa/3.0/).

## License

Released under the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).
