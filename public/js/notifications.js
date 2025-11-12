// Toast Notification System

const notifications = {
    container: null,

    // Initialize toast container
    init: function() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    // Show toast notification
    show: function(message, type = 'success', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type} show`;

        const icon = this.getIcon(type);

        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="notifications.close(this)">
                <i class="bi bi-x"></i>
            </button>
        `;

        this.container.appendChild(toast);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.close(toast);
            }, duration);
        }

        return toast;
    },

    // Get icon based on type
    getIcon: function(type) {
        const icons = {
            'success': 'bi-check-circle-fill',
            'error': 'bi-exclamation-circle-fill',
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill'
        };
        return icons[type] || icons.info;
    },

    // Close toast
    close: function(element) {
        const toast = element.classList ? element : element.parentElement.parentElement;
        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    },

    // Convenience methods
    success: function(message, duration = 3000) {
        return this.show(message, 'success', duration);
    },

    error: function(message, duration = 4000) {
        return this.show(message, 'error', duration);
    },

    warning: function(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    },

    info: function(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    notifications.init();
});
