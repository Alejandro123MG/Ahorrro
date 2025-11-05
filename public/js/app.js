// Main Application Logic
const app = {
    currentView: 'login',

    init: function() {
        if (auth.isAuthenticated()) {
            this.loadView('dashboard');
        } else {
            this.loadView('login');
        }
    },

    loadView: async function(viewName) {
        this.currentView = viewName;
        const response = await fetch(`views/${viewName}.html`);
        const html = await response.text();
        document.getElementById('app').innerHTML = html;

        // Initialize view-specific logic
        this.initViewLogic(viewName);
    },

    initViewLogic: function(viewName) {
        switch(viewName) {
            case 'login':
                this.initLogin();
                break;
            case 'register':
                this.initRegister();
                break;
            case 'dashboard':
                this.initDashboard();
                break;
            case 'transactions':
                this.initTransactions();
                break;
            case 'newTransaction':
                this.initNewTransaction();
                break;
            case 'savingGoals':
                this.initSavingGoals();
                break;
            case 'newSavingGoal':
                this.initNewSavingGoal();
                break;
            case 'investments':
                this.initInvestments();
                break;
            case 'newInvestment':
                this.initNewInvestment();
                break;
            case 'profile':
                this.initProfile();
                break;
            case 'settings':
                this.initSettings();
                break;
        }

        // Add global event listeners
        this.addGlobalListeners();
    },

    addGlobalListeners: function() {
        // Navigation links
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('[data-view]').getAttribute('data-view');
                this.loadView(view);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const token = auth.getToken();
                if (token) {
                    await api.logout(token);
                }
                auth.logout();
                this.loadView('login');
            });
        }

        // Update username display
        const usernameEl = document.getElementById('username');
        if (usernameEl) {
            const user = auth.getUser();
            if (user) {
                usernameEl.textContent = user.username;
            }
        }
    },

    // Login View
    initLogin: function() {
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('loginError');
        const goToRegister = document.getElementById('goToRegister');

        goToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadView('register');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const result = await api.login({ email, password });

                if (result.token) {
                    auth.setToken(result.token);
                    auth.setUser({ _id: result._id, username: result.username, email: result.email });
                    this.loadView('dashboard');
                } else {
                    errorDiv.textContent = result.message || 'Error al iniciar sesión';
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    },

    // Register View
    initRegister: function() {
        const form = document.getElementById('registerForm');
        const errorDiv = document.getElementById('registerError');
        const goToLogin = document.getElementById('goToLogin');

        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadView('login');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                errorDiv.textContent = 'Las contraseñas no coinciden';
                errorDiv.classList.remove('d-none');
                return;
            }

            try {
                const result = await api.register({ username, email, password });

                if (result.token) {
                    errorDiv.classList.add('alert-danger');
                    errorDiv.classList.add('alert-success');
                    errorDiv.textContent = 'Registro exitoso. Redirigiendo...';
                    errorDiv.classList.remove('d-none');
                    setTimeout(() => this.loadView('login'), 1500);
                } else {
                    errorDiv.textContent = result.message || 'Error al registrarse';
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    },

    // Dashboard View
    initDashboard: async function() {
        const token = auth.getToken();

        try {
            // Load transactions
            const transactions = await api.getTransactions(token);

            // Load saving goals
            const savingGoals = await api.getSavingGoals(token);

            // Load investments
            const investments = await api.getInvestments(token);

            // Calculate balance
            let totalIncome = 0;
            let totalExpenses = 0;
            let incomeAvailable = 0; // Ingresos sin meta
            let incomeInSavingGoals = 0; // Ingresos asignados a metas

            if (Array.isArray(transactions)) {
                transactions.forEach(t => {
                    if (t.type === 'income') {
                        totalIncome += t.amount;
                        if (t.savingGoalId) {
                            incomeInSavingGoals += t.amount;
                        } else {
                            incomeAvailable += t.amount;
                        }
                    } else {
                        totalExpenses += t.amount;
                    }
                });
            }

            // Calculate available balance (ingresos sin meta - gastos)
            const availableBalance = incomeAvailable - totalExpenses;

            const balance = totalIncome - totalExpenses;
            document.getElementById('totalBalance').textContent = `$${balance.toFixed(2)}`;

            // Display active saving goals count
            document.getElementById('activeSavingGoals').textContent = Array.isArray(savingGoals) ? savingGoals.length : 0;

            // Calculate total investments
            let totalInvestmentsValue = 0;
            if (Array.isArray(investments)) {
                investments.forEach(inv => {
                    totalInvestmentsValue += inv.currentValue;
                });
            }
            document.getElementById('totalInvestments').textContent = `$${totalInvestmentsValue.toFixed(2)}`;

            // Display financial summary
            this.displayFinancialSummary(savingGoals, availableBalance, incomeInSavingGoals);

            // Display recent transactions
            this.displayRecentTransactions(transactions);

            // Display saving goals progress
            this.displaySavingGoalsProgress(savingGoals);

            // Create charts
            this.createExpensesByCategoryChart(transactions);
            this.createIncomeVsExpensesChart(transactions);

        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    },

    displayFinancialSummary: function(savingGoals, availableBalance, incomeInSavingGoals) {
        const summaryDiv = document.getElementById('savingGoalsSummary');
        const availableBalanceEl = document.getElementById('availableBalance');
        const totalAccumulatedEl = document.getElementById('totalAccumulated');
        const alertEl = document.getElementById('availableBalanceAlert');

        // Display saving goals
        if (!Array.isArray(savingGoals) || savingGoals.length === 0) {
            summaryDiv.innerHTML = '<p class="text-muted"><i class="bi bi-info-circle"></i> No tienes metas de ahorro creadas</p>';
        } else {
            summaryDiv.innerHTML = savingGoals.map(goal => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span><i class="bi bi-piggy-bank text-info"></i> ${goal.name}:</span>
                    <strong>$${goal.currentAmount.toFixed(2)}</strong>
                </div>
            `).join('');
        }

        // Display available balance
        availableBalanceEl.textContent = `$${availableBalance.toFixed(2)}`;

        // Change alert color based on available balance
        alertEl.classList.remove('alert-info', 'alert-warning', 'alert-danger', 'alert-success');
        if (availableBalance < 0) {
            alertEl.classList.add('alert-danger');
        } else if (availableBalance === 0) {
            alertEl.classList.add('alert-warning');
        } else {
            alertEl.classList.add('alert-success');
        }

        // Calculate total accumulated (saving goals + available)
        let totalInSavingGoals = 0;
        if (Array.isArray(savingGoals)) {
            savingGoals.forEach(goal => {
                totalInSavingGoals += goal.currentAmount;
            });
        }
        const totalAccumulated = totalInSavingGoals + availableBalance;
        totalAccumulatedEl.textContent = `$${totalAccumulated.toFixed(2)}`;
    },

    displayRecentTransactions: function(transactions) {
        const tbody = document.getElementById('recentTransactions');

        if (!Array.isArray(transactions) || transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay transacciones</td></tr>';
            return;
        }

        const recent = transactions.slice(0, 5);
        tbody.innerHTML = recent.map(t => {
            let badgeClass, badgeText, badgeIcon;

            if (t.type === 'income') {
                if (t.savingGoalId) {
                    badgeClass = 'bg-info';
                    badgeText = 'Ingreso (Meta)';
                    badgeIcon = '<i class="bi bi-piggy-bank"></i>';
                } else {
                    badgeClass = 'bg-success';
                    badgeText = 'Ingreso';
                    badgeIcon = '<i class="bi bi-cash-coin"></i>';
                }
            } else {
                badgeClass = 'bg-danger';
                badgeText = 'Gasto';
                badgeIcon = '<i class="bi bi-cart"></i>';
            }

            const savingGoalInfo = t.savingGoalId ? ` (${t.savingGoalId.name})` : '';

            return `
                <tr>
                    <td>${new Date(t.date).toLocaleDateString()}</td>
                    <td><span class="badge ${badgeClass}">${badgeIcon} ${badgeText}</span></td>
                    <td>${t.category}${savingGoalInfo}</td>
                    <td>${t.description || '-'}</td>
                    <td>$${t.amount.toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    },

    displaySavingGoalsProgress: function(savingGoals) {
        const container = document.getElementById('savingGoalsProgress');

        if (!Array.isArray(savingGoals) || savingGoals.length === 0) {
            container.innerHTML = '<p class="text-center">No hay metas de ahorro</p>';
            return;
        }

        container.innerHTML = savingGoals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>${goal.name}</span>
                        <span>$${goal.currentAmount.toFixed(2)} / $${goal.targetAmount.toFixed(2)}</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress.toFixed(0)}%</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    createExpensesByCategoryChart: function(transactions) {
        const canvas = document.getElementById('expensesByCategoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Filter expenses only
        const expenses = transactions.filter(t => t.type === 'expense');

        // Group by category
        const categoryTotals = {};
        expenses.forEach(t => {
            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }
            categoryTotals[t.category] += t.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            }
        });
    },

    createIncomeVsExpensesChart: function(transactions) {
        const canvas = document.getElementById('incomeVsExpensesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpenses += t.amount;
            }
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos'],
                datasets: [{
                    label: 'Monto',
                    data: [totalIncome, totalExpenses],
                    backgroundColor: ['#4BC0C0', '#FF6384']
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    // Transactions View
    initTransactions: async function() {
        const token = auth.getToken();

        try {
            const transactions = await api.getTransactions(token);
            this.displayTransactionsTable(transactions);

            // Filter functionality
            document.getElementById('applyFilters').addEventListener('click', () => {
                this.applyTransactionFilters(transactions);
            });

            document.getElementById('clearFilters').addEventListener('click', () => {
                document.getElementById('filterType').value = '';
                document.getElementById('filterCategory').value = '';
                document.getElementById('filterDateFrom').value = '';
                document.getElementById('filterDateTo').value = '';
                this.displayTransactionsTable(transactions);
            });

        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    },

    displayTransactionsTable: function(transactions) {
        const tbody = document.getElementById('transactionsTable');

        if (!Array.isArray(transactions) || transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay transacciones</td></tr>';
            return;
        }

        tbody.innerHTML = transactions.map(t => {
            let badgeClass, badgeText, badgeIcon;

            if (t.type === 'income') {
                if (t.savingGoalId) {
                    // Ingreso asignado a meta de ahorro
                    badgeClass = 'bg-info';
                    badgeText = 'Ingreso (Meta)';
                    badgeIcon = '<i class="bi bi-piggy-bank"></i>';
                } else {
                    // Ingreso disponible (colchón)
                    badgeClass = 'bg-success';
                    badgeText = 'Ingreso';
                    badgeIcon = '<i class="bi bi-cash-coin"></i>';
                }
            } else {
                // Gasto
                badgeClass = 'bg-danger';
                badgeText = 'Gasto';
                badgeIcon = '<i class="bi bi-cart"></i>';
            }

            const savingGoalInfo = t.savingGoalId ?
                `<small class="text-muted"><br>${badgeIcon} ${t.savingGoalId.name || 'Meta de ahorro'}</small>` : '';

            return `
                <tr>
                    <td>${new Date(t.date).toLocaleDateString()}</td>
                    <td>
                        <span class="badge ${badgeClass}">
                            ${badgeIcon} ${badgeText}
                        </span>
                    </td>
                    <td>${t.category}${savingGoalInfo}</td>
                    <td>${t.description || '-'}</td>
                    <td>$${t.amount.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteTransaction('${t._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    applyTransactionFilters: function(transactions) {
        const type = document.getElementById('filterType').value;
        const category = document.getElementById('filterCategory').value.toLowerCase();
        const dateFrom = document.getElementById('filterDateFrom').value;
        const dateTo = document.getElementById('filterDateTo').value;

        let filtered = transactions;

        if (type) {
            filtered = filtered.filter(t => t.type === type);
        }

        if (category) {
            filtered = filtered.filter(t => t.category.toLowerCase().includes(category));
        }

        if (dateFrom) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(dateFrom));
        }

        if (dateTo) {
            filtered = filtered.filter(t => new Date(t.date) <= new Date(dateTo));
        }

        this.displayTransactionsTable(filtered);
    },

    deleteTransaction: async function(id) {
        if (!confirm('¿Estás seguro de eliminar esta transacción?')) return;

        const token = auth.getToken();

        try {
            await api.deleteTransaction(token, id);
            this.loadView('transactions');
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    },

    // New Transaction View
    initNewTransaction: async function() {
        const form = document.getElementById('newTransactionForm');
        const errorDiv = document.getElementById('transactionError');
        const typeSelect = document.getElementById('transactionType');
        const savingGoalSection = document.getElementById('savingGoalSection');
        const savingGoalSelect = document.getElementById('transactionSavingGoal');

        // Set today's date as default
        document.getElementById('transactionDate').valueAsDate = new Date();

        // Load saving goals
        const token = auth.getToken();
        let savingGoals = [];

        try {
            savingGoals = await api.getSavingGoals(token);
        } catch (error) {
            console.error('Error loading saving goals:', error);
        }

        // Show/hide saving goal section based on transaction type
        typeSelect.addEventListener('change', function() {
            if (this.value === 'income') {
                savingGoalSection.style.display = 'block';

                // Populate saving goals dropdown
                savingGoalSelect.innerHTML = '<option value="">Ninguna (Dinero disponible)</option>';

                if (Array.isArray(savingGoals) && savingGoals.length > 0) {
                    savingGoals.forEach(goal => {
                        const option = document.createElement('option');
                        option.value = goal._id;
                        option.textContent = `${goal.name} ($${goal.currentAmount.toFixed(2)} / $${goal.targetAmount.toFixed(2)})`;
                        savingGoalSelect.appendChild(option);
                    });
                }
            } else {
                savingGoalSection.style.display = 'none';
                savingGoalSelect.value = '';
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const transactionData = {
                type: document.getElementById('transactionType').value,
                amount: parseFloat(document.getElementById('transactionAmount').value),
                category: document.getElementById('transactionCategory').value,
                description: document.getElementById('transactionDescription').value,
                date: document.getElementById('transactionDate').value
            };

            // Add savingGoalId if selected and type is income
            const savingGoalId = savingGoalSelect.value;
            if (savingGoalId && transactionData.type === 'income') {
                transactionData.savingGoalId = savingGoalId;
            }

            // Validate available funds for expenses
            if (transactionData.type === 'expense') {
                try {
                    // Get current transactions to calculate available balance
                    const transactions = await api.getTransactions(token);

                    let incomeAvailable = 0;
                    let totalExpenses = 0;

                    if (Array.isArray(transactions)) {
                        transactions.forEach(t => {
                            if (t.type === 'income' && !t.savingGoalId) {
                                incomeAvailable += t.amount;
                            } else if (t.type === 'expense') {
                                totalExpenses += t.amount;
                            }
                        });
                    }

                    const availableBalance = incomeAvailable - totalExpenses;
                    const totalInSavingGoals = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

                    if (availableBalance < transactionData.amount) {
                        // Not enough available balance
                        if (totalInSavingGoals > 0) {
                            // Has money in saving goals
                            const confirmWithdraw = confirm(
                                `No tienes suficiente ingreso disponible ($${availableBalance.toFixed(2)}).\n\n` +
                                `Tienes $${totalInSavingGoals.toFixed(2)} en metas de ahorro.\n\n` +
                                `¿Deseas ir a la sección de Metas de Ahorro para retirar dinero?`
                            );

                            if (confirmWithdraw) {
                                this.loadView('savingGoals');
                                return;
                            } else {
                                return;
                            }
                        } else {
                            // No money anywhere
                            errorDiv.textContent = `No tienes suficiente ingreso disponible para este gasto. Disponible: $${availableBalance.toFixed(2)}`;
                            errorDiv.classList.remove('d-none');
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error checking available balance:', error);
                }
            }

            try {
                const result = await api.createTransaction(token, transactionData);

                if (result._id) {
                    this.loadView('transactions');
                } else {
                    errorDiv.textContent = result.message || 'Error al crear transacción';
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    },

    // Saving Goals View
    initSavingGoals: async function() {
        const token = auth.getToken();

        try {
            const savingGoals = await api.getSavingGoals(token);
            this.displaySavingGoalsCards(savingGoals);
        } catch (error) {
            console.error('Error loading saving goals:', error);
        }
    },

    displaySavingGoalsCards: function(savingGoals) {
        const container = document.getElementById('savingGoalsContainer');

        if (!Array.isArray(savingGoals) || savingGoals.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No hay metas de ahorro</p></div>';
            return;
        }

        container.innerHTML = savingGoals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const targetDate = goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Sin fecha límite';

            return `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${goal.name}</h5>
                            <p class="card-text">Objetivo: $${goal.targetAmount.toFixed(2)}</p>
                            <p class="card-text">Actual: $${goal.currentAmount.toFixed(2)}</p>
                            <p class="card-text"><small class="text-muted">Fecha: ${targetDate}</small></p>
                            <div class="progress mb-3">
                                <div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress.toFixed(0)}%</div>
                            </div>
                            <div class="btn-group w-100 mb-2" role="group">
                                <button class="btn btn-sm btn-warning" onclick="app.withdrawFromSavingGoal('${goal._id}', '${goal.name}', ${goal.currentAmount})" ${goal.currentAmount <= 0 ? 'disabled' : ''}>
                                    <i class="bi bi-arrow-down-circle"></i> Retirar
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="app.deleteSavingGoal('${goal._id}')">
                                    <i class="bi bi-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    withdrawFromSavingGoal: async function(goalId, goalName, currentAmount) {
        const amount = prompt(`¿Cuánto dinero deseas retirar de "${goalName}"?\n\nDisponible: $${currentAmount.toFixed(2)}`);

        if (!amount) return;

        const withdrawAmount = parseFloat(amount);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            alert('Por favor ingresa un monto válido');
            return;
        }

        if (withdrawAmount > currentAmount) {
            alert(`No puedes retirar más de $${currentAmount.toFixed(2)}`);
            return;
        }

        const token = auth.getToken();

        try {
            // Update the saving goal to reduce the current amount
            const newAmount = currentAmount - withdrawAmount;
            await api.updateSavingGoal(token, goalId, { currentAmount: newAmount });

            // Create an income transaction (without saving goal) to add to available balance
            await api.createTransaction(token, {
                type: 'income',
                amount: withdrawAmount,
                category: 'Retiro de Meta',
                description: `Retiro de meta de ahorro: ${goalName}`,
                date: new Date().toISOString().split('T')[0]
            });

            alert(`Se retiraron $${withdrawAmount.toFixed(2)} de "${goalName}" y se agregaron a tu ingreso disponible`);
            this.loadView('savingGoals');

        } catch (error) {
            console.error('Error withdrawing from saving goal:', error);
            alert('Error al realizar el retiro');
        }
    },

    deleteSavingGoal: async function(id) {
        if (!confirm('¿Estás seguro de eliminar esta meta?')) return;

        const token = auth.getToken();

        try {
            await api.deleteSavingGoal(token, id);
            this.loadView('savingGoals');
        } catch (error) {
            console.error('Error deleting saving goal:', error);
        }
    },

    // New Saving Goal View
    initNewSavingGoal: function() {
        const form = document.getElementById('newSavingGoalForm');
        const errorDiv = document.getElementById('savingGoalError');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const token = auth.getToken();

            const goalData = {
                name: document.getElementById('goalName').value,
                targetAmount: parseFloat(document.getElementById('goalTargetAmount').value),
                currentAmount: parseFloat(document.getElementById('goalCurrentAmount').value) || 0,
                targetDate: document.getElementById('goalTargetDate').value || undefined
            };

            try {
                const result = await api.createSavingGoal(token, goalData);

                if (result._id) {
                    this.loadView('savingGoals');
                } else {
                    errorDiv.textContent = result.message || 'Error al crear meta';
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    },

    // Investments View
    initInvestments: async function() {
        const token = auth.getToken();

        try {
            const investments = await api.getInvestments(token);
            this.displayInvestmentsCards(investments);
        } catch (error) {
            console.error('Error loading investments:', error);
        }
    },

    displayInvestmentsCards: function(investments) {
        const container = document.getElementById('investmentsContainer');

        if (!Array.isArray(investments) || investments.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No hay inversiones</p></div>';
            return;
        }

        container.innerHTML = investments.map(inv => {
            const performance = inv.currentValue - inv.initialAmount;
            const performancePercent = (performance / inv.initialAmount) * 100;
            const performanceClass = performance >= 0 ? 'text-success' : 'text-danger';

            return `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${inv.name}</h5>
                            <p class="card-text">Tipo: ${inv.type}</p>
                            <p class="card-text">Inversión inicial: $${inv.initialAmount.toFixed(2)}</p>
                            <p class="card-text">Valor actual: $${inv.currentValue.toFixed(2)}</p>
                            <p class="card-text ${performanceClass}">
                                Rendimiento: $${performance.toFixed(2)} (${performancePercent.toFixed(2)}%)
                            </p>
                            <p class="card-text"><small class="text-muted">Fecha de inicio: ${new Date(inv.startDate).toLocaleDateString()}</small></p>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteInvestment('${inv._id}')">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    deleteInvestment: async function(id) {
        if (!confirm('¿Estás seguro de eliminar esta inversión?')) return;

        const token = auth.getToken();

        try {
            await api.deleteInvestment(token, id);
            this.loadView('investments');
        } catch (error) {
            console.error('Error deleting investment:', error);
        }
    },

    // New Investment View
    initNewInvestment: function() {
        const form = document.getElementById('newInvestmentForm');
        const errorDiv = document.getElementById('investmentError');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const token = auth.getToken();

            const investmentData = {
                name: document.getElementById('investmentName').value,
                type: document.getElementById('investmentType').value,
                initialAmount: parseFloat(document.getElementById('investmentInitialAmount').value),
                currentValue: parseFloat(document.getElementById('investmentCurrentValue').value),
                startDate: document.getElementById('investmentStartDate').value
            };

            try {
                const result = await api.createInvestment(token, investmentData);

                if (result._id) {
                    this.loadView('investments');
                } else {
                    errorDiv.textContent = result.message || 'Error al crear inversión';
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    },

    // Profile View
    initProfile: async function() {
        const token = auth.getToken();
        const form = document.getElementById('profileForm');
        const successDiv = document.getElementById('profileSuccess');
        const errorDiv = document.getElementById('profileError');

        try {
            const profile = await api.getProfile(token);

            document.getElementById('profileUsername').value = profile.username;
            document.getElementById('profileEmail').value = profile.email;

        } catch (error) {
            console.error('Error loading profile:', error);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successDiv.classList.add('d-none');
            errorDiv.classList.add('d-none');

            const newPassword = document.getElementById('profileNewPassword').value;
            const confirmPassword = document.getElementById('profileConfirmPassword').value;

            if (newPassword && newPassword !== confirmPassword) {
                errorDiv.textContent = 'Las contraseñas no coinciden';
                errorDiv.classList.remove('d-none');
                return;
            }

            const profileData = {
                username: document.getElementById('profileUsername').value,
                email: document.getElementById('profileEmail').value
            };

            if (newPassword) {
                profileData.password = newPassword;
            }

            try {
                const result = await api.updateProfile(token, profileData);

                if (result._id) {
                    auth.setUser({ _id: result._id, username: result.username, email: result.email });
                    successDiv.textContent = 'Perfil actualizado correctamente';
                    successDiv.classList.remove('d-none');

                    // Clear password fields
                    document.getElementById('profileNewPassword').value = '';
                    document.getElementById('profileConfirmPassword').value = '';
                } else {
                    errorDiv.textContent = result.message || 'Error al actualizar perfil';
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    },

    // Settings View
    initSettings: async function() {
        const token = auth.getToken();
        const form = document.getElementById('settingsForm');
        const successDiv = document.getElementById('settingsSuccess');

        try {
            const profile = await api.getProfile(token);

            if (profile.preferences) {
                document.getElementById('settingsTheme').value = profile.preferences.theme || 'light';
                document.getElementById('settingsLanguage').value = profile.preferences.language || 'es';
            }

        } catch (error) {
            console.error('Error loading settings:', error);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successDiv.classList.add('d-none');

            const preferences = {
                preferences: {
                    theme: document.getElementById('settingsTheme').value,
                    language: document.getElementById('settingsLanguage').value
                }
            };

            try {
                const result = await api.updateProfile(token, preferences);

                if (result._id) {
                    successDiv.textContent = 'Preferencias guardadas correctamente';
                    successDiv.classList.remove('d-none');
                } else {
                    alert('Error al guardar preferencias');
                }
            } catch (error) {
                alert('Error de conexión');
            }
        });
    }
};

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
