(function () {
    let observer = null;
    let isDismissCheckScheduled = false;

    function isElementVisible(element) {
        if (!element || element.getClientRects().length === 0) {
            return false;
        }

        const style = window.getComputedStyle(element);
        return style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.pointerEvents !== "none";
    }

    function findKnownCloseButtons() {
        const selectors = [
            ".ms-Dialog-main [role='button'][aria-label='Close']",
            ".ms-Dialog-main button[aria-label='Close']",
            ".ms-Modal [role='button'][aria-label='Close']",
            ".ms-Modal button[aria-label='Close']",
            ".scc-modalCarousel [role='button'][aria-label='Close']",
            ".scc-modalCarousel button[aria-label='Close']"
        ];

        return Array.from(document.querySelectorAll(selectors.join(",")));
    }

    function dismissKnownPopups() {
        const closeButtons = findKnownCloseButtons();
        closeButtons.forEach((button) => {
            if (button.dataset.msStaySignedInDismissed === "true") {
                return;
            }

            if (!isElementVisible(button)) {
                return;
            }

            button.dataset.msStaySignedInDismissed = "true";
            button.click();
        });
    }

    function scheduleDismissCheck() {
        if (isDismissCheckScheduled) {
            return;
        }

        isDismissCheckScheduled = true;
        window.requestAnimationFrame(() => {
            isDismissCheckScheduled = false;
            dismissKnownPopups();
        });
    }

    function startModalObserver() {
        if (observer) {
            return;
        }

        observer = new MutationObserver(scheduleDismissCheck);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["aria-hidden", "class", "style"]
        });

        scheduleDismissCheck();
    }

    function stopModalObserver() {
        if (!observer) {
            return;
        }

        observer.disconnect();
        observer = null;
    }

    function applyDismissalMode(mode) {
        if (mode === EXPERIMENTAL_POPUP_DISMISSAL_MODES.DISMISS_KNOWN_MICROSOFT_MODALS) {
            startModalObserver();
            return;
        }

        stopModalObserver();
    }

    function handleStorageChanges(changes, areaName) {
        if (areaName !== "local" || !changes[EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY]) {
            return;
        }

        const newValue = normalizeExperimentalPopupDismissalMode(
            changes[EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY].newValue
        );

        applyDismissalMode(newValue);
    }

    browser.storage.local.get({
        [EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY]: getDefaultExperimentalPopupDismissalMode()
    })
        .then((settings) => {
            const mode = normalizeExperimentalPopupDismissalMode(
                settings[EXPERIMENTAL_POPUP_DISMISSAL_STORAGE_KEY]
            );
            applyDismissalMode(mode);
        })
        .catch(() => {
            applyDismissalMode(getDefaultExperimentalPopupDismissalMode());
        });

    browser.storage.onChanged.addListener(handleStorageChanges);
})();
