const EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY = "experimentalPopupDismissalMode";
const EXPERIMENTAL_POPUP_DISMISSAL_MODES = Object.freeze({
    OFF: "off",
    DISMISS_KNOWN_MICROSOFT_MODALS: "dismiss-known-microsoft-modals"
});

function getDefaultExperimentalPopupDismissalMode() {
    return EXPERIMENTAL_POPUP_DISMISSAL_MODES.OFF;
}

function normalizeExperimentalPopupDismissalMode(mode) {
    const supportedModes = Object.values(EXPERIMENTAL_POPUP_DISMISSAL_MODES);
    if (!supportedModes.includes(mode)) {
        return getDefaultExperimentalPopupDismissalMode();
    }

    return mode;
}
