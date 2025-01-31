// In-page cache of the user's options
const options = {};
const optionsForm = document.getElementById("optionsForm");
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(`Storage key "${key}" in namespace "${namespace}" changed.`, `Old value was "${oldValue}", new value is "${newValue}".`);
    }
});
// Immediately persist options changes
optionsForm.addEventListener("change", (event) => {
    const target = event.target;
    console.log(target.name);
    // Update the corresponding option based on the input's name
    switch (target.name) {
        case "webclientUrl":
            options.webclientUrl = target.value;
            break;
        case "clipOnAnwser":
            options.clipOnAnwser = target.checked;
            break;
        case "inactiveOnDecline":
            options.inactiveOnDecline = target.checked;
            break;
        case "disableDivertToVoicemail":
            options.disableDivertToVoicemail = target.checked;
            break;
    }
    // Persist the updated options to Chrome storage
    chrome.storage.sync.set({ options });
});
// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);
// Populate the form fields with the user's options
if (optionsForm) {
    const webclientUrlInput = optionsForm.querySelector("[name='webclientUrl']");
    const clipOnAnwserInput = optionsForm.querySelector("[name='clipOnAnwser']");
    const inactiveOnDeclineInput = optionsForm.querySelector("[name='inactiveOnDecline']");
    const disableDivertToVoicemailInput = optionsForm.querySelector("[name='disableDivertToVoicemail']");
    if (webclientUrlInput) {
        webclientUrlInput.value = options.webclientUrl || "";
    }
    if (clipOnAnwserInput) {
        clipOnAnwserInput.checked = Boolean(options.clipOnAnwser);
    }
    if (inactiveOnDeclineInput) {
        inactiveOnDeclineInput.checked = Boolean(options.inactiveOnDecline);
    }
    if (disableDivertToVoicemailInput) {
        disableDivertToVoicemailInput.checked = Boolean(options.disableDivertToVoicemail);
    }
}
export {};
//# sourceMappingURL=popup.js.map