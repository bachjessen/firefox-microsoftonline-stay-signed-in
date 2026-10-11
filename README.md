# Microsoft Online: Stay signed in

A small Firefox extension that automatically confirms Microsoft's **Stay signed in?** prompt. It selects **Don't show this again** and clicks **Yes** when the prompt appears.

[Install from Firefox Add-ons](https://addons.mozilla.org/firefox/addon/ms-online-stay-signed-in/)

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

CI validates every push and pull request and uploads an unsigned ZIP artifact. Releases are manual and restricted to the repository owner. The release workflow submits the extension to Mozilla Add-ons for unlisted signing, so it is not published in the public Firefox Add-ons directory.

Configure these GitHub Actions repository secrets:

- `AMO_JWT_ISSUER`
- `AMO_JWT_SECRET`

Create them in the Mozilla Add-ons Developer Hub. Mozilla review and signing happen after submission; the workflow does not treat its source ZIP as a signed XPI.

## Attribution

The icon comes from [Google Material Symbols](https://fonts.google.com/icons) and is used under the [Creative Commons Attribution-ShareAlike 3.0 license](https://creativecommons.org/licenses/by-sa/3.0/).

## License

Released under the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).
