// Investment Forms Logic and Calculations

const investmentForms = {
    // Initialize investment type selection
    initNewInvestment: function() {
        const typeCards = document.querySelectorAll('.investment-type-card');

        typeCards.forEach(card => {
            card.addEventListener('click', () => {
                const investmentType = card.getAttribute('data-investment-type');
                this.navigateToForm(investmentType);
            });
        });
    },

    navigateToForm: function(type) {
        const viewMap = {
            'bitcoin': 'investmentFormBitcoin',
            'bienes-raices': 'investmentFormRealEstate',
            'acciones': 'investmentFormStocks',
            'fondos-ahorro': 'investmentFormSavingsFund'
        };

        const viewName = viewMap[type];
        if (viewName) {
            app.loadView(viewName);
        }
    },

    // Bitcoin Form
    initBitcoinForm: function() {
        const form = document.getElementById('bitcoinInvestmentForm');
        const errorDiv = document.getElementById('investmentError');

        // Real-time calculations
        const quantityBTC = document.getElementById('quantityBTC');
        const purchasePrice = document.getElementById('purchasePrice');
        const currentPrice = document.getElementById('currentPrice');
        const commission = document.getElementById('commission');

        const updateBitcoinCalculations = () => {
            const qty = parseFloat(quantityBTC.value) || 0;
            const pPrice = parseFloat(purchasePrice.value) || 0;
            const cPrice = parseFloat(currentPrice.value) || 0;
            const comm = parseFloat(commission.value) || 0;

            const initialAmount = (qty * pPrice) + comm;
            const currentValue = qty * cPrice;
            const performance = currentValue - initialAmount;
            const performancePercent = initialAmount > 0 ? (performance / initialAmount) * 100 : 0;

            document.getElementById('initialAmountDisplay').textContent = `$${initialAmount.toFixed(2)}`;
            document.getElementById('currentValueDisplay').textContent = `$${currentValue.toFixed(2)}`;

            const perfDisplay = document.getElementById('performanceDisplay');
            perfDisplay.textContent = `${performancePercent >= 0 ? '+' : ''}${performancePercent.toFixed(2)}%`;
            perfDisplay.className = `form-control-plaintext fw-bold ${performancePercent >= 0 ? 'text-success' : 'text-danger'}`;
        };

        [quantityBTC, purchasePrice, currentPrice, commission].forEach(input => {
            if (input) {
                input.addEventListener('input', updateBitcoinCalculations);
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const token = auth.getToken();

            const qty = parseFloat(quantityBTC.value) || 0;
            const pPrice = parseFloat(purchasePrice.value) || 0;
            const cPrice = parseFloat(currentPrice.value) || 0;
            const comm = parseFloat(commission.value) || 0;

            const initialAmount = (qty * pPrice) + comm;
            const currentValue = qty * cPrice;

            const investmentData = {
                name: document.getElementById('investmentName').value,
                type: 'bitcoin',
                initialAmount: initialAmount,
                currentValue: currentValue,
                startDate: document.getElementById('startDate').value,
                notes: document.getElementById('notes').value,
                bitcoin: {
                    quantityBTC: qty,
                    purchasePrice: pPrice,
                    currentPrice: cPrice,
                    exchange: document.getElementById('exchange').value,
                    commission: comm
                }
            };

            try {
                const result = await api.createInvestment(token, investmentData);
                if (result._id) {
                    app.loadView('investments');
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

    // Real Estate Form
    initRealEstateForm: function() {
        const form = document.getElementById('realEstateInvestmentForm');
        const errorDiv = document.getElementById('investmentError');

        // Real-time calculations
        const purchaseValue = document.getElementById('purchaseValue');
        const currentValue = document.getElementById('currentValue');

        const updateRealEstateCalculations = () => {
            const pValue = parseFloat(purchaseValue.value) || 0;
            const cValue = parseFloat(currentValue.value) || 0;

            const appreciation = cValue - pValue;
            const performance = pValue > 0 ? (appreciation / pValue) * 100 : 0;

            document.getElementById('initialAmountDisplay').textContent = `$${pValue.toFixed(2)}`;
            document.getElementById('currentValueDisplay').textContent = `$${cValue.toFixed(2)}`;
            document.getElementById('appreciationDisplay').textContent = `${appreciation >= 0 ? '+' : ''}$${appreciation.toFixed(2)}`;

            const perfDisplay = document.getElementById('performanceDisplay');
            perfDisplay.textContent = `${performance >= 0 ? '+' : ''}${performance.toFixed(2)}%`;
            perfDisplay.className = `form-control-plaintext fw-bold ${performance >= 0 ? 'text-success' : 'text-danger'}`;
        };

        [purchaseValue, currentValue].forEach(input => {
            if (input) {
                input.addEventListener('input', updateRealEstateCalculations);
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const token = auth.getToken();

            const pValue = parseFloat(purchaseValue.value) || 0;
            const cValue = parseFloat(currentValue.value) || 0;

            const investmentData = {
                name: document.getElementById('investmentName').value,
                type: 'bienes-raices',
                initialAmount: pValue,
                currentValue: cValue,
                startDate: document.getElementById('startDate').value,
                notes: document.getElementById('notes').value,
                realEstate: {
                    propertyType: document.getElementById('propertyType').value,
                    location: document.getElementById('location').value,
                    purchaseValue: pValue,
                    monthlyRent: parseFloat(document.getElementById('monthlyRent').value) || 0,
                    maintenanceCosts: parseFloat(document.getElementById('maintenanceCosts').value) || 0,
                    taxesInsurance: parseFloat(document.getElementById('taxesInsurance').value) || 0,
                    imageUrl: document.getElementById('imageUrl').value
                }
            };

            try {
                const result = await api.createInvestment(token, investmentData);
                if (result._id) {
                    app.loadView('investments');
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

    // Stocks Form
    initStocksForm: function() {
        const form = document.getElementById('stocksInvestmentForm');
        const errorDiv = document.getElementById('investmentError');

        // Real-time calculations
        const quantity = document.getElementById('quantity');
        const purchasePricePerShare = document.getElementById('purchasePricePerShare');
        const currentPricePerShare = document.getElementById('currentPricePerShare');
        const dividendsReceived = document.getElementById('dividendsReceived');
        const brokerCommission = document.getElementById('brokerCommission');

        const updateStocksCalculations = () => {
            const qty = parseFloat(quantity.value) || 0;
            const pPrice = parseFloat(purchasePricePerShare.value) || 0;
            const cPrice = parseFloat(currentPricePerShare.value) || 0;
            const divs = parseFloat(dividendsReceived.value) || 0;
            const comm = parseFloat(brokerCommission.value) || 0;

            const initialAmount = (qty * pPrice) + comm;
            const currentValue = qty * cPrice;
            const totalWithDividends = currentValue + divs;
            const performance = initialAmount > 0 ? ((totalWithDividends - initialAmount) / initialAmount) * 100 : 0;

            document.getElementById('initialAmountDisplay').textContent = `$${initialAmount.toFixed(2)}`;
            document.getElementById('currentValueDisplay').textContent = `$${currentValue.toFixed(2)}`;
            document.getElementById('totalWithDividendsDisplay').textContent = `$${totalWithDividends.toFixed(2)}`;

            const perfDisplay = document.getElementById('performanceDisplay');
            perfDisplay.textContent = `${performance >= 0 ? '+' : ''}${performance.toFixed(2)}%`;
            perfDisplay.className = `form-control-plaintext fw-bold ${performance >= 0 ? 'text-success' : 'text-danger'}`;
        };

        [quantity, purchasePricePerShare, currentPricePerShare, dividendsReceived, brokerCommission].forEach(input => {
            if (input) {
                input.addEventListener('input', updateStocksCalculations);
            }
        });

        // Auto-uppercase ticker
        const ticker = document.getElementById('ticker');
        if (ticker) {
            ticker.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const token = auth.getToken();

            const qty = parseFloat(quantity.value) || 0;
            const pPrice = parseFloat(purchasePricePerShare.value) || 0;
            const cPrice = parseFloat(currentPricePerShare.value) || 0;
            const divs = parseFloat(dividendsReceived.value) || 0;
            const comm = parseFloat(brokerCommission.value) || 0;

            const initialAmount = (qty * pPrice) + comm;
            const currentValue = qty * cPrice;

            const investmentData = {
                name: document.getElementById('investmentName').value,
                type: 'acciones',
                initialAmount: initialAmount,
                currentValue: currentValue + divs,
                startDate: document.getElementById('startDate').value,
                notes: document.getElementById('notes').value,
                stocks: {
                    companyName: document.getElementById('companyName').value,
                    ticker: ticker.value,
                    quantity: qty,
                    purchasePricePerShare: pPrice,
                    currentPricePerShare: cPrice,
                    dividendsReceived: divs,
                    brokerCommission: comm,
                    platform: document.getElementById('platform').value
                }
            };

            try {
                const result = await api.createInvestment(token, investmentData);
                if (result._id) {
                    app.loadView('investments');
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

    // Savings Fund Form
    initSavingsFundForm: function() {
        const form = document.getElementById('savingsFundInvestmentForm');
        const errorDiv = document.getElementById('investmentError');

        // Real-time calculations
        const initialAmount = document.getElementById('initialAmount');
        const annualInterestRate = document.getElementById('annualInterestRate');
        const termMonths = document.getElementById('termMonths');
        const accumulatedAmount = document.getElementById('accumulatedAmount');
        const additionalDeposits = document.getElementById('additionalDeposits');
        const startDate = document.getElementById('startDate');

        const updateSavingsFundCalculations = () => {
            const initial = parseFloat(initialAmount.value) || 0;
            const rate = parseFloat(annualInterestRate.value) || 0;
            const months = parseFloat(termMonths.value) || 0;
            const accumulated = parseFloat(accumulatedAmount.value) || 0;
            const additional = parseFloat(additionalDeposits.value) || 0;

            const totalInvested = initial + additional;
            const currentValue = accumulated;
            const interestEarned = currentValue - totalInvested;
            const performance = totalInvested > 0 ? (interestEarned / totalInvested) * 100 : 0;

            // Calculate estimated return at maturity
            const estimatedReturn = initial * (1 + (rate / 100) * (months / 12));

            document.getElementById('totalInvestedDisplay').textContent = `$${totalInvested.toFixed(2)}`;
            document.getElementById('currentValueDisplay').textContent = `$${currentValue.toFixed(2)}`;
            document.getElementById('interestEarnedDisplay').textContent = `$${interestEarned.toFixed(2)}`;
            document.getElementById('estimatedReturnDisplay').textContent = `$${estimatedReturn.toFixed(2)}`;

            const perfDisplay = document.getElementById('performanceDisplay');
            perfDisplay.textContent = `${performance >= 0 ? '+' : ''}${performance.toFixed(2)}%`;
            perfDisplay.className = `form-control-plaintext fw-bold ${performance >= 0 ? 'text-success' : 'text-danger'}`;
        };

        [initialAmount, annualInterestRate, termMonths, accumulatedAmount, additionalDeposits].forEach(input => {
            if (input) {
                input.addEventListener('input', updateSavingsFundCalculations);
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');

            const token = auth.getToken();

            const initial = parseFloat(initialAmount.value) || 0;
            const accumulated = parseFloat(accumulatedAmount.value) || 0;
            const additional = parseFloat(additionalDeposits.value) || 0;

            const investmentData = {
                name: document.getElementById('investmentName').value,
                type: 'fondos-ahorro',
                initialAmount: initial + additional,
                currentValue: accumulated,
                startDate: document.getElementById('startDate').value,
                notes: document.getElementById('notes').value,
                savingsFund: {
                    fundName: document.getElementById('fundName').value,
                    fundType: document.getElementById('fundType').value,
                    annualInterestRate: parseFloat(annualInterestRate.value) || 0,
                    termMonths: parseFloat(termMonths.value) || 0,
                    accumulatedAmount: accumulated,
                    additionalDeposits: additional,
                    earlyWithdrawalPenalty: parseFloat(document.getElementById('earlyWithdrawalPenalty').value) || 0
                }
            };

            try {
                const result = await api.createInvestment(token, investmentData);
                if (result._id) {
                    app.loadView('investments');
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

    // Display investments with type-specific details
    displayInvestmentsCards: function(investments) {
        const container = document.getElementById('investmentsContainer');

        if (!Array.isArray(investments) || investments.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No hay inversiones registradas</p></div>';
            return;
        }

        container.innerHTML = investments.map(inv => {
            return this.createInvestmentCard(inv);
        }).join('');
    },

    createInvestmentCard: function(inv) {
        const performance = inv.currentValue - inv.initialAmount;
        const performancePercent = inv.initialAmount > 0 ? (performance / inv.initialAmount) * 100 : 0;
        const performanceClass = performance >= 0 ? 'positive' : 'negative';
        const performanceSign = performance >= 0 ? '+' : '';

        const typeIcons = {
            'bitcoin': 'bi-currency-bitcoin',
            'bienes-raices': 'bi-house-door',
            'acciones': 'bi-graph-up-arrow',
            'fondos-ahorro': 'bi-piggy-bank'
        };

        const typeNames = {
            'bitcoin': 'Bitcoin',
            'bienes-raices': 'Bienes Raíces',
            'acciones': 'Acciones',
            'fondos-ahorro': 'Fondos de Ahorro'
        };

        const typeIcon = typeIcons[inv.type] || 'bi-wallet2';
        const typeName = typeNames[inv.type] || inv.type;

        let specificDetails = '';

        // Add type-specific details
        switch(inv.type) {
            case 'bitcoin':
                if (inv.bitcoin) {
                    specificDetails = `
                        <p class="card-text small mb-1"><strong>Cantidad:</strong> ${inv.bitcoin.quantityBTC} BTC</p>
                        <p class="card-text small mb-1"><strong>Precio actual:</strong> $${inv.bitcoin.currentPrice?.toFixed(2) || 0}</p>
                        <p class="card-text small"><strong>Exchange:</strong> ${inv.bitcoin.exchange || 'N/A'}</p>
                    `;
                }
                break;
            case 'bienes-raices':
                if (inv.realEstate) {
                    specificDetails = `
                        <p class="card-text small mb-1"><strong>Tipo:</strong> ${inv.realEstate.propertyType || 'N/A'}</p>
                        <p class="card-text small mb-1"><strong>Ubicación:</strong> ${inv.realEstate.location || 'N/A'}</p>
                        ${inv.realEstate.monthlyRent ? `<p class="card-text small"><strong>Renta:</strong> $${inv.realEstate.monthlyRent.toFixed(2)}/mes</p>` : ''}
                    `;
                }
                break;
            case 'acciones':
                if (inv.stocks) {
                    specificDetails = `
                        <p class="card-text small mb-1"><strong>Empresa:</strong> ${inv.stocks.companyName || 'N/A'}</p>
                        <p class="card-text small mb-1"><strong>Ticker:</strong> ${inv.stocks.ticker || 'N/A'}</p>
                        <p class="card-text small"><strong>Acciones:</strong> ${inv.stocks.quantity || 0} @ $${inv.stocks.currentPricePerShare?.toFixed(2) || 0}</p>
                    `;
                }
                break;
            case 'fondos-ahorro':
                if (inv.savingsFund) {
                    specificDetails = `
                        <p class="card-text small mb-1"><strong>Fondo:</strong> ${inv.savingsFund.fundName || 'N/A'}</p>
                        <p class="card-text small mb-1"><strong>Tipo:</strong> ${inv.savingsFund.fundType || 'N/A'}</p>
                        <p class="card-text small"><strong>Tasa:</strong> ${inv.savingsFund.annualInterestRate || 0}% anual</p>
                    `;
                }
                break;
        }

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card investment-detail-card ${inv.type}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="d-flex align-items-center">
                                <div class="investment-icon ${inv.type}-icon me-2" style="width: 40px; height: 40px; font-size: 1.2rem;">
                                    <i class="bi ${typeIcon}"></i>
                                </div>
                                <div>
                                    <h5 class="card-title mb-0">${inv.name}</h5>
                                    <span class="investment-type-badge ${inv.type}">${typeName}</span>
                                </div>
                            </div>
                        </div>

                        ${specificDetails}

                        <hr>

                        <div class="row text-center mb-3">
                            <div class="col-6">
                                <div class="investment-stat-label">Inversión inicial</div>
                                <div class="investment-stat-value">$${inv.initialAmount.toFixed(2)}</div>
                            </div>
                            <div class="col-6">
                                <div class="investment-stat-label">Valor actual</div>
                                <div class="investment-stat-value">$${inv.currentValue.toFixed(2)}</div>
                            </div>
                        </div>

                        <div class="text-center mb-3">
                            <div class="performance-badge ${performanceClass}">
                                ${performanceSign}$${performance.toFixed(2)} (${performanceSign}${performancePercent.toFixed(2)}%)
                            </div>
                        </div>

                        <p class="card-text text-center"><small class="text-muted">Inicio: ${new Date(inv.startDate).toLocaleDateString()}</small></p>

                        ${inv.notes ? `<p class="card-text small text-muted"><i class="bi bi-journal-text"></i> ${inv.notes}</p>` : ''}

                        <div class="d-grid">
                            <button class="btn btn-sm btn-danger" onclick="investmentForms.deleteInvestment('${inv._id}')">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    deleteInvestment: async function(id) {
        if (!confirm('¿Estás seguro de eliminar esta inversión?')) return;

        const token = auth.getToken();

        try {
            await api.deleteInvestment(token, id);
            app.loadView('investments');
        } catch (error) {
            console.error('Error deleting investment:', error);
            alert('Error al eliminar la inversión');
        }
    }
};
