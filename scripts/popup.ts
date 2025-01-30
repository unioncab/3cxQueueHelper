///<reference types="chrome"/>

const options: settings = {};
const optionsForm = document.getElementById("optionsForm");

type settings = {
  "webclient-url"?: string;
  "clip-on-anwser"?: boolean;
  "inactive-on-decline"?: boolean;
  "disable-divert-to-voicemail"?: boolean;
};

export function get_settings(): settings {}

export function save_settings(): void {}
