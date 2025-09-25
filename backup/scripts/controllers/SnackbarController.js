class SnackbarController {
    constructor() {
        this.snackbar = document.getElementById('snackbar');
        this.messageElement = document.getElementById('snackbar-message');
        this.queue = [];
        this.isShowing = false;
        this.currentTimeout = null;
    }

    static show(message, duration = 3000, type = 'info') {
        if (!window.snackbarInstance) {
            window.snackbarInstance = new SnackbarController();
        }
        window.snackbarInstance.show(message, duration, type);
    }

    show(message, duration = 3000, type = 'info') {
        const notification = {
            message,
            duration,
            type,
            timestamp: Date.now()
        };

        this.queue.push(notification);

        if (!this.isShowing) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            return;
        }

        const notification = this.queue.shift();
        this.displayNotification(notification);
    }

    displayNotification(notification) {
        this.isShowing = true;

        // Update message and styling
        this.messageElement.textContent = notification.message;
        this.updateSnackbarStyle(notification.type);

        // Show snackbar
        this.snackbar.classList.add('show');

        // Announce to screen readers
        this.announceToScreenReader(notification.message);

        // Hide after duration
        this.currentTimeout = setTimeout(() => {
            this.hide();
        }, notification.duration);
    }

    hide() {
        this.snackbar.classList.remove('show');
        this.isShowing = false;

        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }

        // Process next item in queue after animation completes
        setTimeout(() => {
            if (this.queue.length > 0) {
                this.processQueue();
            }
        }, 300); // Match CSS transition duration
    }

    updateSnackbarStyle(type) {
        // Remove existing type classes
        this.snackbar.classList.remove('snackbar-success', 'snackbar-error', 'snackbar-warning', 'snackbar-info');

        // Add type-specific class
        switch (type) {
            case 'success':
                this.snackbar.classList.add('snackbar-success');
                this.snackbar.style.backgroundColor = 'var(--md-sys-color-tertiary-container)';
                this.snackbar.style.color = 'var(--md-sys-color-on-tertiary-container)';
                break;
            case 'error':
                this.snackbar.classList.add('snackbar-error');
                this.snackbar.style.backgroundColor = 'var(--md-sys-color-error-container)';
                this.snackbar.style.color = 'var(--md-sys-color-on-error-container)';
                break;
            case 'warning':
                this.snackbar.classList.add('snackbar-warning');
                this.snackbar.style.backgroundColor = '#FFF3C4';
                this.snackbar.style.color = '#5D4E00';
                break;
            case 'info':
            default:
                this.snackbar.classList.add('snackbar-info');
                this.snackbar.style.backgroundColor = 'var(--md-sys-color-inverse-surface)';
                this.snackbar.style.color = 'var(--md-sys-color-inverse-on-surface)';
                break;
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    clearQueue() {
        this.queue = [];
        this.hide();
    }

    getQueueLength() {
        return this.queue.length;
    }

    // Static convenience methods
    static success(message, duration) {
        SnackbarController.show(message, duration, 'success');
    }

    static error(message, duration) {
        SnackbarController.show(message, duration, 'error');
    }

    static warning(message, duration) {
        SnackbarController.show(message, duration, 'warning');
    }

    static info(message, duration) {
        SnackbarController.show(message, duration, 'info');
    }
}
