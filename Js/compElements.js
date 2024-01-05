class Modal extends HTMLElement {
  // info Modal has titles attributes (modalTitle) and you can close it using the close() method (modal.close());
  // You need run the function 'modal.show()' to insert it on the DOM;

  static observedAttributes = ["closemethod", "modaltitle"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: #00000050;
          backdrop-filter: blur(1px);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: end;
          opacity: 0;
          transition: 150ms;
          animation: overlayFadein 150ms ease forwards;
        }
        .modal-content {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          background-color: #fff;
          padding: 0 1.6em 2em 1.6em;
          top: 0;
          border-radius: 1em 1em 0 0;
          display: flex;
          flex-direction: column;
          animation: dropfade 150ms ease-in;
          opacity: 0;
          transition: opacity 250ms;
          animation: slide-in-bottom 250ms ease forwards;
          max-height: 80vh;
          overflow-y: auto;
          width: 100%;
        }
        .closeModalbutton {
          background: none;
          outline: none;
          border: none;
          cursor: pointer;
          height: fit-content;
        }
  
        .modalHeaderContainer {
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items:center;
          position: sticky;
          top:0;
          z-index: 99;
          background-color: #fff;
          padding-top: 1em;
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          gap: 5em;
        }
  
        .modalHeader p{
          font-size: 18px;
          font-weight: 700;
        }

        .modalHeaderContainer .modalIndicator{
          width: 50px;
          border-radius: 10px;
          background-color: #ccc;
          height: 4px;
        }
  
        .fade-out{
          opacity: 1;
          transition: opacity 250ms;
          animation: slide-out-bottom 250ms ease forwards;
  
        }
  
        @media (min-width: 640px) {
          .modal-content {
            margin-inline: 1em;
            width: -moz-fit-content;
            width: fit-content;
            border-radius: 0.4em;
            animation: slide-in-top 250ms ease forwards;
          }
  
          .modal-overlay {
           align-items: center;
          }
  
          .fade-out {
            animation: slide-out-top 250ms ease forwards;
          }
          .modalHeaderContainer .modalIndicator{
            display: none;
          }
        }
  
        @keyframes overlayFadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
  
        @keyframes slide-in-top {
          from {
             transform: translateY(-2em);
            opacity: 0;
          }
          to {
              transform: translateY(0);
            opacity: 1;
          }
        }
  
        @keyframes slide-out-top {
          from {
             transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-2em);
            opacity: 0;
          }
        }
  
        @keyframes slide-in-bottom {
          from {
             transform: translateY(100%);
             opacity: 0;
          }
          to {
              transform: translateY(0);
            opacity: 1;
          }
        }
  
        @keyframes slide-out-bottom {
          from {
             transform: translateY(0);
             opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        .hidden{
          display: none;
        }
  
      </style>
      
      <div class="modal-overlay hidden" id="modalOverlay">
      <div class="modal-content" id="modalWindow">
        <div class="modalHeaderContainer">
          <span class="modalIndicator"></span>
          <div class="modalHeader">
            <p id="modalTitle"></p>
            <button id="closeButton" class="closeModalbutton">
              <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.49512 3L21 20.5049" stroke="#010101" stroke-width="3" stroke-linecap="square"
                  stroke-linejoin="round" />
                <path d="M20.5049 3L2.99999 20.5049" stroke="#010101" stroke-width="3" stroke-linecap="square"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <slot></slot>
      </div>
    </div>
    `;

    this.modalContainer = this.shadowRoot.querySelector("#modalOverlay");
    this.modal = this.shadowRoot.querySelector("#modalWindow");
    this.closeButton = this.shadowRoot.querySelector("#closeButton");
    this.modalTitle = this.shadowRoot.querySelector("#modalTitle");
  }

  connectedCallback() {
    // avoid closing modal when clicking on the modal window;
    this.modal.addEventListener("click", (e) => e.stopPropagation());

    this.modalTitle.textContent = this.getAttribute("modalTitle");
    this.closeButton.addEventListener("click", (e) => this.close());
    // closes modal on the overlay click;
    this.modalContainer.addEventListener("click", (e) => this.close());
  }
  close() {
    if (this.closeMethod === "hide") {
      this.modal.classList.add("fade-out");
      setTimeout(() => {
        this.modalContainer.classList.add("hidden");
      }, 250);
    } else {
      this.modal.classList.add("fade-out");
      setTimeout(() => {
        this.remove();
      }, 250);
    }
  }

  show() {
    this.modal.classList.remove("fade-out");
    this.modalContainer.classList.remove("hidden");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "closemethod":
        if (newValue === "hide") {
          this.closeMethod = "hide";
        } else if (newValue === "remove") {
          this.closeMethod = "remove";
        }
        break;

      case "modaltitle":
        this.modalTitle.textContent = newValue;
        break;

      default:
        break;
    }
  }
}

class Input extends HTMLElement {
  // info The input custom element create an input strucutre inside of itself;
  // info You can pass messages and messages type to the input using the attributes messages and messagetype, the message is the text you want to show and the message types are "error" or "info", they need to be passed togheter;

  // info You need to pass at least the attributes "Id", "Type", and "Placeholder";
  // info To get the value of the input using js, you need to get the element and access the input (document.querySelector("#myInput").input.value);

  static observedAttributes = ["message", "messagetype"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.inputContainer = document.createElement("div");
    this.inputContainer.classList.add("inputContainer");

    this.inputElementContainer = document.createElement("div");
    this.inputElementContainer.classList.add("inputElementContainer");

    this.input = document.createElement("input");

    this.inputNameGuide = document.createElement("label");
    this.inputNameGuide.classList.add("inputNameGuide");

    this.inputElementContainer.appendChild(this.input);
    this.inputElementContainer.appendChild(this.inputNameGuide);
    this.inputContainer.appendChild(this.inputElementContainer);

    const styles = document.createElement("style");

    styles.innerHTML = `
      * {
      font-family: "Inter", sans-serif;
    }
    .inputContainer {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
    }
    .inputElementContainer{
      position: relative;
      display: flex;
    }
    .inputNameGuide {
      position: absolute;
      left: 1.5em;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 80;
      color: #888888;
      font-weight: 600;
      border-radius: 0.4em;
      transition: 250ms;
    }
    .leftIconInputContainer > .inputNameGuide {
      left: 3.4em;
    }
    .inputMessage {
      display:flex;
      align-items: center;
      gap: .4em;
      font-size: 12px;
      font-weight: 600;
      padding: .4em .2em .4em 1.2em;
      opacity: 0;
      transition: 150ms;
      animation: fadein 150ms ease forwards;
    }
    input:not(:placeholder-shown) + .inputNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    input:not(:empty) + .inputNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    input:focus + .inputNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    input {
      outline: none;
      border: 1px solid #dddddd;
      background-color: #fff;
      border-radius: 0.4em;
      padding: 1em 1.5em;
      font-size: 14px;
      font-weight: 600;
      min-width: 5em;
      color: #111;
      transition: 250ms;
      width: 100%;
      
    }
    input::placeholder {
      color: transparent;
    }
    input:hover {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    input:focus {
      box-shadow: 0 0 0 2px #afd0ff57;
    }
  
    input:disabled {
      background-color: #eeeeee;
      cursor: not-allowed;
      opacity: 60;
    }
    input:disabled:hover {
      box-shadow: none;
    }
    input.error{
      border-color: #ef4444;
    }
    .inputMessage.error{
      color: #ef4444;
    }
    .inputMessage.info{
      color: #2773ee;
    }
    input.info{
      border-color: #2773ee;
    }
  
    @keyframes fadein {
      from {
        opacity: 0;
        top: calc(100%);
      }
      to {
        opacity: 1;
        top: calc(100% + 0.3em);
      }
    }
      `;

    this.shadowRoot.appendChild(styles);
    this.shadowRoot.appendChild(this.inputContainer);
  }

  connectedCallback() {
    this.inputNameGuide.textContent = this.getAttribute("placeholder");
    this.inputNameGuide.setAttribute("for", `shadow${this.getAttribute("id")}`);

    if (
      !["id", "placeholder", "type"].every((attr) => this.hasAttribute(attr))
    ) {
      // console.error(
      //   "Custom inputs must have Id, Placeholder and Type attributes"
      // );
    }

    for (const attr of this.attributes) {
      if (attr.name === "id") {
        this.input.setAttribute(attr.name, `shadow${attr.value}`);
        continue;
      }
      this.input.setAttribute(attr.name, attr.value);
    }

    // for (const attr of this.getAttributeNames()) {
    //   if (attr === "id") continue;
    //   this.removeAttribute(attr);
    // }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "message":
      case "messageType":
        if (!this.getAttribute("message") || !this.getAttribute("message")) {
          this.inputMessageContainer.remove();
          return;
        }

        if (this.inputMessageContainer) {
          this.inputMessageContainer.remove();
        }

        this.inputMessageContainer = document.createElement("span");
        this.inputMessageContainer.classList.add(
          "inputMessage",
          this.getAttribute("messagetype")
        );

        switch (this.getAttribute("messageType")) {
          case "error":
            this.input.classList.add("error");
            this.inputMessageContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z " fill="#ef4444"/></svg>
              `;
            break;
          case "info":
            this.input.classList.add("info");

            this.inputMessageContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="#2773ee"/></svg>`;
            break;
          default:
            break;
        }

        const inputMessage = document.createElement("label");
        inputMessage.textContent = newValue;

        this.inputMessageContainer.appendChild(inputMessage);

        this.inputContainer.appendChild(this.inputMessageContainer);
        break;
      default:
        break;
    }
  }
}

class Textarea extends HTMLElement {
  // info Textarea has the same functionality as the input custom element, but creates an Textarea instead of a input;
  static observedAttributes = ["message", "messagetype"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.textareaContainer = document.createElement("div");
    this.textareaContainer.classList.add("textareaContainer");

    this.textareaElementContainer = document.createElement("div");
    this.textareaElementContainer.classList.add("textareaElementContainer");

    this.textarea = document.createElement("textarea");

    this.textareaNameGuide = document.createElement("label");
    this.textareaNameGuide.classList.add("textareaNameGuide");

    this.textareaElementContainer.appendChild(this.textarea);
    this.textareaElementContainer.appendChild(this.textareaNameGuide);
    this.textareaContainer.appendChild(this.textareaElementContainer);

    const styles = document.createElement("style");

    styles.innerHTML = `
      * {
      font-family: "Inter", sans-serif;
    }
    textarea{
      resize: vertical ;
      min-height: 300px;
     }
    .textareaContainer {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
    }
    .textareaElementContainer{
      position: relative;
      display: flex;
    }
    .textareaNameGuide {
      position: absolute;
      left: 1.5em;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 80;
      color: #888888;
      font-weight: 600;
      border-radius: 0.4em;
      transition: 250ms;
    }
    .leftIcontextareaContainer > .textareaNameGuide {
      left: 3.4em;
    }
    .textareaMessage {
      display:flex;
      align-items: center;
      gap: .4em;
      font-size: 12px;
      font-weight: 600;
      padding: .4em .2em .4em 1.2em;
      opacity: 0;
      transition: 150ms;
      animation: fadein 150ms ease forwards;
    }
    textarea:not(:placeholder-shown) + .textareaNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    textarea:not(:empty) + .textareaNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    textarea:focus + .textareaNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    textarea {
      outline: none;
      border: 1px solid #dddddd;
      background-color: #fff;
      border-radius: 0.4em;
      padding: 1em 1.5em;
      font-size: 14px;
      font-weight: 600;
      min-width: 5em;
      color: #111;
      transition: 250ms;
      width: 100%;
      
    }
    textarea::placeholder {
      color: transparent;
    }
    textarea:hover {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    textarea:focus {
      box-shadow: 0 0 0 2px #afd0ff57;
    }
  
    textarea:disabled {
      background-color: #eeeeee;
      cursor: not-allowed;
      opacity: 60;
    }
    textarea:disabled:hover {
      box-shadow: none;
    }
    textarea.error{
      border-color: #ef4444;
    }
    .textareaMessage.error{
      color: #ef4444;
    }
    .textareaMessage.info{
      color: #2773ee;
    }
    textarea.info{
      border-color: #2773ee;
    }
  
    @keyframes fadein {
      from {
        opacity: 0;
        top: calc(100%);
      }
      to {
        opacity: 1;
        top: calc(100% + 0.3em);
      }
    }
      `;

    this.shadowRoot.appendChild(styles);
    this.shadowRoot.appendChild(this.textareaContainer);
  }

  connectedCallback() {
    this.textareaNameGuide.textContent = this.getAttribute("placeholder");
    this.textareaNameGuide.setAttribute(
      "for",
      `shadow${this.getAttribute("id")}`
    );

    if (
      !["id", "placeholder", "type"].every((attr) => this.hasAttribute(attr))
    ) {
      // console.error(
      //   "Custom textareas must have Id, Placeholder and Type attributes"
      // );
    }

    for (const attr of this.attributes) {
      if (attr.name === "id") {
        this.textarea.setAttribute(attr.name, `shadow${attr.value}`);
        continue;
      }
      this.textarea.setAttribute(attr.name, attr.value);
    }

    // for (const attr of this.getAttributeNames()) {
    //   if (attr === "id") continue;
    //   this.removeAttribute(attr);
    // }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "value":
        this.textarea.value = newValue;
        break;
      case "message":
      case "messageType":
        if (
          !this.getAttribute("message") ||
          !this.getAttribute("messageType")
        ) {
          this.textareaMessageContainer.remove();
          return;
        }

        if (this.textareaMessageContainer) {
          this.textareaMessageContainer.remove();
        }

        this.textareaMessageContainer = document.createElement("span");
        this.textareaMessageContainer.classList.add(
          "textareaMessage",
          this.getAttribute("messagetype")
        );

        switch (this.getAttribute("messageType")) {
          case "error":
            this.textarea.classList.add("error");
            this.textareaMessageContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z " fill="#ef4444"/></svg>
              `;
            break;
          case "info":
            this.textarea.classList.add("info");

            this.textareaMessageContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="#2773ee"/></svg>`;
            break;
          default:
            break;
        }

        const textareaMessage = document.createElement("label");
        textareaMessage.textContent = newValue;

        this.textareaMessageContainer.appendChild(textareaMessage);

        this.textareaContainer.appendChild(this.textareaMessageContainer);
        break;
      default:
        break;
    }
  }
}

class Combobox extends HTMLElement {
  static observedAttributes = [
    "data-value",
    "options",
    "message",
    "messagetype",
  ];
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");

    styles.innerHTML = `
      * {
      font-family: "Inter", sans-serif;
    }
    
    .comboMessage {
      display:flex;
      align-items: center;
      gap: .4em;
      font-size: 12px;
      font-weight: 600;
      padding: .4em .2em .4em 1.2em;
      opacity: 0;
      transition: 150ms;
      animation: fadein 150ms ease forwards;
    }
  
    .comboMessage.error{
      color: #ef4444;
    }
    .comboMessage.info{
      color: #2773ee;
    }
    .rightIconInputContainer {
      display: flex;
      width: 100%;
      position: relative;
    }
    
    .rightIconInputContainer > input {
      padding-right: 2.8em;
    }
    
    .rightIconInputContainer button {
      position: absolute;
      right: 0.5em;
      top: 50%;
      transform: translateY(-50%) rotate(0);
      cursor: pointer;
      color: #333;
    }
    
    .inputContainer {
      display: flex;
      width: 100%;
      position: relative;
    }
    .inputNameGuide {
      position: absolute;
      left: 1.5em;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 80;
      color: #888888;
      font-weight: 600;
      border-radius: 0.4em;
      transition: 250ms;
    }
    
    input {
      outline: none;
      border: 1px solid #dddddd;
      background-color: #fff;
      border-radius: 0.4em;
      padding: 1em 1.5em;
      font-size: 14px;
      font-weight: 600;
      min-width: 5em;
      color: #111;
      transition: 250ms;
      width: 100%;
    }
    
    input:hover {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    input:focus {
      box-shadow: 0 0 0 2px #afd0ff57;
    }
    
    input:disabled {
      background-color: #eeeeee;
      cursor: not-allowed;
      opacity: 60;
    }
    input:disabled:hover {
      box-shadow: none;
    }
    .comboboxContainer {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
    }
    .comboboxInput {
      cursor: pointer;
    }
    .comboboxDropdown {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: calc(100% + 0.3em);
      width: 100%;
      border: 1px solid #dddddd;
      background-color: #fff;
      border-radius: 0.4em;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      z-index: 99;
      max-height: 300px;
      overflow-y: auto;
      transition: 250ms;
      margin-bottom:  2em;
      animation: dropfade 250ms ease-in;
    }
    .comboboxDropdown .comboboxOption {
      border: none;
      outline: none;
      text-align: start;
      background-color: transparent;
      padding: 0.4em;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0.1em;
      transition: 250ms;
      padding: .6em 1em;
    }
    .comboboxOption:hover {
      background-color: #eee;
      padding-left: 1.4em;
    }
    
    .inputContainer {
      display: flex;
      width: 100%;
      position: relative;
    }
    .inputNameGuide {
      position: absolute;
      left: 1.5em;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 80;
      color: #888888;
      font-weight: 600;
      border-radius: 0.4em;
      transition: 250ms;
    }
    .leftIconInputContainer > .inputNameGuide {
      left: 3.4em;
    }
    
    input:not(:placeholder-shown) + .inputNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    input:not(:empty) + .inputNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    input:focus + .inputNameGuide {
      font-size: 12px;
      opacity: 80;
      top: 0;
      background-color: #fff;
      padding: 0.2em 0.8em;
      color: #333;
    }
    input::placeholder {
      color: transparent;
    }
    
    .fade-in {
      opacity: 0;
      transition: 150ms;
      animation: fadein 150ms ease forwards;
    }
    .comboboxOption + .selected {
      background-color: #afd0ff57;
      padding-left: 1.4em;
    }
    .expandButton{
      background-color: transparent;
      border:none;
      display:flex;
      align-items:center;
      justify-content:center;
    }
  
    .iconReverse {
      transform: translateY(-50%) rotate(180deg) !important;
    }
  
    @keyframes fadein {
      from {
        opacity: 0;
        top: calc(100%);
      }
      to {
        opacity: 1;
        top: calc(100% + 0.3em);
      }
    }
  
      `;

    this.shadowRoot.appendChild(styles);
    this.inputContainer = document.createElement("div");
    this.input = document.createElement("input");
    this.container = document.createElement("div");
    this.icon = document.createElement("button");
    this.textGuide = document.createElement("label");
  }

  connectedCallback() {
    if (
      !["id", "placeholder", "options"].every((attr) => this.hasAttribute(attr))
    ) {
      // console.error(
      //   "Custom combobox must have Id, Placeholder and Options attributes"
      // );
    }

    this.classList.add("comboboxContainer");

    this.container.classList.add("comboboxContainer");

    this.inputContainer.classList.add("rightIconInputContainer");

    if (this.getAttribute("enableWrite")) {
      this.input.addEventListener("input", (e) => {
        clearTimeout(e.target.timeoutId);
        e.target.timeoutId = setTimeout(async () => {
          this.handleFilterOptionList(this.input.value);
        }, 300);
      });
    } else {
      this.input.setAttribute("readOnly", "readOnly");
    }

    for (const attr of this.attributes) {
      if (["options", "enableWrite"].includes(attr.name)) continue;

      if (attr.name === "id") {
        this.input.setAttribute(attr.name, `${attr.value}Input`);
        continue;
      }
      this.input.setAttribute(attr.name, attr.value);
    }

    this.optionList = JSON.parse(
      this.getAttribute("options") ? this.getAttribute("options") : null
    );

    this.input.addEventListener("focus", () => {
      if (this.optionList) this.expandCombobox(this.optionList);
    });

    // this.input.addEventListener("blur", () => this.shrinkCombobox());

    this.textGuide.classList.add("inputNameGuide");
    this.textGuide.textContent = this.input.getAttribute("placeholder");
    this.textGuide.setAttribute("for", this.input.getAttribute("id"));

    this.icon.classList.add("expandButton");

    this.icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/></svg>
      `;

    this.isOpen = false;

    this.icon.addEventListener("click", () => {
      if (this.isOpen) {
        this.isOpen = false;
        this.shrinkCombobox();
      } else if (this.optionList) {
        this.isOpen = true;
        this.expandCombobox(this.optionList);
      }
    });

    this.inputContainer.appendChild(this.input);
    this.inputContainer.appendChild(this.textGuide);
    this.inputContainer.appendChild(this.icon);

    this.container.appendChild(this.inputContainer);

    this.shadowRoot.appendChild(this.container);

    if (this.getAttribute("data-value") && this.optionList) {
      const option = this.optionList.find(
        (option) => option.value === this.getAttribute("data-value")
      );
      if (option) this.handleChangeValue(option);
    }

    // for (const attr of this.getAttributeNames()) {
    //   this.removeAttribute(attr);
    // }
  }

  expandCombobox(optionsList) {
    this.shrinkCombobox();
    this.isOpen = true;
    this.icon.classList.add("iconReverse");

    this.comboboxDropdownContainer = document.createElement("div");
    this.comboboxDropdownContainer.classList.add("comboboxDropdown", "fade-in");

    if (!optionsList.length) {
      this.input.value = "";
      const comboboxOption = document.createElement("button");
      comboboxOption.classList.add("comboboxOption", "center");
      comboboxOption.setAttribute("disabled", true);
      comboboxOption.textContent = "Nenhum valor encontrado!";
      this.comboboxDropdownContainer.appendChild(comboboxOption);
      this.container.appendChild(this.comboboxDropdownContainer);
      return;
    }

    optionsList.forEach((option) => {
      const comboboxOption = document.createElement("button");
      comboboxOption.classList.add("comboboxOption");

      comboboxOption.addEventListener("click", () => {
        // info Dispatch Change Event only on dropdown option select
        this.handleChangeValue(option);
        this.input.dispatchEvent(new Event("change"));
      });
      comboboxOption.textContent = option.text;

      if (option.text === this.input.value) {
        comboboxOption.classList.add("selected");
      }

      this.comboboxDropdownContainer.appendChild(comboboxOption);
    });

    this.container.appendChild(this.comboboxDropdownContainer);
  }

  shrinkCombobox() {
    if (this.comboboxDropdownContainer) {
      this.comboboxDropdownContainer.remove();

      this.isOpen = false;
      this.icon.classList.remove("iconReverse");
    }
  }

  handleChangeValue(option) {
    this.input.setAttribute("data-value", option.value);
    this.setAttribute("data-value", option.value);

    this.shrinkCombobox();
  }

  handleFilterOptionList(searchValue) {
    this.expandCombobox(
      this.optionList.filter((option) =>
        option.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "data-value":
        if (!this.optionList) return;

        const option = this.optionList.find(
          (option) => option.value === newValue
        );

        if (option) this.input.value = option.text;
        this.shrinkCombobox();

        this.input.setAttribute("data-value", newValue);
        break;
      case "options":
        this.optionList = JSON.parse(
          this.getAttribute("options") ? newValue : null
        );

        // info This makes the input change when adding a options attr from js considering you initialized the combobox with an data-value but without options attr;

        if (this.getAttribute("data-value")) {
          const option = this.optionList.find(
            (option) => option.value === this.getAttribute("data-value")
          );
          if (option) this.handleChangeValue(option);
        }

        break;
      case "message":
      case "messageType":
        if (
          !this.getAttribute("message") ||
          !this.getAttribute("messageType")
        ) {
          this.comboMessageContainer.remove();
          return;
        }

        if (this.comboMessageContainer) {
          this.comboMessageContainer.remove();
        }

        this.comboMessageContainer = document.createElement("span");
        this.comboMessageContainer.classList.add(
          "comboMessage",
          this.getAttribute("messagetype")
        );

        switch (this.getAttribute("messageType")) {
          case "error":
            this.input.classList.add("error");
            this.comboMessageContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z " fill="#ef4444"/></svg>
              `;
            break;
          case "info":
            this.input.classList.add("info");

            this.comboMessageContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="#2773ee"/></svg>`;
            break;
          default:
            break;
        }

        const comboMessage = document.createElement("label");
        comboMessage.textContent = newValue;

        this.comboMessageContainer.appendChild(comboMessage);

        this.container.appendChild(this.comboMessageContainer);
        break;
      default:
        break;
    }
  }
}

class Button extends HTMLElement {
  static observedAttributes = ["class", "disabled"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
  
  
      button {
        outline: none;
        width: 100%;
        border: 2px solid #2773ee;
        border-radius: 0.4em;
        padding: 0.6em 1em;
        font-weight: 600;
        transition: 250ms;
        font-size: 14px;
        background-color: #2773ee;
        color: #fff;
        font-family: 'Inter', sans-serif;
        display: flex;
        justify-content: center;
        gap: .4em;
        align-items: center;
        cursor: pointer;
      }
      
      button:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border-color: #0b4da8;
        background-color: #0b4da8;
      }
      
      button:focus {
        box-shadow: 0 0 0 2px #5c9afd;
        background-color: #0b4da8;
        background-color: #2773ee;
      }
  
      button:disabled {
        cursor: not-allowed;
        opacity: 90%;
    }
      
      button.secondary {
        background-color: #fff;
        border: 2px solid #2773ee;
        color: #0b4da8;
      }
      
      button:hover.secondary {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);;
        background-color: #2773ee;
        color: #fff;
      }
      
      button:focus.secondary {
        box-shadow: 0 0 0 2px #5c9afd;
        background-color: #2773ee;
        color: #fff;
      }
      
      button.tertiary {
        background-color: #f0f8ff;
        border-color: #f0f8ff;
        color: #0b4da8;
      }
      
      button:hover.tertiary {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border-color: #2773ee;
      }
      
      button:focus.tertiary {
        box-shadow: 0 0 0 2px #5c9afd;
      }    
      </style>
  
      <button>
        <slot></slot>
      </button>
  `;

    this.button = this.shadowRoot.querySelector("button");
  }

  connectedCallback() {
    this.getAttributeNames().forEach((attr) => {
      // info avoid duplicating event listeners and id
      if (attr.startsWith("on") || attr === "id") return;

      this.button.setAttribute(attr, this.getAttribute(attr));
    });
    // for (const attr of this.getAttributeNames()) {
    //   if (attr === "class") continue;
    //   this.removeAttribute(attr);
    // }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "class":
        this.button.setAttribute("class", newValue);
        break;
      case "disabled":
        if (!newValue) {
          this.button.removeAttribute("disabled");
        }
        break;
      default:
        break;
    }
  }
}

class Loader extends HTMLElement {
  static observedAttributes = ["color", "size"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
      .loader_svg {
        width: 1em;
        transform-origin: center;
        animation: rotate4 2s linear infinite;
      }
      
      .loader_circle {
        fill: none;
        stroke-width: 5;
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: dash4 1.5s ease-in-out infinite;
        stroke: #fff;
      }
      .white-loader {
        stroke: #ffffff;
        padding: 0;
      }
      @keyframes rotate4 {
        100% {
          transform: rotate(360deg);
        }
      }
      
      @keyframes dash4 {
        0% {
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
        }
      
        50% {
          stroke-dasharray: 90, 200;
          stroke-dashoffset: -35px;
        }
      
        100% {
          stroke-dashoffset: -125px;
        }
      }
      </style>
      
      <svg
            viewBox="0 0 50 50"
            class="loader_svg"
          >
            <circle
              r="20"
              cx="25"
              cy="25"
              class="loader_circle"
              id="loader_circle"
            ></circle>
          </svg>
      `;
  }

  connectedCallback() {
    if (!["color", "size"].every((attr) => this.hasAttribute(attr))) {
      console.info("Custom loaders can have Color and Size attributes.");
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    const loader = this.shadowRoot.querySelector("#loader_circle");
    const loaderSvg = this.shadowRoot.querySelector(".loader_svg");

    switch (name) {
      case "color":
        loader.style.stroke = newValue;
        break;
      case "size":
        loaderSvg.style.width = newValue;
        break;

      default:
        break;
    }
  }
}

class Toast extends HTMLElement {
  static observedAttributes = ["type", "duration"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
      
      .toast {
        position: fixed;
        display: flex;
        justify-content:center;
        align-items:center;
        gap:1em;
        top: 5em;
        left: 50%;
        transform: translateX(-50%);
        padding: .6em .8em;
        border-radius: 0.4em;
        opacity: 0;
        transition: opacity 250ms;
        box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        animation: slide-in 250ms ease forwards;
        background-color: #fff;
        border: 1px solid #eee;
        font-weight: 600;
        font-size: 1em;
        width: 80vw;
      }
  
      .fade-out{
        opacity: 1;
        transition: opacity 250ms;
        animation: slide-out 250ms ease forwards;
      }
      #iconContainer{
        display: flex;
      }
  
      @media (min-width: 640px) {
        .toast {
           padding: 1em 2em;
           font-weight: 600;
           font-size: 1.2em;
           top: 6.5em;
        width: fit-content;
  
        }
      }
  
  
      @keyframes slide-in {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
  
      @keyframes slide-out {
        from {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
      }
  
      </style>
      
      <div class="toast" id="toaster">
      <span id="iconContainer">
      </span>
        <slot>
        </slot>
      </div>
      `;

    this.toast = this.shadowRoot.querySelector("#toaster");
    this.icon = this.shadowRoot.querySelector("#iconContainer");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "type":
        switch (newValue) {
          case "success":
            this.icon.innerHTML = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.1829 3.82438C27.2547 8.90023 27.2515 17.1265 22.1757 22.1983C17.0998 27.2701 8.87356 27.2669 3.80174 22.191C-1.26725 17.1181 -1.26725 8.8974 3.80174 3.82438C8.84466 -1.25146 17.0475 -1.27809 22.1234 3.76483C22.1433 3.78461 22.1631 3.80446 22.1829 3.82438Z" fill="#4BA74B"/>
              <path d="M10.917 18.5625C9.32031 16.9658 7.7334 15.3545 6.13184 13.7578C5.95605 13.582 5.95605 13.2891 6.13184 13.1133L7.97266 11.2725C8.14844 11.0967 8.44141 11.0967 8.61719 11.2725L11.249 13.9043L18.0166 7.13184C18.1973 6.95605 18.4854 6.95605 18.666 7.13184L20.5117 8.97754C20.6924 9.1582 20.6924 9.44629 20.5117 9.62207L11.5615 18.5625C11.3857 18.7432 11.0977 18.7432 10.917 18.5625Z" fill="white"/>
              </svg>
              `;
            break;
          case "error":
            this.icon.innerHTML = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.1906 3.82438C27.2624 8.90023 27.2592 17.1265 22.1833 22.1983C17.1075 27.2701 8.88122 27.2669 3.8094 22.191C-1.25959 17.1181 -1.25959 8.8974 3.8094 3.82438C8.85232 -1.25146 17.0552 -1.27809 22.131 3.76483C22.151 3.78461 22.1708 3.80446 22.1906 3.82438Z" fill="#DC2626"/>
              <path d="M19.4592 8.8072L15.2515 13.015L19.4592 17.2227L17.2077 19.4742L13 15.2665L8.79228 19.4742L6.54073 17.2227L10.7485 13.015L6.54073 8.8072L8.79228 6.55573L13 10.7634L17.2077 6.55573L19.4592 8.8072Z" fill="white"/>
              </svg>`;
            break;
          default:
            break;
        }
        break;
      case "duration":
        // * REMOVE THE ELEMENT AFTER THE SLIDE-OUT TRANSITION

        setTimeout(() => {
          this.toast.classList.add("fade-out");
          setTimeout(() => {
            this.remove();
          }, 250);
        }, newValue);

        break;
      default:
        break;
    }
  }
}

class Skeleton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
      .skeleton {
        height: 100%;
        width: 100%;
        border-radius: 1em;
        background-color: #eee;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      </style>
  
      <div class="skeleton">
      </div>
      `;
  }
}

class Toggle extends HTMLElement {
  static observedAttributes = ["checked", "disabled", "placeholder"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
      input[type=checkbox]{
        height: 0;
        width: 0;
        visibility: hidden;
        display:none;
      }
      
      label {
        cursor: pointer;
        text-indent: -9999px;
        width: 50px;
        height: 28px;
        background: grey;
        display: block;
        border-radius: 99px;
        position: relative;
      }
      
      label:after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 22px;
        height: 22px;
        background: #fff;
        border-radius: 40px;
        transition: 0.3s;
      }
      
      input:checked + label {
        background: #2773ee;
      }
      
      input:checked + label:after {
        left: calc(100% - 3px);
        transform: translateX(-100%);
      }
      
      label:active:after {
        width: 18px;
      }
      .toggleContainer {
        display: flex;
        gap: 1em;
        align-items: center;
        justify-content: space-between;
      }
      
      .toggleContainer:has(p:not(.hidden)) {
        border: 1px solid #dddddd;
        background-color: #fff;
        border-radius: 0.4em;
        padding: 0.1em 1em;
      }
      
      .toggleContainer p {
        font-weight: 600;
      }
      .hidden {
        display: none;
      }
  
      </style>
  
      <div  class="toggleContainer">
      <p id="placeholder" class="hidden"></p>
        <input type="checkbox" id="toggle" /><label for="toggle">Toggle</label>
      </div>
      `;

    this.toggle = this.shadowRoot.querySelector("#toggle");
    this.placeholder = this.shadowRoot.querySelector("#placeholder");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "checked":
        newValue
          ? this.toggle.setAttribute("checked", "true")
          : this.toggle.removeAttribute("checked");
        break;
      case "disabled":
        newValue
          ? this.toggle.setAttribute("disabled", "true")
          : this.toggle.removeAttribute("disabled");
        break;
      case "placeholder":
        this.placeholder.classList.remove("hidden");
        this.placeholder.textContent = newValue;
        break;
      default:
        break;
    }
  }
}

class Tab extends HTMLElement {
  // this Tab web component requires the 'tabs' attribute, which is an array of objects containing  the type {text: string, windowId: string}, the 'text' property of the object is the text that will be displayed on the tab button, and the 'windowId' property of the object is the respective window id that needs to be passed on the inner HTML of the <comp-tab> as a <div> with the attr 'data-window = windowId';

  // THE INITIAL WINDOW MUST HAVE THE 'active' CLASS;

  // the attr 'accent-color' can be passed to change the color of the tab and the tab indicator;

  static observedAttributes = ["tabs", "accent-color"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
    <style>

    * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    list-style: none;
    list-style-type: none;
    text-decoration: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    border: none;
    outline: none;
    scroll-behavior: smooth;
    font-family: "Inter", sans-serif;
  }

    .tabContainer {
      --accent-color: #0b53b7;
      display: flex;
      flex-direction: column;
      padding: 1em;
      overflow-x: hidden;
    }
    
    .tabContainer .tabOptionsContainer {
      display: grid;
      grid-template-columns: var(--grid-length);
      align-items: center;
      overflow-x: scroll;
      align-self: start;
    }
    
    .tabContainer .tabOptionsContainer button {
      font-size: .9em;
      color: #222;
      background-color: transparent;
      font-weight: 600;
      padding: 0.4em 1em;
      cursor: pointer;
    }

    .tabContainer .tabOptionsContainer button.active {
      color: var(--accent-color);
    }
    
    .tabContainer .tabIndicator {
      position: relative;
      height: 4px;
      background-color: var(--accent-color);
      border-radius: 10px 10px 0px 0px;
      transition: all 300ms cubic-bezier(0.49, 0.91, 0.16, 1);
    }
    
    .tabWindowContainer slot::slotted(div) {
      display: none;
    }
    
    .tabWindowContainer slot::slotted(div.active) {
      display: flex;
    }

    .tabOptionsContainer::-webkit-scrollbar {
      display: none;
    }

    .tabOptionsContainer {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }


    @media (min-width: 640px) {
      .tabContainer .tabOptionsContainer button {
        font-size: 1em;
      }
    }

    </style>

    <div class="tabContainer" id="tab">
    <div class="tabOptionsContainer" id="tabOptionsContainer">


      <div class="tabIndicator" id="tabIndicator"></div>
    </div>
  
    <div class="tabWindowContainer" id="tabWindowContainer">
      <slot></slot>
    </div>
  </div>
  
    
  
    `;

    this.tabContainer = this.shadowRoot.querySelector("#tab");
    this.tabsContainer = this.shadowRoot.querySelector("#tabOptionsContainer");
    this.windowContaner = this.shadowRoot.querySelector("#tabWindowContainer");
    this.tabIndicator = this.shadowRoot.querySelector("#tabIndicator");
  }

  connectedCallback() {
    this.tabs = JSON.parse(this.getAttribute("tabs"));

    // avoid missing attributes
    if (!["tabs"].every((attr) => this.hasAttribute(attr))) {
      console.error(
        "Attribute 'tabs' missing, pass an array of objects {text:string, windowId:'string'}"
      );
      return;
    }

    const tabsLength = this.tabs.length;
    // set the grid template columns and tab Indicator width
    this.tabsContainer.style.setProperty(
      "--grid-length",
      `repeat(${tabsLength}, 1fr)`
    );

    // creates tab buttons by according to the 'tabs' attr
    this.tabs.forEach((tab) => {
      const tabButton = document.createElement("button");
      tabButton.setAttribute("data-window-id", tab.windowId);
      tabButton.textContent = tab.text;

      tab === this.tabs[0] && tabButton.classList.add("active");

      tabButton.addEventListener("click", () => {
        const slot = this.shadowRoot.querySelector("slot");
        // Get the array of <div> elements inside the slot
        const windows = slot
          .assignedNodes({ flatten: true })
          .filter(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV"
          );

        windows.forEach((window) => {
          window.classList.remove("active");

          if (window.getAttribute("data-window") === tab.windowId) {
            // windows.querySelector(".active").classList.remove("active");
            window.classList.add("active");
          }
        });

        // removes all actives tab class
        this.tabsContainer.querySelector(".active").classList.remove("active");
        tabButton.classList.add("active");

        console.log(Array.from(this.tabs).indexOf(tab));
        this.tabIndicator.style.gridColumn = `${Array.from(this.tabs).indexOf(tab) + 1
          }`;
      });

      this.tabsContainer.insertBefore(tabButton, this.tabIndicator);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "accent-color":
        this.tabContainer.style.setProperty("--accent-color", newValue);
        break;
      default:
        break;
    }
  }
}

class Drawer extends HTMLElement {
  static observedAttributes = ['direction']

  constructor() {
    super();
    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = `
    <style>
        .drawerWindow {
            position: fixed;
            inset-block: 0;
            left:0;
            animation: slide-in .5s cubic-bezier(0.65, 0.05, 0.36, 1);
        }
        @keyframes slide-in {
            from {
              transform: translateX(var(--transform-dir));
            }
            to {
                transform: translateX(0);
            }
        }
    </style>

    <div class="drawerWindow" id="drawer">
        <slot></slot>
    </div>
    `


    this.drawer = this.shadowRoot.querySelector('#drawer')
  }
  connectedCallback() {
    console.log('connected');
  }


  attributeChangedCallback(name, oldValue, newValue) {

    switch (name) {
      case 'direction':
        switch (newValue) {
          case 'left':
            this.drawer.style.setProperty("--transform-dir", '-100%');
            this.drawer.style.left = 0;
            this.drawer.style.right = 'auto';
            break;
          case 'right':
            this.drawer.style.setProperty("--transform-dir", '100%');
            this.drawer.style.left = 'auto';
            this.drawer.style.right = 0;
            break;
          default:
            console.error('Only left and right direction allowed')
            break;
        }

        break;

      default:
        break;
    }
  }
}

if (!customElements.get("comp-modal")) {
  customElements.define("comp-modal", Modal);
}
if (!customElements.get("comp-input")) {
  customElements.define("comp-input", Input);
}
if (!customElements.get("comp-textarea")) {
  customElements.define("comp-textarea", Textarea);
}
if (!customElements.get("comp-combobox")) {
  customElements.define("comp-combobox", Combobox);
}
if (!customElements.get("comp-button")) {
  customElements.define("comp-button", Button);
}
if (!customElements.get("comp-loader")) {
  customElements.define("comp-loader", Loader);
}
if (!customElements.get("comp-toast")) {
  customElements.define("comp-toast", Toast);
}
if (!customElements.get("comp-skeleton")) {
  customElements.define("comp-skeleton", Skeleton);
}
if (!customElements.get("comp-toggle")) {
  customElements.define("comp-toggle", Toggle);
}
if (!customElements.get("comp-tab")) {
  customElements.define("comp-tab", Tab);
}
if (!customElements.get("comp-drawer")) {
  customElements.define("comp-drawer", Drawer);
}
