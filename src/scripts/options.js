//todo: load options from storage on window.onload
// In-page cache of the user's options
const options = {};
const webclientUrlInput = document.getElementById("webclientUrl");
const clipOnAnwserInput = document.getElementById("clipOnAnwser");
const inactiveOnDeclineInput = document.getElementById("inactiveOnDecline");
const disableDivertToVoicemailInput = document.getElementById("disableDivertToVoicemail");
webclientUrlInput.addEventListener("input", (event) => {
    const target = event.target;
    options.webclientUrl = target.value;
    // Persist the updated options to Chrome storage
    chrome.storage.sync.set(options);
});
clipOnAnwserInput.addEventListener("change", (event) => {
    const target = event.target;
    options.clipOnAnwser = target.checked;
    // Persist the updated options to Chrome storage
    chrome.storage.sync.set(options);
});
inactiveOnDeclineInput.addEventListener("change", (event) => {
    const target = event.target;
    options.inactiveOnDecline = target.checked;
    // Persist the updated options to Chrome storage
    chrome.storage.sync.set(options);
});
disableDivertToVoicemailInput.addEventListener("change", (event) => {
    const target = event.target;
    options.disableDivertToVoicemail = target.checked;
    // Persist the updated options to Chrome storage
    chrome.storage.sync.set(options);
});
// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);
// Populate the form fields with the user's options
if (webclientUrlInput) {
    webclientUrlInput.value = options.webclientUrl ?? "";
}
if (clipOnAnwserInput) {
    clipOnAnwserInput.checked = options.clipOnAnwser ?? true;
}
if (inactiveOnDeclineInput) {
    inactiveOnDeclineInput.checked = options.inactiveOnDecline ?? true;
}
if (disableDivertToVoicemailInput) {
    disableDivertToVoicemailInput.checked =
        options.disableDivertToVoicemail ?? true;
}
export {};
