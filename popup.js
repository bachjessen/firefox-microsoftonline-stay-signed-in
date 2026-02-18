document.addEventListener("DOMContentLoaded", () => {
    const modeSelect = document.getElementById("experimentalPopupMode");
    const saveStatusElement = document.getElementById("saveStatus");
    let hideStatusTimeout = null;

    function setSaveStatus(message) {
        if (hideStatusTimeout) {
            clearTimeout(hideStatusTimeout);
            hideStatusTimeout = null;
        }

        saveStatusElement.textContent = message;

        if (message) {
            hideStatusTimeout = setTimeout(() => {
                saveStatusElement.textContent = "";
            }, 1500);
        }
    }

    function setModeInSelect(mode) {
        const normalizedMode = normalizeExperimentalPopupDismissalMode(mode);
        modeSelect.value = normalizedMode;
    }

    browser.storage.local.get({
        [EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY]: getDefaultExperimentalPopupDismissalMode()
    })
        .then((settings) => {
            setModeInSelect(settings[EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY]);
        })
        .catch(() => {
            setModeInSelect(getDefaultExperimentalPopupDismissalMode());
        });

    modeSelect.addEventListener("change", () => {
        const selectedMode = normalizeExperimentalPopupDismissalMode(modeSelect.value);
        modeSelect.value = selectedMode;

        browser.storage.local.set({
            [EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY]: selectedMode
        })
            .then(() => {
                setSaveStatus("Setting saved");
            })
            .catch(() => {
                setSaveStatus("Unable to save");
            });
    });
});
