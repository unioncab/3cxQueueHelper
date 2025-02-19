export interface Options {
  webclientUrl?: string;
  inactiveOnDecline?: boolean;
  disableDivertToVoicemail?: boolean;
}

export interface Selectors {
  answerButton: string;
  declineButton: string;
  voicemailButton: string;
}
