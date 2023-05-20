import "./screens/export";
import { addObserver, appState } from "./store";
import { Screens } from "./types/navigation";

class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    addObserver(this);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
    switch (appState.screen) {
      case Screens.REGISTER:
        const register = this.ownerDocument.createElement("my-register");
        this.shadowRoot?.appendChild(register);
        break;

      case Screens.DASHBOARD:
        const dashboard = this.ownerDocument.createElement("my-dashboard");
        this.shadowRoot?.appendChild(dashboard);
        break;

      case Screens.LOGIN:
        const login = this.ownerDocument.createElement("my-login");
        this.shadowRoot?.appendChild(login);
        break;

      default:
        break;
    }
  }
}

customElements.define("my-container", AppContainer);