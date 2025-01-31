export {};

// Define the OptionsType interface
interface OptionsType {
  webclientUrl?: string;
  clipOnAnwser?: boolean;
  inactiveOnDecline?: boolean;
  disableDivertToVoicemail?: boolean;
}

//todo: load options from storage on window.onload

// In-page cache of the user's options
const options: OptionsType = {};

const webclientUrlInput = document.getElementById(
  "webclientUrl",
) as HTMLInputElement;
const clipOnAnwserInput = document.getElementById(
  "clipOnAnwser",
) as HTMLInputElement;
const inactiveOnDeclineInput = document.getElementById(
  "inactiveOnDecline",
) as HTMLInputElement;
const disableDivertToVoicemailInput = document.getElementById(
  "disableDivertToVoicemail",
) as HTMLInputElement;

webclientUrlInput.addEventListener("input", (event: Event) => {
  const target = event.target as HTMLInputElement;
  options.webclientUrl = target.value;

  // Persist the updated options to Chrome storage
  chrome.storage.sync.set(options);
});

clipOnAnwserInput.addEventListener("change", (event: Event) => {
  const target = event.target as HTMLInputElement;
  options.clipOnAnwser = target.checked;

  // Persist the updated options to Chrome storage
  chrome.storage.sync.set(options);
});

inactiveOnDeclineInput.addEventListener("change", (event: Event) => {
  const target = event.target as HTMLInputElement;
  options.inactiveOnDecline = target.checked;

  // Persist the updated options to Chrome storage
  chrome.storage.sync.set(options);
});

disableDivertToVoicemailInput.addEventListener("change", (event: Event) => {
  const target = event.target as HTMLInputElement;
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
