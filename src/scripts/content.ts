import { Options, Selectors } from "../types/types";
import { DEFAULT_VALUES } from "../types/defaults";

const selectors: Selectors = {
  answerButton: "#btnAnswer",
  declineButton: "#btnDecline",
  voicemailButton: "#btnDivertToVoicemail",
};

function isDomainValid(validDomainPattern: string): boolean {
  const regex = new RegExp(validDomainPattern);

  const valid = regex.test(window.location.href);
  return valid;
}

class CallHandler {
  private observer: MutationObserver;
  private options: Options;

  constructor() {
    this.observer = new MutationObserver(this.handleMutation.bind(this));
    this.options = {};
  }

  public initialize(): void {
    chrome.storage.sync
      .get(["webclientUrl"])
      .then((result) => {
        this.options.webclientUrl =
          result.webclientUrl ?? DEFAULT_VALUES.webclientUrl;
      })
      .then(() => {
        if (
          this.options.webclientUrl &&
          !isDomainValid(this.options.webclientUrl)
        ) {
          //console.log("Not a valid 3CX Webclient Domain; extension inactive.");
          return;
        }

        console.log("Valid 3CX Web Client Domain; extension active");

        // observer runs on mutation watchForCalls
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // check for existing buttons.
        this.watchForCalls();
      });
  }

  private handleMutation(mutations: MutationRecord[]): void {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.addedNodes.length) {
        this.watchForCalls();
      }
    });
  }

  // Run when visiting domain in settings
  private watchForCalls(): void {
    const declineButton = document.querySelector<HTMLElement>(
      selectors.declineButton,
    );

    chrome.storage.sync.get(["inactiveOnDecline"]).then((result) => {
      this.options.inactiveOnDecline =
        result.inactiveOnDecline ?? DEFAULT_VALUES.inactiveOnDecline;
    });
    if (
      declineButton &&
      !declineButton.hasAttribute("data-listener-added") &&
      this.options.inactiveOnDecline
    ) {
      declineButton.addEventListener("mousedown", this.handleDeclineButton);
      declineButton.setAttribute("data-listener-added", "true");
    }

    chrome.storage.sync.get(["disableDivertToVoicemail"]).then((result) => {
      this.options.disableDivertToVoicemail =
        result.disableDivertToVoicemail ??
        DEFAULT_VALUES.disableDivertToVoicemail;
    });
    const voicemailButton = document.querySelector<HTMLElement>(
      selectors.voicemailButton,
    );
    if (voicemailButton && this.options.disableDivertToVoicemail) {
      voicemailButton.style.visibility = "hidden";
    }
  }

  private handleDeclineButton() {
    console.log("Call Declined");

    // Queue button only exists if account menu has been opened.
    const accountMenu: HTMLElement | null = document.querySelector(
      "wc-account-menu > div > app-avatar",
    );
    console.log(accountMenu);
    if (!accountMenu) return;
    accountMenu.click();
    accountMenu.click();

    const menuElement: HTMLElement | null =
      document.getElementById("menuQueue");
    console.log("menuElement", menuElement);

    if (menuElement) {
      const spanElements: NodeListOf<Element> =
        menuElement.querySelectorAll("span");
      Array.from(spanElements).forEach((span) => {
        if (span.textContent?.includes("Logout")) {
          menuElement.click();
        }
      });
    }
  }

  public cleanUp() {
    this.observer.disconnect();
  }
}

const handler = new CallHandler();
window.addEventListener("load", () => {
  console.log("load");
  handler.initialize();
});

chrome.runtime.connect().onDisconnect.addListener(function () {
  // clean up when content script gets disconnected
  handler.cleanUp();
});
