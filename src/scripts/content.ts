export {};
import { config, options } from "./options";

function isDomainValid(validDomainPattern: string): boolean {
  const regex = new RegExp(validDomainPattern);
  return regex.test(window.location.hostname);
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`Phone number copied ${text}`);
  } catch (err) {
    console.error(`Failed to copy ${err}`);
  }
}

class CallHandler {
  private observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver(this.handleMutation.bind(this));
  }

  private handleAnswerButton() {
    console.log("Call Answered");
  }
  private handleDeclineButton() {
    console.log("Call Declined");
  }

  // Run when visiting domain in settings
  private watchForCalls(): void {
    const answerButton = document.querySelector<HTMLElement>(
      config.answerButton,
    );
    const declineButton = document.querySelector<HTMLElement>(
      config.declineButton,
    );
    const voicemailButton = document.querySelector<HTMLElement>(
      config.voicemailButton,
    );
    if (
      answerButton &&
      !answerButton.hasAttribute("data-listener-added") &&
      options.clipOnAnwser
    ) {
      answerButton.addEventListener("mousedown", this.handleAnswerButton);
      answerButton.setAttribute("data-listener-added", "true");
    }
    if (
      declineButton &&
      !declineButton.hasAttribute("data-listener-added") &&
      options.inactiveOnDecline
    ) {
      declineButton.addEventListener("mousedown", this.handleDeclineButton);
      declineButton.setAttribute("data-listener-added", "true");
    }
    if (voicemailButton && options.disableDivertToVoicemail) {
      voicemailButton.style.visibility = "hidden";
    }
  }

  private handleMutation(mutations: MutationRecord[]): void {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.addedNodes.length) {
        this.watchForCalls();
      }
    });
  }

  public initialize(): void {
    if (options.webclientUrl && !isDomainValid(options.webclientUrl)) {
      console.log("Not a valid 3CX Webclient Domain; extension inactive.");
      return;
    }

    console.log("Valid 3CX Web Client Domain; extsnsion active");

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // check for existing buttons.
    this.watchForCalls();
  }
  public cleanup(): void {
    this.observer.disconnect();
  }
}

const handler = new CallHandler();
document.addEventListener("DOMContentLoaded", () => {
  handler.initialize();
});

document.addEventListener("unload", () => {
  handler.cleanup();
});
