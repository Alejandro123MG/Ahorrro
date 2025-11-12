// Global Store (Reactive State Management - Similar to Pinia)

const store = {
    // State
    state: {
        theme: 'light',
        language: 'es',
        user: null,
        notifications: {
            enabled: true
        }
    },

    // Observers (similar to watchers in Vue)
    observers: {
        theme: [],
        language: [],
        user: []
    },

    // Initialize store
    init() {
        // Load from localStorage
        const savedTheme = localStorage.getItem('theme');
        const savedLanguage = localStorage.getItem('language');
        const savedNotifications = localStorage.getItem('notifications');

        if (savedTheme) {
            this.state.theme = savedTheme;
        }

        if (savedLanguage) {
            this.state.language = savedLanguage;
        }

        if (savedNotifications) {
            this.state.notifications = JSON.parse(savedNotifications);
        }

        // Try to load user preferences
        if (auth && auth.isAuthenticated && auth.isAuthenticated()) {
            const user = auth.getUser();
            if (user) {
                this.state.user = user;
                if (user.preferences) {
                    if (user.preferences.theme) {
                        this.state.theme = user.preferences.theme;
                    }
                    if (user.preferences.language) {
                        this.state.language = user.preferences.language;
                    }
                }
            }
        }

        // Apply initial theme
        this.applyTheme(this.state.theme);
        this.applyLanguage(this.state.language);

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    },

    // Subscribe to state changes (like watch in Vue)
    subscribe(key, callback) {
        if (this.observers[key]) {
            this.observers[key].push(callback);
        }
    },

    // Notify observers (emit changes)
    notify(key, value) {
        if (this.observers[key]) {
            this.observers[key].forEach(callback => callback(value));
        }
    },

    // Getters
    getTheme() {
        return this.state.theme;
    },

    getLanguage() {
        return this.state.language;
    },

    getUser() {
        return this.state.user;
    },

    getNotifications() {
        return this.state.notifications;
    },

    // Setters (Actions)
    setTheme(theme, save = true) {
        const oldTheme = this.state.theme;
        this.state.theme = theme;

        this.applyTheme(theme);

        if (save) {
            localStorage.setItem('theme', theme);
        }

        // Notify observers
        this.notify('theme', theme);

        // Dispatch custom event for backwards compatibility
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme, oldTheme } }));
    },

    setLanguage(language, save = true) {
        const oldLanguage = this.state.language;
        this.state.language = language;

        this.applyLanguage(language);

        if (save) {
            localStorage.setItem('language', language);
        }

        // Notify observers
        this.notify('language', language);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language, oldLanguage } }));
    },

    setUser(user) {
        this.state.user = user;

        // Update preferences if available
        if (user && user.preferences) {
            if (user.preferences.theme) {
                this.setTheme(user.preferences.theme, false);
            }
            if (user.preferences.language) {
                this.setLanguage(user.preferences.language, false);
            }
        }

        this.notify('user', user);
    },

    setNotifications(notifications) {
        this.state.notifications = notifications;
        localStorage.setItem('notifications', JSON.stringify(notifications));
    },

    // Apply theme to DOM
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
    },

    // Apply language to DOM
    applyLanguage(language) {
        // Update all elements with data-i18n attribute
        this.updateTranslations();
    },

    // Toggle theme
    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    },

    // Save preferences to backend
    async savePreferences() {
        if (!auth || !auth.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        const token = auth.getToken();
        const preferences = {
            preferences: {
                theme: this.state.theme,
                language: this.state.language
            }
        };

        try {
            const result = await api.updateProfile(token, preferences);

            if (result._id) {
                // Update user in memory
                const user = auth.getUser();
                user.preferences = preferences.preferences;
                auth.setUser(user);
                this.state.user = user;

                return { success: true, data: result };
            } else {
                return { success: false, error: 'Update failed' };
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            return { success: false, error: error.message };
        }
    },

    // Translation system
    translations: {
        es: {
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.transactions': 'Transacciones',
            'nav.savingGoals': 'Metas de Ahorro',
            'nav.investments': 'Inversiones',
            'nav.profile': 'Perfil',
            'nav.settings': 'Configuración',
            'nav.logout': 'Cerrar Sesión',

            // Common
            'common.save': 'Guardar',
            'common.cancel': 'Cancelar',
            'common.delete': 'Eliminar',
            'common.edit': 'Editar',
            'common.back': 'Volver',
            'common.add': 'Agregar',
            'common.new': 'Nueva',
            'common.loading': 'Cargando...',
            'common.noData': 'No hay datos disponibles',

            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.financialSummary': 'Resumen Financiero',
            'dashboard.savingGoals': 'Metas de Ahorro',
            'dashboard.availableIncome': 'Ingreso Disponible',
            'dashboard.availableIncomeDesc': 'Dinero que puedes gastar libremente',
            'dashboard.totalAccumulated': 'Total Acumulado',
            'dashboard.totalBalance': 'Balance Total',
            'dashboard.activeGoals': 'Metas Activas',
            'dashboard.totalInvestments': 'Inversiones Totales',
            'dashboard.quickActions': 'Acciones Rápidas',
            'dashboard.newTransaction': 'Nueva Transacción',
            'dashboard.newGoal': 'Nueva Meta',
            'dashboard.newInvestment': 'Nueva Inversión',
            'dashboard.expensesByCategory': 'Gastos por Categoría',
            'dashboard.incomeVsExpenses': 'Ingresos vs Gastos',
            'dashboard.recentTransactions': 'Transacciones Recientes',
            'dashboard.savingGoalsProgress': 'Progreso de Metas de Ahorro',
            'dashboard.date': 'Fecha',
            'dashboard.type': 'Tipo',
            'dashboard.category': 'Categoría',
            'dashboard.description': 'Descripción',
            'dashboard.amount': 'Monto',
            'dashboard.noTransactions': 'No hay transacciones',
            'dashboard.noGoals': 'No hay metas de ahorro',

            // Transactions
            'transactions.title': 'Transacciones',
            'transactions.list': 'Lista de Transacciones',
            'transactions.new': 'Nueva Transacción',
            'transactions.filter': 'Filtrar',
            'transactions.all': 'Todas',
            'transactions.income': 'Ingresos',
            'transactions.expense': 'Gastos',
            'transactions.actions': 'Acciones',

            // Saving Goals
            'savingGoals.title': 'Metas de Ahorro',
            'savingGoals.list': 'Mis Metas',
            'savingGoals.new': 'Nueva Meta',
            'savingGoals.name': 'Nombre',
            'savingGoals.target': 'Meta',
            'savingGoals.current': 'Actual',
            'savingGoals.progress': 'Progreso',
            'savingGoals.actions': 'Acciones',

            // Investments
            'investments.title': 'Inversiones',
            'investments.list': 'Mis Inversiones',
            'investments.new': 'Nueva Inversión',
            'investments.type': 'Tipo',
            'investments.amount': 'Monto',
            'investments.performance': 'Rendimiento',
            'investments.actions': 'Acciones',

            // Profile
            'profile.title': 'Perfil',
            'profile.personalInfo': 'Información Personal',
            'profile.name': 'Nombre',
            'profile.email': 'Correo Electrónico',
            'profile.updateProfile': 'Actualizar Perfil',
            'profile.changePassword': 'Cambiar Contraseña',

            // Settings
            'settings.title': 'Configuración',
            'settings.theme': 'Tema',
            'settings.themeLight': 'Claro',
            'settings.themeDark': 'Oscuro',
            'settings.language': 'Idioma',
            'settings.notifications': 'Notificaciones',
            'settings.notificationsEnabled': 'Activar notificaciones',
            'settings.saveSuccess': 'Configuración guardada exitosamente',
            'settings.saveError': 'Error al guardar configuración'
        },

        en: {
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.transactions': 'Transactions',
            'nav.savingGoals': 'Saving Goals',
            'nav.investments': 'Investments',
            'nav.profile': 'Profile',
            'nav.settings': 'Settings',
            'nav.logout': 'Logout',

            // Common
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.back': 'Back',
            'common.add': 'Add',
            'common.new': 'New',
            'common.loading': 'Loading...',
            'common.noData': 'No data available',

            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.financialSummary': 'Financial Summary',
            'dashboard.savingGoals': 'Saving Goals',
            'dashboard.availableIncome': 'Available Income',
            'dashboard.availableIncomeDesc': 'Money you can spend freely',
            'dashboard.totalAccumulated': 'Total Accumulated',
            'dashboard.totalBalance': 'Total Balance',
            'dashboard.activeGoals': 'Active Goals',
            'dashboard.totalInvestments': 'Total Investments',
            'dashboard.quickActions': 'Quick Actions',
            'dashboard.newTransaction': 'New Transaction',
            'dashboard.newGoal': 'New Goal',
            'dashboard.newInvestment': 'New Investment',
            'dashboard.expensesByCategory': 'Expenses by Category',
            'dashboard.incomeVsExpenses': 'Income vs Expenses',
            'dashboard.recentTransactions': 'Recent Transactions',
            'dashboard.savingGoalsProgress': 'Saving Goals Progress',
            'dashboard.date': 'Date',
            'dashboard.type': 'Type',
            'dashboard.category': 'Category',
            'dashboard.description': 'Description',
            'dashboard.amount': 'Amount',
            'dashboard.noTransactions': 'No transactions',
            'dashboard.noGoals': 'No saving goals',

            // Transactions
            'transactions.title': 'Transactions',
            'transactions.list': 'Transaction List',
            'transactions.new': 'New Transaction',
            'transactions.filter': 'Filter',
            'transactions.all': 'All',
            'transactions.income': 'Income',
            'transactions.expense': 'Expenses',
            'transactions.actions': 'Actions',

            // Saving Goals
            'savingGoals.title': 'Saving Goals',
            'savingGoals.list': 'My Goals',
            'savingGoals.new': 'New Goal',
            'savingGoals.name': 'Name',
            'savingGoals.target': 'Target',
            'savingGoals.current': 'Current',
            'savingGoals.progress': 'Progress',
            'savingGoals.actions': 'Actions',

            // Investments
            'investments.title': 'Investments',
            'investments.list': 'My Investments',
            'investments.new': 'New Investment',
            'investments.type': 'Type',
            'investments.amount': 'Amount',
            'investments.performance': 'Performance',
            'investments.actions': 'Actions',

            // Profile
            'profile.title': 'Profile',
            'profile.personalInfo': 'Personal Information',
            'profile.name': 'Name',
            'profile.email': 'Email',
            'profile.updateProfile': 'Update Profile',
            'profile.changePassword': 'Change Password',

            // Settings
            'settings.title': 'Settings',
            'settings.theme': 'Theme',
            'settings.themeLight': 'Light',
            'settings.themeDark': 'Dark',
            'settings.language': 'Language',
            'settings.notifications': 'Notifications',
            'settings.notificationsEnabled': 'Enable notifications',
            'settings.saveSuccess': 'Settings saved successfully',
            'settings.saveError': 'Error saving settings'
        }
    },

    // Get translation
    t(key) {
        const translation = this.translations[this.state.language]?.[key];
        return translation || key;
    },

    // Update all translations on the page
    updateTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Check if it's a placeholder
            if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }
};

// Initialize store when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => store.init());
} else {
    store.init();
}

// Make store globally available
window.store = store;
