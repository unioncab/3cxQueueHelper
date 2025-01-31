"use strict";
// Print Storage Changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(`Storage key "${key}" in namespace "${namespace}" changed.`, `Old value was "${oldValue}", new value is "${newValue}".`);
    }
});
// Watch for changes to user options and apply them
// chrome.storage.onChanged.addListener(changes, area) => {
//   if (area === "sync" && changes.options?.newValue) {
//     const debug
//   }
// }
//Asynchronous preload from storage
//const initStorageCache = chrome.storage.sync.get().then
