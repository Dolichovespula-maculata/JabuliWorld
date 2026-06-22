export class Input {
    constructor() {
        this.keys = {};
        this.onKeyDown = null;
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', e => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.id === 'chat-input' || activeEl.id === 'code-input')) {
                return;
            }
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            if (this.onKeyDown) {
                this.onKeyDown(key);
            }
        });

        window.addEventListener('keyup', e => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
        });
    }

    isPressed(key) {
        return !!this.keys[key.toLowerCase()];
    }

    clear() {
        this.keys = {};
    }
}
