# Chrome Web Store privacy fields

## Single purpose description

Automatically handles the “Stay signed in?” prompt on Microsoft sign-in pages according to the user's locally stored preferences.

## Storage justification

The storage permission is required to save the user's automation preferences and handled-prompt counter. This information is stored only in local browser extension storage and is never transmitted.

## Host permission justification

The extension must run on Microsoft sign-in pages to detect and handle the “Stay signed in?” prompt. Access is restricted to `https://login.microsoftonline.com/*` and is not requested for any other website.

## Remote code

Select: **No, I am not using remote code.**

The extension does not load or execute remote code. All executable JavaScript is included in the extension package.

## Data usage

Select no data categories. The extension does not collect or transmit user data. Settings and the handled-prompt counter remain in local browser extension storage.

Select all applicable certifications confirming that data is not sold, used for unrelated purposes, used for personalized advertising, or used for creditworthiness or lending.

## Privacy policy URL

`https://github.com/bachjessen/stay-signed-in-actually/blob/main/PRIVACY.md`
