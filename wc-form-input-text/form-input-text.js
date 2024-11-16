class FormTextInput extends HTMLElement {
    static formAssociated = true;
    #internals;
    #shadowRoot;
    #value = '';

    constructor() {
        super();
        this.#internals = this.attachInternals();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });

        // Create a link element to load external CSS
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', './wc-form-input-text/form-input-text.css'); // Path to your CSS file

        // Append the link element to the shadow root
        this.#shadowRoot.appendChild(link);

        // Set up shadow DOM structure
        this.#shadowRoot.innerHTML += `
            <label>
                <slot name="label"></slot>
                <div class="input-container">
                    <span class="input-field" contenteditable="true"></span>
                </div>
            </label>
        `;

        // Reference to the editable span
        this.inputField = this.#shadowRoot.querySelector('.input-field');

        // Input event listener for validation
        this.inputField.addEventListener('input', () => {
            this.#value = this.inputField.textContent.trim();
            this.#internals.setFormValue(this.#value);
            this.checkValidity();
        });

        // Handle focus and blur for styling
        this.inputField.addEventListener('focus', () => {
            this.inputField.classList.remove('invalid');
        });

        // Set name attribute based on fieldName
        const fieldName = this.getAttribute('fieldname');
        if (fieldName) {
            this.setAttribute('name', fieldName); // Set name attribute dynamically
        }
    }

    static get observedAttributes() {
        return ['fieldname']; // Observe changes to fieldName
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'fieldname') {
            console.log(`Field name changed from ${oldValue} to ${newValue}`);
            this.setAttribute('name', newValue); // Update name attribute if fieldName changes
        }
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this.inputField.textContent = value;
        this.#internals.setFormValue(value);
    }

    checkValidity() {
        const valid = this.#value.length > 0; // Check if there is any content
        this.#internals.setValidity({ valid }, valid ? '' : 'This field is required.');

        // Update visual feedback based on validity
        const container = this.#shadowRoot.querySelector('.input-container');
        container.classList.toggle('invalid', !valid);

        return valid;
    }

    reportValidity() {
        return this.checkValidity();
    }
}

// Define the custom element
customElements.define('form-text-input', FormTextInput);