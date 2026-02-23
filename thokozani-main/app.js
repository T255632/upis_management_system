// UPIS Chain Management System - Standalone Web App
class UPISApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isSidebarOpen = true;
        this.user = this.getUser();
        this.data = this.initializeData();
        this.init();
        // Load bar-specific stock when user logs in
        if (this.user.bar_id) {
            this.loadBarStock();
        }
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.loadLucideIcons();
    }

    loadLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getUser() {
        const savedUser = localStorage.getItem('upis_user');
        return savedUser ? JSON.parse(savedUser) : { 
            full_name: 'John Doe', 
            role: 'manager',
            bar_id: 1 
        };
    }

    getInitialStock() {
        return [
            // Beers
            { id: 1, name: 'Tusker Beer', category: 'Beer', quantity: 120, price: 250, expiryDate: '2024-06-15', unit: 'Bottles', minStock: 20 },
            { id: 2, name: 'White Cap', category: 'Beer', quantity: 85, price: 220, expiryDate: '2024-05-20', unit: 'Bottles', minStock: 15 },
            { id: 3, name: 'Pilsner', category: 'Beer', quantity: 60, price: 240, expiryDate: '2024-04-30', unit: 'Bottles', minStock: 10 },
            { id: 4, name: 'Guinness', category: 'Beer', quantity: 45, price: 280, expiryDate: '2024-05-15', unit: 'Bottles', minStock: 8 },
            
            // Spirits
            { id: 5, name: 'Smirnoff Vodka', category: 'Spirits', quantity: 35, price: 800, expiryDate: '2025-12-31', unit: 'Bottles', minStock: 5 },
            { id: 6, name: 'Johnnie Walker Black', category: 'Whisky', quantity: 25, price: 1200, expiryDate: '2025-12-31', unit: 'Bottles', minStock: 3 },
            { id: 7, name: 'Jameson', category: 'Whisky', quantity: 30, price: 900, expiryDate: '2025-12-31', unit: 'Bottles', minStock: 4 },
            { id: 8, name: 'Baileys', category: 'Liqueur', quantity: 20, price: 750, expiryDate: '2025-06-30', unit: 'Bottles', minStock: 3 },
            
            // Wines
            { id: 9, name: 'Martell VS', category: 'Cognac', quantity: 15, price: 1500, expiryDate: '2025-12-31', unit: 'Bottles', minStock: 2 },
            { id: 10, name: 'Hennessey VS', category: 'Cognac', quantity: 12, price: 2000, expiryDate: '2025-12-31', unit: 'Bottles', minStock: 2 },
            
            // Soft Drinks
            { id: 11, name: 'Red Wine - Cabernet', category: 'Wine', quantity: 40, price: 600, expiryDate: '2024-08-15', unit: 'Bottles', minStock: 6 },
            { id: 12, name: 'White Wine - Sauvignon', category: 'Wine', quantity: 35, price: 550, expiryDate: '2024-07-20', unit: 'Bottles', minStock: 5 },
            { id: 13, name: 'Rose Wine', category: 'Wine', quantity: 25, price: 580, expiryDate: '2024-06-30', unit: 'Bottles', minStock: 4 },
            
            // Other
            { id: 14, name: 'Coca Cola', category: 'Soft Drinks', quantity: 200, price: 80, expiryDate: '2024-03-31', unit: 'Bottles', minStock: 30 },
            { id: 15, name: 'Sprite', category: 'Soft Drinks', quantity: 180, price: 80, expiryDate: '2024-03-31', unit: 'Bottles', minStock: 25 },
            { id: 16, name: 'Water', category: 'Soft Drinks', quantity: 250, price: 50, expiryDate: '2024-02-28', unit: 'Bottles', minStock: 40 }
        ];
    }

    initializeData() {
        const savedStock = localStorage.getItem('upis_stock');
        const savedSales = localStorage.getItem('upis_sales');
        const savedDamages = localStorage.getItem('upis_damages');
        
        // If no data exists, initialize with sample data
        if (!savedStock) {
            localStorage.setItem('upis_stock', JSON.stringify(this.getInitialStock()));
        }
        
        return {
            stock: savedStock ? JSON.parse(savedStock) : this.getInitialStock(),
            sales: savedSales ? JSON.parse(savedSales) : [],
            damages: savedDamages ? JSON.parse(savedDamages) : []
        };
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-page]')) {
                e.preventDefault();
                const page = e.target.closest('[data-page]').dataset.page;
                this.navigateToPage(page);
            }
        });

        // Sidebar toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="toggle-sidebar"]')) {
                this.toggleSidebar();
            }
        });

        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="logout"]')) {
                this.logout();
            }
        });
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        this.render();
    }

    logout() {
        localStorage.removeItem('upis_user');
        this.user = null;
        this.navigateToPage('login');
    }

    navigateToPage(page) {
        this.currentPage = page;
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.currentPage === 'login') {
            app.innerHTML = this.renderLoginPage();
        } else {
            app.innerHTML = this.renderMainLayout();
        }
        
        this.loadLucideIcons();
    }

    renderLoginPage() {
        return `
            <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 fade-in">
                    <div class="flex flex-col items-center mb-8">
                        <div class="bg-violet-600 p-4 rounded-2xl mb-4 shadow-lg shadow-violet-200">
                            <i data-lucide="layout-dashboard" class="w-8 h-8 text-white"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-slate-800">UPIS Chain</h1>
                        <p class="text-slate-500 text-sm">Management System MVP</p>
                    </div>

                    <form onsubmit="app.handleLogin(event)" class="space-y-6">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                <i data-lucide="user" class="w-4 h-4 mr-2 text-slate-400"></i>
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                id="fullName"
                                required 
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" 
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                <i data-lucide="shield-check" class="w-4 h-4 mr-2 text-slate-400"></i>
                                Select Role
                            </label>
                            <select 
                                id="role"
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                                onchange="app.handleRoleChange(this.value)"
                            >
                                <option value="bartender">Bartender</option>
                                <option value="store_officer">Store Officer</option>
                                <option value="manager">Manager</option>
                                <option value="accountant">Accountant</option>
                                <option value="md">Managing Director</option>
                            </select>
                        </div>

                        <div id="barSelection" style="display: block;">
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Assign to Bar</label>
                            <select 
                                id="barId"
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                            >
                                <option value="">Select a Bar</option>
                                <option value="classic">UPI's Classic bar</option>
                                <option value="lounge">UPI's Lounge bar</option>
                                <option value="club">UPI's Club bar</option>
                                <option value="waterfront-main">Waterfront Main bar</option>
                                <option value="waterfront-vip">Waterfront VIP bar</option>
                                <option value="liquor-lounge">UPI's Liqour Lounge</option>
                                <option value="pa-home">UPI's Pa Home</option>
                                <option value="pa-njanji">UPI's Pa Njanji</option>
                            </select>
                        </div>

                        <div id="storeSelection" style="display: none;">
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Assign to Store</label>
                            <select 
                                id="storeId"
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                            >
                                <option value="">Select a Store</option>
                                <option value="1">Main Store</option>
                                <option value="2">Backup Store</option>
                                <option value="3">Emergency Store</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            class="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 mt-4"
                        >
                            Enter System
                        </button>
                    </form>

                    <div class="mt-8 text-center">
                        <p class="text-xs text-slate-400 uppercase tracking-widest font-medium">
                            Demo Version 1.0
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    getNavigationItems() {
        return [
            { id: 'dashboard', name: 'Dashboard', icon: 'layout-dashboard', roles: ['bartender', 'store_officer', 'manager', 'accountant', 'managing_director'], href: 'dashboard' },
            { id: 'sales', name: 'Sales Entry', icon: 'shopping-cart', roles: ['bartender'], href: 'sales' },
            { id: 'stock', name: 'Daily Stock', icon: 'package', roles: ['bartender'], href: 'stock' },
            { id: 'bank-deposits', name: 'Bank Deposits', icon: 'banknote', roles: ['bartender'], href: 'bank-deposits' },
            { id: 'expenses', name: 'Expenses', icon: 'receipt', roles: ['bartender'], href: 'expenses' },
            { id: 'requests', name: 'Restock Requests', icon: 'refresh-cw', roles: ['bartender', 'store_officer', 'manager'], href: 'requests' },
            { id: 'inventory', name: 'Inventory Management', icon: 'archive', roles: ['store_officer'], href: 'inventory' },
            { id: 'stock-receiving', name: 'Stock Receiving', icon: 'package-open', roles: ['store_officer'], href: 'stock-receiving' },
            { id: 'warehouse-management', name: 'Warehouse', icon: 'warehouse', roles: ['store_officer'], href: 'warehouse-management' },
            { id: 'stock-distribution', name: 'Distribution', icon: 'truck', roles: ['store_officer'], href: 'stock-distribution' },
            { id: 'stock-tracking', name: 'Stock Tracking', icon: 'search', roles: ['store_officer', 'manager', 'accountant'], href: 'stock-tracking' },
            { id: 'staff-accountability', name: 'Staff Accountability', icon: 'user-check', roles: ['manager'], href: 'staff-accountability' },
            { id: 'supplier-orders', name: 'Supplier Orders', icon: 'truck', roles: ['manager'], href: 'supplier-orders' },
            { id: 'business-insights', name: 'Business Insights', icon: 'trending-up', roles: ['manager'], href: 'business-insights' },
            { id: 'alerts-logs', name: 'Alerts & Logs', icon: 'alert-triangle', roles: ['manager'], href: 'alerts-logs' },
            { id: 'bar-overview', name: 'Bar Overview', icon: 'eye', roles: ['manager'], href: 'bar-overview' },
            { id: 'staff-management', name: 'Staff Management', icon: 'users', roles: ['manager'], href: 'staff-management' },
            { id: 'performance', name: 'Performance', icon: 'bar-chart', roles: ['manager'], href: 'performance' },
            { id: 'chain-performance', name: 'Chain Performance', icon: 'trending-up', roles: ['managing_director'], href: 'chain-performance' },
            { id: 'weekly-expenses', name: 'Weekly Expenses', icon: 'credit-card', roles: ['managing_director'], href: 'weekly-expenses' },
            { id: 'weekly-deposits', name: 'Weekly Deposits', icon: 'banknote', roles: ['managing_director'], href: 'weekly-deposits' },
            { id: 'trending-products', name: 'Trending Products', icon: 'fire', roles: ['managing_director'], href: 'trending-products' },
            { id: 'supply-reports', name: 'Supply Reports', icon: 'file-text', roles: ['managing_director'], href: 'supply-reports' },
            { id: 'bar-finances', name: 'Bar Finances', icon: 'dollar-sign', roles: ['accountant'], href: 'bar-finances' },
            { id: 'expense-tracking', name: 'Expense Tracking', icon: 'receipt', roles: ['accountant'], href: 'expense-tracking' },
            { id: 'deposit-tracking', name: 'Deposit Tracking', icon: 'banknote', roles: ['accountant'], href: 'deposit-tracking' },
            { id: 'financial-summary', name: 'Financial Summary', icon: 'bar-chart', roles: ['accountant'], href: 'financial-summary' },
            { id: 'reports', name: 'Reports', icon: 'file-text', roles: ['manager', 'accountant', 'managing_director'], href: 'reports' },
            { id: 'finance', name: 'Finance', icon: 'dollar-sign', roles: ['accountant', 'managing_director'], href: 'finance' }
        ];
    }

    renderMainLayout() {
        return `
            <div class="min-h-screen bg-slate-50 flex">
                ${this.renderSidebar()}
                ${this.renderMainContent()}
            </div>
        `;
    }

    renderSidebar() {
        const navigation = this.getNavigationItems();
        const filteredNavigation = navigation.filter(
            (item) => !this.user || item.roles.includes(this.user.role),
        );

        return `
            <aside class="${this.isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 sidebar-transition flex flex-col fixed h-full z-20">
                <div class="h-16 flex items-center px-6 border-b border-slate-100">
                    <div class="bg-violet-600 p-2 rounded-lg">
                        <i data-lucide="layout-dashboard" class="w-5 h-5 text-white"></i>
                    </div>
                    ${this.isSidebarOpen ? '<span class="ml-3 font-semibold text-slate-800">UPIS Chain</span>' : ''}
                </div>

                <nav class="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    ${filteredNavigation.map(item => `
                        <a href="#" data-page="${item.href}" class="flex items-center p-3 rounded-xl transition-all ${
                            this.currentPage === item.href 
                                ? 'bg-violet-50 text-violet-600' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }">
                            <i data-lucide="${item.icon}" class="w-5 h-5 ${this.currentPage === item.href ? 'text-violet-600' : ''}"></i>
                            ${this.isSidebarOpen ? `<span class="ml-3 text-sm font-medium">${item.name}</span>` : ''}
                        </a>
                    `).join('')}
                </nav>

                <div class="p-4 border-t border-slate-100">
                    <div class="flex items-center">
                        <img src="https://picsum.photos/seed/avatar/40/40.jpg" alt="User" class="w-8 h-8 rounded-full">
                        <div class="ml-3">
                            <p class="text-sm font-medium text-slate-800">${this.user.full_name}</p>
                            <p class="text-xs text-slate-500">${this.user.role.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button onclick="app.logout()" class="mt-3 w-full bg-slate-100 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-200 transition-all">
                        Sign Out
                    </button>
                </div>
            </aside>
        `;
    }

    renderMainContent() {
        return `
            <main class="flex-1 sidebar-transition ${this.isSidebarOpen ? 'ml-64' : 'ml-20'}">
                ${this.renderHeader()}
                <div class="p-8">
                    ${this.renderCurrentPage()}
                </div>
            </main>
        `;
    }

    renderHeader() {
        return `
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                <button data-action="toggle-sidebar" class="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <i data-lucide="menu" class="w-5 h-5 text-slate-600"></i>
                </button>
                <div class="flex items-center space-x-4">
                    <button class="p-2 hover:bg-slate-100 rounded-lg transition-all relative">
                        <i data-lucide="bell" class="w-5 h-5 text-slate-600"></i>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </button>
                    <div class="flex items-center space-x-3">
                        <span class="text-sm text-slate-500">Welcome,</span>
                        <span class="text-sm font-medium text-slate-800">${this.user.full_name}</span>
                    </div>
                </div>
            </header>
        `;
    }

    renderCurrentPage() {
        switch (this.currentPage) {
            case 'dashboard':
                return this.renderDashboard();
            case 'inventory':
                return this.renderInventory();
            case 'stock-receiving':
                return this.renderStockReceiving();
            case 'warehouse-management':
                return this.renderWarehouseManagement();
            case 'stock-distribution':
                return this.renderStockDistribution();
            case 'stock-tracking':
                return this.renderStockTracking();
            case 'sales':
                return this.renderSales();
            case 'stock':
                return this.renderStock();
            case 'bank-deposits':
                return this.renderBankDeposits();
            case 'expenses':
                return this.renderExpenses();
            case 'requests':
                return this.renderRestockRequests();
            case 'staff-accountability':
                return this.renderStaffAccountability();
            case 'supplier-orders':
                return this.renderSupplierOrders();
            case 'business-insights':
                return this.renderBusinessInsights();
            case 'alerts-logs':
                return this.renderAlertsLogs();
            case 'bar-overview':
                return this.renderBarOverview();
            case 'staff-management':
                return this.renderStaffManagement();
            case 'performance':
                return this.renderPerformance();
            case 'chain-performance':
                return this.renderChainPerformance();
            case 'weekly-expenses':
                return this.renderWeeklyExpenses();
            case 'weekly-deposits':
                return this.renderWeeklyDeposits();
            case 'trending-products':
                return this.renderTrendingProducts();
            case 'supply-reports':
                return this.renderSupplyReports();
            case 'bar-finances':
                return this.renderBarFinances();
            case 'expense-tracking':
                return this.renderExpenseTracking();
            case 'deposit-tracking':
                return this.renderDepositTracking();
            case 'financial-summary':
                return this.renderFinancialSummary();
            case 'reports':
                return this.renderReports();
            case 'finance':
                return this.renderFinance();
            case 'settings':
                return this.renderSettings();
            default:
                return this.renderDashboard();
        }
    }

    renderDashboard() {
        const stats = [
            { title: "Today's Sales", value: "MK 1,240.00", change: "+12.5%", icon: 'dollar-sign', color: 'bg-emerald-500' },
            { title: 'Pending Requests', value: '8', change: '-2', icon: 'clock', color: 'bg-amber-500' },
            { title: 'Low Stock Items', value: '14', change: '+3', icon: 'alert-circle', color: 'bg-rose-500' },
            { title: 'Total Inventory', value: '4,250', change: '+145', icon: 'package', color: 'bg-blue-500' },
        ];

        return `
            <div class="space-y-8 fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">Welcome back, ${this.user.full_name}</h1>
                        <p class="text-slate-500">
                            Here's what's happening at 
                            ${this.user.role === 'bartender' && this.user.bar_name 
                                ? this.user.bar_name 
                                : this.user.role === 'bartender' 
                                    ? 'your bar' 
                                    : 'your ' + this.user.role.replace('_', ' ') + ' role'
                            } today.
                        </p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-sm font-medium text-slate-500">Current View:</span>
                        <div class="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold text-slate-700">
                            ${this.user.role === 'bartender' && this.user.bar_name 
                                ? this.user.bar_name 
                                : this.user.role === 'bartender' 
                                    ? 'Assigned Bar' 
                                    : 'Full Chain Overview'
                            }
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${stats.map((stat, idx) => `
                        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow fade-in" style="animation-delay: ${idx * 0.1}s">
                            <div class="flex justify-between items-start mb-4">
                                <div class="${stat.color} p-3 rounded-2xl">
                                    <i data-lucide="${stat.icon}" class="w-6 h-6 text-white"></i>
                                </div>
                                <span class="text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                                    ${stat.change}
                                </span>
                            </div>
                            <h3 class="text-slate-500 text-sm font-medium">${stat.title}</h3>
                            <p class="text-2xl font-bold text-slate-800 mt-1">${stat.value}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 class="font-bold text-slate-800">Recent Sales Activity</h2>
                            <button class="text-violet-600 text-sm font-semibold hover:text-violet-700">View All</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="bg-slate-50/50">
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50">
                                    ${this.data.sales.slice(0, 5).map(sale => `
                                        <tr class="hover:bg-slate-50/80 transition-colors">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center mr-3 text-violet-600">
                                                        <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                                                    </div>
                                                    <span class="text-sm font-medium text-slate-700">${sale.item_name}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${sale.quantity}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">MK ${sale.price.toFixed(2)}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">MK ${(sale.quantity * sale.price).toFixed(2)}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 class="font-bold text-slate-800 mb-6">Quick Actions</h2>
                            <div class="grid grid-cols-2 gap-4">
                                <button class="flex flex-col items-center p-4 rounded-2xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-all group hover-scale">
                                    <div class="bg-white p-3 rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-xs font-bold">New Sale</span>
                                </button>
                                <button class="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all group hover-scale">
                                    <div class="bg-white p-3 rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <i data-lucide="package" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-xs font-bold">Restock</span>
                                </button>
                                <button class="flex flex-col items-center p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all group hover-scale">
                                    <div class="bg-white p-3 rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <i data-lucide="clipboard-list" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-xs font-bold">Stock Take</span>
                                </button>
                                <button class="flex flex-col items-center p-4 rounded-2xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all group hover-scale">
                                    <div class="bg-white p-3 rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <i data-lucide="file-text" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-xs font-bold">Reports</span>
                                </button>
                            </div>
                        </div>

                        <div class="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200">
                            <h2 class="text-white font-bold mb-4 flex items-center">
                                <i data-lucide="alert-circle" class="w-5 h-5 text-pink-500 mr-2"></i>
                                Critical Alerts
                            </h2>
                            <div class="space-y-4">
                                <div class="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <div class="w-2 h-2 mt-2 rounded-full bg-pink-500"></div>
                                    <div>
                                        <p class="text-sm font-semibold text-white">Low Stock: Heineken</p>
                                        <p class="text-xs text-slate-400">Only 12 units remaining at Neon Lights Bar.</p>
                                    </div>
                                </div>
                                <div class="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <div class="w-2 h-2 mt-2 rounded-full bg-orange-400"></div>
                                    <div>
                                        <p class="text-sm font-semibold text-white">Missing Daily Report</p>
                                        <p class="text-xs text-slate-400">Whiskey River hasn't submitted sales for yesterday.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderInventory() {
        const inventory = this.data.inventory || [];
        const totalValue = inventory.reduce((sum, item) => sum + ((item.total_quantity || 0) * (item.cost_price || 0)), 0);
        const lowStockCount = inventory.filter(item => (item.total_quantity || 0) <= (item.reorder_level || 0)).length;
        const totalItems = inventory.reduce((sum, item) => sum + (item.total_quantity || 0), 0);

        return `
            <div class="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-emerald-50 p-8">
                <div class="max-w-7xl mx-auto space-y-6 fade-in">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-4xl font-bold gradient-text">Inventory Management</h1>
                            <p class="text-slate-600 mt-2">Track and manage stock levels across all stores</p>
                        </div>
                        <button class="px-6 py-3 gradient-bg text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2 hover-scale">
                            <i data-lucide="download" class="w-5 h-5"></i>
                            Export Report
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-600 text-sm font-medium">Total Inventory Value</p>
                                    <p class="text-3xl font-bold text-slate-900 mt-2">MK ${totalValue.toLocaleString()}</p>
                                    <div class="flex items-center gap-1 mt-2 text-emerald-600">
                                        <i data-lucide="trending-up" class="w-4 h-4"></i>
                                        <span class="text-sm">+12% from last month</span>
                                    </div>
                                </div>
                                <div class="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center">
                                    <i data-lucide="package" class="text-violet-600" style="width: 28px; height: 28px;"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-600 text-sm font-medium">Total Items in Stock</p>
                                    <p class="text-3xl font-bold text-slate-900 mt-2">${totalItems.toLocaleString()}</p>
                                    <div class="flex items-center gap-1 mt-2 text-slate-600">
                                        <span class="text-sm">${inventory.length} unique items</span>
                                    </div>
                                </div>
                                <div class="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                                    <i data-lucide="trending-up" class="text-emerald-600" style="width: 28px; height: 28px;"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-600 text-sm font-medium">Low Stock Alerts</p>
                                    <p class="text-3xl font-bold text-slate-900 mt-2">${lowStockCount}</p>
                                    <div class="flex items-center gap-1 mt-2 text-orange-600">
                                        <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                                        <span class="text-sm">Requires attention</span>
                                    </div>
                                </div>
                                <div class="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                                    <i data-lucide="alert-triangle" class="text-orange-600" style="width: 28px; height: 28px;"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gradient-to-r from-violet-50 to-emerald-50">
                                    <tr>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Item Name</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Unit</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Quantity</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Reorder Level</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Cost Price</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Selling Price</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total Value</th>
                                        <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${inventory.map(item => {
                                        const isLowStock = (item.total_quantity || 0) <= (item.reorder_level || 0);
                                        const totalValue = (item.total_quantity || 0) * (item.cost_price || 0);
                                        return `
                                            <tr class="hover:bg-slate-50 transition-colors">
                                                <td class="px-6 py-4 text-sm font-medium text-slate-900">${item.item_name}</td>
                                                <td class="px-6 py-4 text-sm text-slate-600">
                                                    <span class="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">${item.category}</span>
                                                </td>
                                                <td class="px-6 py-4 text-sm text-slate-600">${item.unit}</td>
                                                <td class="px-6 py-4 text-sm font-semibold text-slate-900">${item.total_quantity}</td>
                                                <td class="px-6 py-4 text-sm text-slate-600">${item.reorder_level}</td>
                                                <td class="px-6 py-4 text-sm text-slate-600">MK ${item.cost_price.toFixed(2)}</td>
                                                <td class="px-6 py-4 text-sm text-slate-600">MK ${item.selling_price.toFixed(2)}</td>
                                                <td class="px-6 py-4 text-sm font-semibold text-slate-900">MK ${totalValue.toFixed(2)}</td>
                                                <td class="px-6 py-4 text-sm">
                                                    ${isLowStock ? `
                                                        <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                                            <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                                                            Low Stock
                                                        </span>
                                                    ` : `
                                                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">In Stock</span>
                                                    `}
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSales() {
        const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const content = `
            <div class="space-y-8 fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-800">Sales Entry</h1>
                        <p class="text-slate-500">${today} - ${this.user.bar_name || 'Your Bar'}</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="app.addSaleItem()" class="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 hover-scale">
                            <i data-lucide="plus" class="w-5 h-5 inline mr-2"></i>
                            Add Sale Item
                        </button>
                        <button onclick="app.addDamageItem()" class="bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 hover-scale">
                            <i data-lucide="alert-circle" class="w-5 h-5 inline mr-2"></i>
                            Report Damage
                        </button>
                    </div>
                </div>

                <!-- Sales Entry Section -->
                <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-bold text-slate-800 flex items-center">
                            <i data-lucide="shopping-cart" class="w-6 h-6 mr-3 text-violet-600"></i>
                            Today's Sales
                        </h2>
                        <div class="text-sm text-slate-500">
                            Total Sales: <span class="font-bold text-violet-600">MWK <span id="totalSales">0</span></span>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Drink Name</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Bottles Sold</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Unit Price</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="salesTableBody">
                                <!-- Sales items will be added here -->
                            </tbody>
                        </table>
                        <div id="emptySalesMessage" class="text-center py-12 text-slate-400">
                            <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-4 text-slate-300"></i>
                            <p>No sales recorded yet. Click "Add Sale Item" to start.</p>
                        </div>
                    </div>
                </div>

                <!-- Damage Report Section -->
                <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-bold text-slate-800 flex items-center">
                            <i data-lucide="alert-triangle" class="w-6 h-6 mr-3 text-rose-600"></i>
                            Damage Reports
                        </h2>
                        <div class="text-sm text-slate-500">
                            Total Loss: <span class="font-bold text-rose-600">MWK <span id="totalDamage">0</span></span>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Drink Name</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Bottles Damaged</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Unit Cost</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Loss</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Reason</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="damageTableBody">
                                <!-- Damage items will be added here -->
                            </tbody>
                        </table>
                        <div id="emptyDamageMessage" class="text-center py-12 text-slate-400">
                            <i data-lucide="shield-check" class="w-12 h-12 mx-auto mb-4 text-slate-300"></i>
                            <p>No damage reports yet. Click "Report Damage" to add.</p>
                        </div>
                    </div>
                </div>

                <!-- Summary Section -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-3xl text-white">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="trending-up" class="w-8 h-8"></i>
                            <span class="text-2xl font-bold">MWK <span id="totalSalesDisplay">0</span></span>
                        </div>
                        <h3 class="font-semibold">Total Sales</h3>
                        <p class="text-violet-100 text-sm">Today's revenue</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-3xl text-white">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="alert-triangle" class="w-8 h-8"></i>
                            <span class="text-2xl font-bold">MWK <span id="totalDamageDisplay">0</span></span>
                        </div>
                        <h3 class="font-semibold">Total Loss</h3>
                        <p class="text-rose-100 text-sm">Damage costs</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white">
                        <div class="flex items-center justify-between mb-4">
                            <i data-lucide="calculator" class="w-8 h-8"></i>
                            <span class="text-2xl font-bold">MWK <span id="netRevenueDisplay">0</span></span>
                        </div>
                        <h3 class="font-semibold">Net Revenue</h3>
                        <p class="text-emerald-100 text-sm">After losses</p>
                    </div>
                </div>
            </div>
        `;

        // Load the content first, then display data
        setTimeout(() => {
            this.displaySales();
            this.displayDamages();
            this.updateTotals();
        }, 100);

        return content;
    }

    renderStock() {
        const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Get stock for all bars
        const allBarsStock = this.getAllBarsStock();
        
        // Calculate overall statistics
        const totalItems = allBarsStock.reduce((sum, bar) => sum + bar.stock.length, 0);
        const totalLowStock = allBarsStock.reduce((sum, bar) => sum + bar.lowStockCount, 0);
        const totalOutOfStock = allBarsStock.reduce((sum, bar) => sum + bar.outOfStockCount, 0);
        const totalValue = allBarsStock.reduce((sum, bar) => sum + bar.totalValue, 0);

        return `
            <div class="space-y-8 fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-800">All Bars Stock</h1>
                        <p class="text-slate-500">${today} - Complete Inventory Overview</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="app.refreshStock()" class="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 hover-scale">
                            <i data-lucide="refresh-cw" class="w-5 h-5 inline mr-2"></i>
                            Refresh Stock
                        </button>
                        <button onclick="app.editPrices()" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover-scale">
                            <i data-lucide="edit" class="w-5 h-5 inline mr-2"></i>
                            Edit Prices
                        </button>
                    </div>
                </div>

                <!-- Overall Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-violet-100 p-3 rounded-xl">
                                <i data-lucide="package" class="w-6 h-6 text-violet-600"></i>
                            </div>
                            <span class="text-sm text-violet-600 font-semibold">Total Items</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${totalItems}</h3>
                        <p class="text-sm text-slate-600 mt-1">Across all bars</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="alert-triangle" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Low Stock</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${totalLowStock}</h3>
                        <p class="text-sm text-slate-600 mt-1">Items need restocking</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-rose-100 p-3 rounded-xl">
                                <i data-lucide="x-circle" class="w-6 h-6 text-rose-600"></i>
                            </div>
                            <span class="text-sm text-rose-600 font-semibold">Out of Stock</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${totalOutOfStock}</h3>
                        <p class="text-sm text-slate-600 mt-1">Items unavailable</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="dollar-sign" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">Total Value</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalValue.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Across all bars</p>
                    </div>
                </div>

                <!-- Individual Bar Stock Lists -->
                <div class="space-y-6">
                    ${allBarsStock.map(bar => `
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div class="flex items-center justify-between mb-6">
                                <div>
                                    <h2 class="text-xl font-bold text-slate-800 flex items-center">
                                        <i data-lucide="map-pin" class="w-6 h-6 mr-3 text-violet-600"></i>
                                        ${bar.name}
                                    </h2>
                                    <div class="flex gap-2 mt-2">
                                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                                            bar.outOfStockCount > 0 ? 'bg-rose-100 text-rose-700' :
                                            bar.lowStockCount > 0 ? 'bg-amber-100 text-amber-700' :
                                            'bg-emerald-100 text-emerald-700'
                                        }">
                                            ${bar.outOfStockCount > 0 ? 'Out of Stock' :
                                             bar.lowStockCount > 0 ? 'Low Stock' : 'Good Stock'}
                                        </span>
                                        <span class="text-sm text-slate-600">${bar.stock.length} items</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm text-slate-600 mb-2">
                                        <div>Low Stock: <span class="font-bold text-amber-600">${bar.lowStockCount}</span></div>
                                        <div>Out of Stock: <span class="font-bold text-rose-600">${bar.outOfStockCount}</span></div>
                                        <div>Total Value: <span class="font-bold text-emerald-600">MWK ${bar.totalValue.toLocaleString()}</span></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Stock Table -->
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Item</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Quantity</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Min Stock</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${bar.stock.map(item => `
                                            <tr class="border-b border-slate-100 hover:bg-slate-50">
                                                <td class="py-3 px-4 font-medium text-slate-800">${item.name}</td>
                                                <td class="py-3 px-4 text-slate-600">
                                                    <span class="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">${item.category}</span>
                                                </td>
                                                <td class="py-3 px-4 text-center font-semibold">${item.quantity}</td>
                                                <td class="py-3 px-4 text-center">${item.minStock}</td>
                                                <td class="py-3 px-4 text-center">
                                                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                                                        item.quantity === 0 ? 'bg-rose-100 text-rose-700' :
                                                        item.quantity <= item.minStock ? 'bg-amber-100 text-amber-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                                    }">
                                                        ${item.quantity === 0 ? 'Out' : 
                                                         item.quantity <= item.minStock ? 'Low' : 'Good'}
                                                    </span>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getAllBarsStock() {
        const bars = [
            { id: 'classic', name: "UPI's Classic" },
            { id: 'lounge', name: "UPI's Lounge" },
            { id: 'club', name: "UPI's Club" },
            { id: 'waterfront-main', name: 'Waterfront Main' },
            { id: 'waterfront-vip', name: 'Waterfront VIP' },
            { id: 'liquor-lounge', name: 'Liquor Lounge' }
        ];

        return bars.map(bar => {
            // Get stock for this specific bar
            const barStockKey = `upis_stock_${bar.id}`;
            const savedStock = localStorage.getItem(barStockKey);
            const stock = savedStock ? JSON.parse(savedStock) : this.data.stock;
            
            const lowStockItems = stock.filter(item => item.quantity <= item.minStock);
            const outOfStockItems = stock.filter(item => item.quantity === 0);
            const totalValue = stock.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            
            return {
                ...bar,
                stock,
                lowStockCount: lowStockItems.length,
                outOfStockCount: outOfStockItems.length,
                totalValue
            };
        });
    }

    renderBankDeposits() {
        const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayDeposits = deposits.filter(deposit => {
            const depositDate = new Date(deposit.timestamp);
            depositDate.setHours(0, 0, 0, 0);
            return depositDate.getTime() === today.getTime() && (deposit.barId === this.user.bar_id || (!deposit.barId && this.user.role === 'bartender'));
        });

        const totalTodayDeposits = todayDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

        return `
            <div class="space-y-8 fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-800">Bank Deposits</h1>
                        <p class="text-slate-600">Today's deposits - ${this.user.bar_name || 'Your Bar'}</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="app.addDeposit()" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover-scale">
                            <i data-lucide="plus-circle" class="w-5 h-5 inline mr-2"></i>
                            Add Deposit
                        </button>
                        <button onclick="app.refreshDeposits()" class="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 hover-scale">
                            <i data-lucide="refresh-cw" class="w-5 h-5 inline mr-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="banknote" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">Today</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalTodayDeposits.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Total Deposited</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Transactions</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${todayDeposits.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Deposit Entries</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="calculator" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Average</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${todayDeposits.length > 0 ? Math.round(totalTodayDeposits / todayDeposits.length).toLocaleString() : '0'}</h3>
                        <p class="text-sm text-slate-600 mt-1">Per Transaction</p>
                    </div>
                </div>

                <!-- Today's Deposits -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Today's Deposit Records</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Time</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Notes</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Photo</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${todayDeposits.length === 0 ? `
                                    <tr>
                                        <td colspan="5" class="text-center py-12 text-slate-400">
                                            <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-4 text-slate-300"></i>
                                            <p>No deposits recorded today. Click "Add Deposit" to get started.</p>
                                        </td>
                                    </tr>
                                ` : todayDeposits.map(deposit => `
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="py-3 px-4 text-slate-600">${new Date(deposit.timestamp).toLocaleTimeString()}</td>
                                        <td class="py-3 px-4 font-bold text-emerald-600">MWK ${deposit.amount.toLocaleString()}</td>
                                        <td class="py-3 px-4 text-slate-600">${deposit.notes || '-'}</td>
                                        <td class="py-3 px-4 text-center">
                                            ${deposit.photo ? `
                                                <img src="${deposit.photo}" class="w-12 h-12 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" alt="Deposit evidence" onclick="app.viewDepositPhoto('${deposit.photo}')">
                                            ` : '<span class="text-slate-400">No photo</span>'}
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            <button onclick="app.removeDeposit(${deposit.id})" class="text-rose-500 hover:text-rose-700 font-medium text-sm">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderExpenses() {
        const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.timestamp);
            expenseDate.setHours(0, 0, 0, 0);
            return expenseDate.getTime() === today.getTime() && (expense.barId === this.user.bar_id || (!expense.barId && this.user.role === 'bartender'));
        });

        const totalTodayExpenses = todayExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

        return `
            <div class="space-y-8 fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-800">Expenses</h1>
                        <p class="text-slate-600">Today's expenses - ${this.user.bar_name || 'Your Bar'}</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="app.addExpense()" class="bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 hover-scale">
                            <i data-lucide="plus-circle" class="w-5 h-5 inline mr-2"></i>
                            Add Expense
                        </button>
                        <button onclick="app.refreshExpenses()" class="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 hover-scale">
                            <i data-lucide="refresh-cw" class="w-5 h-5 inline mr-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-rose-100 p-3 rounded-xl">
                                <i data-lucide="credit-card" class="w-6 h-6 text-rose-600"></i>
                            </div>
                            <span class="text-sm text-rose-600 font-semibold">Today</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalTodayExpenses.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Total Expenses</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Transactions</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${todayExpenses.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Expense Entries</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="calculator" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Average</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${todayExpenses.length > 0 ? Math.round(totalTodayExpenses / todayExpenses.length).toLocaleString() : '0'}</h3>
                        <p class="text-sm text-slate-600 mt-1">Per Transaction</p>
                    </div>
                </div>

                <!-- Today's Expenses -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Today's Expense Records</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Time</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${todayExpenses.length === 0 ? `
                                    <tr>
                                        <td colspan="5" class="text-center py-12 text-slate-400">
                                            <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-4 text-slate-300"></i>
                                            <p>No expenses recorded today. Click "Add Expense" to get started.</p>
                                        </td>
                                    </tr>
                                ` : todayExpenses.map(expense => `
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="py-3 px-4 text-slate-600">${new Date(expense.timestamp).toLocaleTimeString()}</td>
                                        <td class="py-3 px-4 text-slate-600">
                                            <span class="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">${expense.category}</span>
                                        </td>
                                        <td class="py-3 px-4 text-slate-600">${expense.description}</td>
                                        <td class="py-3 px-4 font-bold text-rose-600">MWK ${expense.amount.toLocaleString()}</td>
                                        <td class="py-3 px-4 text-center">
                                            <button onclick="app.removeExpense(${expense.id})" class="text-rose-500 hover:text-rose-700 font-medium text-sm">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderReports() {
        return `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-slate-800 mb-6">Reports</h1>
                <div class="bg-white rounded-3xl p-8 shadow-lg">
                    <p class="text-slate-600">Reports and analytics functionality would be implemented here.</p>
                </div>
            </div>
        `;
    }

    renderRestockRequests() {
        const currentStock = this.getCurrentBarStock();
        const lowStockItems = currentStock.filter(item => item.quantity <= item.minStock);
        const allRequests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');
        const barRequests = this.user.bar_id 
            ? allRequests.filter(req => req.barId === this.user.bar_id)
            : allRequests;

        const stores = [
            { id: 1, name: 'Main Store - Blantyre' },
            { id: 2, name: 'Main Store - Lilongwe' },
            { id: 3, name: 'Central Warehouse' }
        ];

        if (this.user.role === 'bartender') {
            // Bartender view - see low stock and create requests
            return `
                <div class="space-y-8 fade-in">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-slate-800">Restock Requests</h1>
                            <p class="text-slate-600 mt-2">Manage inventory restocking for ${this.user.bar_name || 'your bar'}</p>
                        </div>
                        <button onclick="app.createRestockRequest()" class="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center">
                            <i data-lucide="plus-circle" class="w-5 h-5 mr-2"></i>
                            New Request
                        </button>
                    </div>

                    <!-- Low Stock Alert -->
                    <div class="bg-amber-50 border border-amber-200 rounded-3xl p-6">
                        <div class="flex items-center mb-4">
                            <i data-lucide="alert-triangle" class="w-6 h-6 text-amber-600 mr-3"></i>
                            <h2 class="text-xl font-bold text-amber-800">Low Stock Items</h2>
                            <span class="ml-auto bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">${lowStockItems.length}</span>
                        </div>
                        <p class="text-amber-700 mb-4">These items need immediate restocking:</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${lowStockItems.map(item => `
                                <div class="bg-white rounded-xl p-4 border border-amber-200">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="font-semibold text-slate-800">${item.name}</h3>
                                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                                            item.quantity === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                        }">
                                            ${item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                                        </span>
                                    </div>
                                    <p class="text-sm text-slate-600">Current: ${item.quantity} ${item.unit}</p>
                                    <p class="text-sm text-slate-600">Minimum: ${item.minStock} ${item.unit}</p>
                                    <p class="text-sm font-semibold text-violet-600">MWK ${item.price}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Previous Requests -->
                    <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <i data-lucide="clock" class="w-6 h-6 mr-3 text-violet-600"></i>
                            Your Restock Requests
                        </h2>
                        ${barRequests.length === 0 ? `
                            <div class="text-center py-12">
                                <i data-lucide="package" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                                <p class="text-slate-500">No restock requests yet. Click "New Request" to create one.</p>
                            </div>
                        ` : `
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="border-b border-slate-200">
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Request ID</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Items</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Store</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${barRequests.map(request => `
                                            <tr class="border-b border-slate-100 hover:bg-slate-50">
                                                <td class="py-3 px-4 font-medium text-slate-800">#${request.id}</td>
                                                <td class="py-3 px-4 text-slate-600">${request.items.length} items</td>
                                                <td class="py-3 px-4 text-center">${request.storeName}</td>
                                                <td class="py-3 px-4 text-center">
                                                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                                                        request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        request.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                        request.status === 'forwarded' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }">
                                                        ${request.status}
                                                    </span>
                                                </td>
                                                <td class="py-3 px-4 text-sm text-slate-600">${new Date(request.timestamp).toLocaleDateString()}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            `;
        } else if (this.user.role === 'store_officer') {
            // Store officer view - process requests from bartenders
            const pendingRequests = allRequests.filter(req => req.status === 'pending');
            
            return `
                <div class="space-y-8 fade-in">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-slate-800">Restock Requests</h1>
                            <p class="text-slate-600 mt-2">Process restock requests from all bars</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-semibold">
                                ${pendingRequests.length} Pending
                            </span>
                        </div>
                    </div>

                    <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <i data-lucide="users" class="w-6 h-6 mr-3 text-violet-600"></i>
                            Requests from Bars
                        </h2>
                        ${allRequests.length === 0 ? `
                            <div class="text-center py-12">
                                <i data-lucide="inbox" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                                <p class="text-slate-500">No restock requests received yet.</p>
                            </div>
                        ` : `
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="border-b border-slate-200">
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Request ID</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Items</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${allRequests.map(request => `
                                            <tr class="border-b border-slate-100 hover:bg-slate-50">
                                                <td class="py-3 px-4 font-medium text-slate-800">#${request.id}</td>
                                                <td class="py-3 px-4 text-slate-600">${request.barName}</td>
                                                <td class="py-3 px-4 text-slate-600">${request.items.length} items</td>
                                                <td class="py-3 px-4 text-center">
                                                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                                                        request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        request.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                        request.status === 'forwarded' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }">
                                                        ${request.status}
                                                    </span>
                                                </td>
                                                <td class="py-3 px-4 text-sm text-slate-600">${new Date(request.timestamp).toLocaleDateString()}</td>
                                                <td class="py-3 px-4 text-center">
                                                    ${request.status === 'pending' ? `
                                                        <div class="flex gap-2 justify-center">
                                                            <button onclick="app.forwardToManager(${request.id})" class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                                                                Forward to Manager
                                                            </button>
                                                            <button onclick="app.viewRequestDetails(${request.id})" class="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm hover:bg-slate-300">
                                                                View
                                                            </button>
                                                        </div>
                                                    ` : `
                                                        <button onclick="app.viewRequestDetails(${request.id})" class="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm hover:bg-slate-300">
                                                            View
                                                        </button>
                                                    `}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            `;
        } else if (this.user.role === 'manager') {
            // Manager view - approve/reject requests
            const pendingRequests = allRequests.filter(req => req.status === 'forwarded');
            
            return `
                <div class="space-y-8 fade-in">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-slate-800">Restock Requests</h1>
                            <p class="text-slate-600 mt-2">Approve or reject restock requests</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                                ${pendingRequests.length} Awaiting Approval
                            </span>
                        </div>
                    </div>

                    <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <i data-lucide="check-circle" class="w-6 h-6 mr-3 text-violet-600"></i>
                            Pending Approvals
                        </h2>
                        ${allRequests.length === 0 ? `
                            <div class="text-center py-12">
                                <i data-lucide="clipboard" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                                <p class="text-slate-500">No requests awaiting approval.</p>
                            </div>
                        ` : `
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="border-b border-slate-200">
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Request ID</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Store</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Items</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                                            <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${allRequests.map(request => `
                                            <tr class="border-b border-slate-100 hover:bg-slate-50">
                                                <td class="py-3 px-4 font-medium text-slate-800">#${request.id}</td>
                                                <td class="py-3 px-4 text-slate-600">${request.barName}</td>
                                                <td class="py-3 px-4 text-slate-600">${request.storeName}</td>
                                                <td class="py-3 px-4 text-slate-600">${request.items.length} items</td>
                                                <td class="py-3 px-4 text-center">
                                                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                                                        request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        request.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                        request.status === 'forwarded' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }">
                                                        ${request.status}
                                                    </span>
                                                </td>
                                                <td class="py-3 px-4 text-sm text-slate-600">${new Date(request.timestamp).toLocaleDateString()}</td>
                                                <td class="py-3 px-4 text-center">
                                                    ${request.status === 'forwarded' ? `
                                                        <div class="flex gap-2 justify-center">
                                                            <button onclick="app.approveRequest(${request.id})" class="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-700">
                                                                Approve
                                                            </button>
                                                            <button onclick="app.rejectRequest(${request.id})" class="bg-rose-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-rose-700">
                                                                Reject
                                                            </button>
                                                            <button onclick="app.viewRequestDetails(${request.id})" class="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm hover:bg-slate-300">
                                                                View
                                                            </button>
                                                        </div>
                                                    ` : `
                                                        <button onclick="app.viewRequestDetails(${request.id})" class="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm hover:bg-slate-300">
                                                            View
                                                        </button>
                                                    `}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            `;
        }
    }

    handleRoleChange(role) {
        console.log('Role changed to:', role);
        const barSelection = document.getElementById('barSelection');
        const storeSelection = document.getElementById('storeSelection');
        const barId = document.getElementById('barId');
        const storeId = document.getElementById('storeId');
        
        // Reset selections
        if (barId) barId.required = false;
        if (storeId) storeId.required = false;
        
        // Show/hide relevant selections
        if (role === 'bartender') {
            barSelection.style.display = 'block';
            storeSelection.style.display = 'none';
            if (barId) barId.required = true;
            console.log('Showing bar selection for bartender');
        } else if (role === 'store_officer') {
            barSelection.style.display = 'none';
            storeSelection.style.display = 'block';
            if (storeId) storeId.required = true;
            console.log('Showing store selection for store officer');
        } else if (role === 'managing_director') {
            barSelection.style.display = 'none';
            storeSelection.style.display = 'none';
            console.log('Hiding both selections for managing director');
        } else {
            barSelection.style.display = 'none';
            storeSelection.style.display = 'none';
            console.log('Hiding both selections for role:', role);
        }
        
        this.loadLucideIcons();
    }

    handleLogin(event) {
        event.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const role = document.getElementById('role').value;
        const barId = document.getElementById('barId')?.value || null;
        const storeId = document.getElementById('storeId')?.value || null;
        
        // Get bar name from selection
        const barNames = {
            'classic': "UPI's Classic bar",
            'lounge': "UPI's Lounge bar", 
            'club': "UPI's Club bar",
            'waterfront-main': 'Waterfront Main bar',
            'waterfront-vip': 'Waterfront VIP bar',
            'liquor-lounge': "UPI's Liqour Lounge",
            'pa-home': "UPI's Pa Home",
            'pa-njanji': "UPI's Pa Njanji"
        };
        
        this.user = {
            id: 'mock-id-' + Math.random().toString(36).substr(2, 9),
            full_name: fullName || role.charAt(0).toUpperCase() + role.slice(1),
            role,
            bar_id: barId,
            bar_name: barId ? barNames[barId] : null,
            store_id: role === 'store_officer' ? storeId : null,
        };
        
        localStorage.setItem('upis_user', JSON.stringify(this.user));
        this.navigateToPage('dashboard');
    }

    // Sales and Damage Management Functions
    addSaleItem() {
        const currentStock = this.getCurrentBarStock();
        const availableDrinks = currentStock.filter(item => item.quantity > 0);
        
        const drinkOptions = availableDrinks.map(drink => 
            `<option value="${drink.id}|${drink.name}|${drink.category}|${drink.price}">${drink.name} (${drink.category}) - MWK ${drink.price} (Stock: ${drink.quantity})</option>`
        ).join('');

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 fade-in">
                <h3 class="text-xl font-bold text-slate-800 mb-6">Add Sale Item</h3>
                <form onsubmit="app.saveSaleItem(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Select Drink</label>
                            <select id="drinkSelect" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                                <option value="">Choose a drink...</option>
                                ${drinkOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Bottles Sold</label>
                            <input type="number" id="bottlesSold" min="1" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="Enter number of bottles">
                            <p id="stockWarning" class="text-xs text-amber-600 mt-1 hidden"></p>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button type="submit" class="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all">
                            Add Sale
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add stock validation
        const drinkSelect = document.getElementById('drinkSelect');
        const bottlesSoldInput = document.getElementById('bottlesSold');
        const stockWarning = document.getElementById('stockWarning');
        
        drinkSelect.addEventListener('change', function() {
            if (this.value) {
                const [itemId, name, category, price] = this.value.split('|');
                const stockItem = currentStock.find(item => item.id == itemId);
                if (stockItem) {
                    bottlesSoldInput.max = stockItem.quantity;
                    stockWarning.textContent = `Maximum available: ${stockItem.quantity} bottles`;
                    stockWarning.classList.remove('hidden');
                }
            }
        });
        
        this.loadLucideIcons();
    }

    saveSaleItem(event) {
        event.preventDefault();
        
        const drinkSelect = document.getElementById('drinkSelect').value;
        const [itemId, name, category, price] = drinkSelect.split('|');
        const bottlesSold = parseInt(document.getElementById('bottlesSold').value);
        const total = price * bottlesSold;
        
        // Validate stock availability
        const currentStock = this.getCurrentBarStock();
        const stockItem = currentStock.find(item => item.id == itemId);
        
        if (!stockItem || stockItem.quantity < bottlesSold) {
            alert('Insufficient stock available! Only ' + (stockItem ? stockItem.quantity : 0) + ' bottles available.');
            return;
        }
        
        const saleItem = {
            id: Date.now(),
            itemId: parseInt(itemId),
            name,
            category,
            price: parseInt(price),
            bottlesSold,
            total,
            timestamp: new Date().toISOString(),
            barId: this.user.bar_id,
            barName: this.user.bar_name
        };
        
        // Get existing sales or create new array
        let sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        sales.push(saleItem);
        localStorage.setItem('upis_sales', JSON.stringify(sales));
        
        // Update stock levels
        this.updateStockAfterSale(parseInt(itemId), bottlesSold);
        
        // Close modal
        document.querySelector('.fixed').remove();
        
        // Refresh sales display and stock
        this.displaySales();
        this.updateTotals();
        
        // Show success message
        this.showNotification('Sale recorded successfully!', 'success');
    }

    addDamageItem() {
        const currentStock = this.getCurrentBarStock();
        const availableDrinks = currentStock.filter(item => item.quantity > 0);
        
        const drinkOptions = availableDrinks.map(drink => 
            `<option value="${drink.id}|${drink.name}|${drink.category}|${drink.price}">${drink.name} (${drink.category}) - MWK ${drink.price} (Stock: ${drink.quantity})</option>`
        ).join('');

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 fade-in">
                <h3 class="text-xl font-bold text-slate-800 mb-6">Report Damage</h3>
                <form onsubmit="app.saveDamageItem(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Select Drink</label>
                            <select id="damageDrinkSelect" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none">
                                <option value="">Choose a drink...</option>
                                ${drinkOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Bottles Damaged</label>
                            <input type="number" id="bottlesDamaged" min="1" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" placeholder="Enter number of bottles">
                            <p id="damageStockWarning" class="text-xs text-amber-600 mt-1 hidden"></p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Reason for Damage</label>
                            <select id="damageReason" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none">
                                <option value="">Select reason...</option>
                                <option value="Broken during handling">Broken during handling</option>
                                <option value="Expired">Expired</option>
                                <option value="Customer complaint">Customer complaint</option>
                                <option value="Spoiled/Contaminated">Spoiled/Contaminated</option>
                                <option value="Theft">Theft</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button type="submit" class="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-all">
                            Report Damage
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add stock validation
        const drinkSelect = document.getElementById('damageDrinkSelect');
        const bottlesDamagedInput = document.getElementById('bottlesDamaged');
        const stockWarning = document.getElementById('damageStockWarning');
        
        drinkSelect.addEventListener('change', function() {
            if (this.value) {
                const [itemId, name, category, price] = this.value.split('|');
                const stockItem = currentStock.find(item => item.id == itemId);
                if (stockItem) {
                    bottlesDamagedInput.max = stockItem.quantity;
                    stockWarning.textContent = `Maximum available: ${stockItem.quantity} bottles`;
                    stockWarning.classList.remove('hidden');
                }
            }
        });
        
        this.loadLucideIcons();
    }

    saveDamageItem(event) {
        event.preventDefault();
        
        const drinkSelect = document.getElementById('damageDrinkSelect').value;
        const [itemId, name, category, price] = drinkSelect.split('|');
        const bottlesDamaged = parseInt(document.getElementById('bottlesDamaged').value);
        const reason = document.getElementById('damageReason').value;
        const totalLoss = price * bottlesDamaged;
        
        // Validate stock availability
        const currentStock = this.getCurrentBarStock();
        const stockItem = currentStock.find(item => item.id == itemId);
        
        if (!stockItem || stockItem.quantity < bottlesDamaged) {
            alert('Insufficient stock available! Only ' + (stockItem ? stockItem.quantity : 0) + ' bottles available.');
            return;
        }
        
        const damageItem = {
            id: Date.now(),
            itemId: parseInt(itemId),
            name,
            category,
            cost: parseInt(price),
            bottlesDamaged,
            reason,
            totalLoss,
            timestamp: new Date().toISOString(),
            barId: this.user.bar_id,
            barName: this.user.bar_name
        };
        
        // Get existing damage reports or create new array
        let damages = JSON.parse(localStorage.getItem('upis_damages') || '[]');
        damages.push(damageItem);
        localStorage.setItem('upis_damages', JSON.stringify(damages));
        
        // Update stock levels
        this.updateStockAfterDamage(parseInt(itemId), bottlesDamaged);
        
        // Close modal
        document.querySelector('.fixed').remove();
        
        // Refresh damage display and stock
        this.displayDamages();
        this.updateTotals();
        
        // Show success message
        this.showNotification('Damage reported successfully!', 'warning');
    }

    displaySales() {
        // Get sales for current bar only
        const allSales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        const sales = this.user.bar_id 
            ? allSales.filter(sale => sale.barId === this.user.bar_id)
            : allSales;
            
        const tbody = document.getElementById('salesTableBody');
        const emptyMessage = document.getElementById('emptySalesMessage');
        
        if (sales.length === 0) {
            tbody.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        tbody.innerHTML = sales.map(sale => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="py-3 px-4 font-medium text-slate-800">${sale.name}</td>
                <td class="py-3 px-4 text-slate-600">${sale.category}</td>
                <td class="py-3 px-4 text-center font-semibold">${sale.bottlesSold}</td>
                <td class="py-3 px-4 text-center">MWK ${sale.price}</td>
                <td class="py-3 px-4 text-center font-bold text-violet-600">MWK ${sale.total}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="app.removeSaleItem(${sale.id})" class="text-rose-500 hover:text-rose-700 font-medium text-sm">
                        Remove
                    </button>
                </td>
            </tr>
        `).join('');
        
        this.loadLucideIcons();
    }

    displayDamages() {
        // Get damages for current bar only
        const allDamages = JSON.parse(localStorage.getItem('upis_damages') || '[]');
        const damages = this.user.bar_id 
            ? allDamages.filter(damage => damage.barId === this.user.bar_id)
            : allDamages;
            
        const tbody = document.getElementById('damageTableBody');
        const emptyMessage = document.getElementById('emptyDamageMessage');
        
        if (damages.length === 0) {
            tbody.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        tbody.innerHTML = damages.map(damage => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="py-3 px-4 font-medium text-slate-800">${damage.name}</td>
                <td class="py-3 px-4 text-slate-600">${damage.category}</td>
                <td class="py-3 px-4 text-center font-semibold">${damage.bottlesDamaged}</td>
                <td class="py-3 px-4 text-center">MWK ${damage.cost}</td>
                <td class="py-3 px-4 text-center font-bold text-rose-600">MWK ${damage.totalLoss}</td>
                <td class="py-3 px-4 text-sm text-slate-600">${damage.reason}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="app.removeDamageItem(${damage.id})" class="text-rose-500 hover:text-rose-700 font-medium text-sm">
                        Remove
                    </button>
                </td>
            </tr>
        `).join('');
        
        this.loadLucideIcons();
    }

    removeSaleItem(id) {
        let sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        sales = sales.filter(sale => sale.id !== id);
        localStorage.setItem('upis_sales', JSON.stringify(sales));
        this.displaySales();
        this.updateTotals();
    }

    removeDamageItem(id) {
        let damages = JSON.parse(localStorage.getItem('upis_damages') || '[]');
        damages = damages.filter(damage => damage.id !== id);
        localStorage.setItem('upis_damages', JSON.stringify(damages));
        this.displayDamages();
        this.updateTotals();
    }

    updateTotals() {
        // Get sales and damages for current bar only
        const allSales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        const allDamages = JSON.parse(localStorage.getItem('upis_damages') || '[]');
        
        const sales = this.user.bar_id 
            ? allSales.filter(sale => sale.barId === this.user.bar_id)
            : allSales;
        const damages = this.user.bar_id 
            ? allDamages.filter(damage => damage.barId === this.user.bar_id)
            : allDamages;
        
        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalDamage = damages.reduce((sum, damage) => sum + damage.totalLoss, 0);
        const netRevenue = totalSales - totalDamage;
        
        // Update all display elements
        const elements = {
            totalSales: totalSales,
            totalDamage: totalDamage,
            totalSalesDisplay: totalSales,
            totalDamageDisplay: totalDamage,
            netRevenueDisplay: netRevenue
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value.toLocaleString();
            }
        });
    }

    // Stock Management Functions
    getCurrentBarStock() {
        // Get stock for current user's bar specifically
        const barId = this.user.bar_id;
        if (!barId) {
            // If no bar ID, return all stock (for managing director)
            const savedStock = localStorage.getItem('upis_stock');
            return savedStock ? JSON.parse(savedStock) : this.data.stock;
        }
        
        // For bartenders, managers, accountants - get their specific bar's stock
        const barStockKey = `upis_stock_${barId}`;
        const savedBarStock = localStorage.getItem(barStockKey);
        if (savedBarStock) {
            return JSON.parse(savedBarStock);
        }
        
        // If no bar-specific stock exists, use main stock as fallback
        const savedStock = localStorage.getItem('upis_stock');
        const mainStock = savedStock ? JSON.parse(savedStock) : this.data.stock;
        
        // Save this as the bar's stock for future use
        localStorage.setItem(barStockKey, JSON.stringify(mainStock));
        return mainStock;
    }

    renderStockRow(item) {
        const stockStatus = this.getStockStatus(item.quantity, item.minStock);
        const totalValue = item.quantity * item.price;
        
        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="py-3 px-4 font-medium text-slate-800">${item.name}</td>
                <td class="py-3 px-4 text-slate-600">${item.category}</td>
                <td class="py-3 px-4 text-center font-semibold ${item.quantity <= item.minStock ? 'text-amber-600' : item.quantity === 0 ? 'text-rose-600' : 'text-emerald-600'}">${item.quantity} ${item.unit}</td>
                <td class="py-3 px-4 text-center">${item.minStock} ${item.unit}</td>
                <td class="py-3 px-4 text-center">MWK ${item.price}</td>
                <td class="py-3 px-4 text-center font-bold">MWK ${totalValue.toLocaleString()}</td>
                <td class="py-3 px-4 text-sm text-slate-600">${item.expiryDate}</td>
                <td class="py-3 px-4 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.class}">
                        ${stockStatus.text}
                    </span>
                </td>
            </tr>
        `;
    }

    getStockStatus(quantity, minStock) {
        if (quantity === 0) {
            return { text: 'Out of Stock', class: 'bg-rose-100 text-rose-700' };
        } else if (quantity <= minStock) {
            return { text: 'Low Stock', class: 'bg-amber-100 text-amber-700' };
        } else {
            return { text: 'In Stock', class: 'bg-emerald-100 text-emerald-700' };
        }
    }

    updateStockAfterSale(itemId, quantitySold) {
        const barId = this.user.bar_id;
        if (!barId) return;
        
        // Get current stock from bar-specific localStorage
        const barStockKey = `upis_stock_${barId}`;
        const savedStock = localStorage.getItem(barStockKey);
        const currentStock = savedStock ? JSON.parse(savedStock) : this.data.stock;
        const item = currentStock.find(item => item.id === itemId);
        
        if (item) {
            item.quantity = Math.max(0, item.quantity - quantitySold);
            // Save updated stock back to bar-specific localStorage
            localStorage.setItem(barStockKey, JSON.stringify(currentStock));
        }
    }

    updateStockAfterDamage(itemId, quantityDamaged) {
        const barId = this.user.bar_id;
        if (!barId) return;
        
        // Get current stock from bar-specific localStorage
        const barStockKey = `upis_stock_${barId}`;
        const savedStock = localStorage.getItem(barStockKey);
        const currentStock = savedStock ? JSON.parse(savedStock) : this.data.stock;
        const item = currentStock.find(item => item.id === itemId);
        
        if (item) {
            item.quantity = Math.max(0, item.quantity - quantityDamaged);
            // Save updated stock back to bar-specific localStorage
            localStorage.setItem(barStockKey, JSON.stringify(currentStock));
        }
    }

    saveBarStock() {
        const barId = this.user.bar_id;
        if (barId) {
            localStorage.setItem(`upis_stock_${barId}`, JSON.stringify(this.data.barStock[barId]));
        }
    }

    loadBarStock() {
        const barId = this.user.bar_id;
        if (barId) {
            const savedStock = localStorage.getItem(`upis_stock_${barId}`);
            if (savedStock) {
                // Initialize barStock if not exists
                if (!this.data.barStock) this.data.barStock = {};
                this.data.barStock[barId] = JSON.parse(savedStock);
            } else {
                // Initialize barStock if not exists
                if (!this.data.barStock) this.data.barStock = {};
                this.data.barStock[barId] = JSON.parse(JSON.stringify(this.data.stock));
                this.saveBarStock();
            }
        }
    }

    refreshStock() {
        this.loadBarStock();
        this.navigateToPage('stock');
    }

    editPrices() {
        const currentStock = this.getCurrentBarStock();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto fade-in">
                <h3 class="text-xl font-bold text-slate-800 mb-6">Edit Prices</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-200">
                                <th class="text-left py-2 px-4 font-semibold text-slate-700">Item Name</th>
                                <th class="text-center py-2 px-4 font-semibold text-slate-700">Current Price</th>
                                <th class="text-center py-2 px-4 font-semibold text-slate-700">New Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${currentStock.map(item => `
                                <tr class="border-b border-slate-100">
                                    <td class="py-2 px-4 font-medium">${item.name}</td>
                                    <td class="py-2 px-4 text-center">MWK ${item.price}</td>
                                    <td class="py-2 px-4">
                                        <input type="number" id="price_${item.id}" value="${item.price}" min="0" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-center">
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="app.savePriceChanges()" class="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                        Save Changes
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.loadLucideIcons();
    }

    savePriceChanges() {
        const currentStock = this.getCurrentBarStock();
        
        currentStock.forEach(item => {
            const newPriceInput = document.getElementById(`price_${item.id}`);
            if (newPriceInput) {
                const newPrice = parseInt(newPriceInput.value);
                if (newPrice > 0) {
                    item.price = newPrice;
                }
            }
        });
        
        this.saveBarStock();
        document.querySelector('.fixed').remove();
        this.navigateToPage('stock');
    }

    filterStock() {
        const searchTerm = document.getElementById('stockSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const currentStock = this.getCurrentBarStock();
        
        const filteredStock = currentStock.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
        
        const tbody = document.getElementById('stockTableBody');
        if (tbody) {
            tbody.innerHTML = filteredStock.map(item => this.renderStockRow(item)).join('');
        }
        
        this.loadLucideIcons();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'warning' ? 'bg-amber-500' : type === 'error' ? 'bg-rose-500' : 'bg-blue-500';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-lg z-50 fade-in flex items-center`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'info'}" class="w-5 h-5 mr-3"></i>
            <span class="font-medium">${message}</span>
        `;
        
        document.body.appendChild(notification);
        this.loadLucideIcons();
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Restock Request Functions
    createRestockRequest() {
        const currentStock = this.getCurrentBarStock();
        const lowStockItems = currentStock.filter(item => item.quantity <= item.minStock);
        
        if (lowStockItems.length === 0) {
            this.showNotification('No low stock items to request!', 'info');
            return;
        }

        const stores = [
            { id: 1, name: 'Main Store - Blantyre' },
            { id: 2, name: 'Main Store - Lilongwe' },
            { id: 3, name: 'Central Warehouse' }
        ];

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto fade-in">
                <h3 class="text-xl font-bold text-slate-800 mb-6">Create Restock Request</h3>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Select Store</label>
                    <select id="storeSelect" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                        <option value="">Choose a store...</option>
                        ${stores.map(store => `<option value="${store.id}|${store.name}">${store.name}</option>`).join('')}
                    </select>
                </div>

                <div class="mb-6">
                    <h4 class="text-sm font-semibold text-slate-700 mb-3">Select Items to Restock</h4>
                    <div class="max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-4">
                        ${lowStockItems.map(item => `
                            <div class="flex items-center justify-between p-3 border-b border-slate-100 last:border-0">
                                <div class="flex items-center">
                                    <input type="checkbox" id="item_${item.id}" value="${item.id}" class="mr-3 w-4 h-4 text-violet-600">
                                    <div>
                                        <label for="item_${item.id}" class="font-medium text-slate-800">${item.name}</label>
                                        <p class="text-sm text-slate-600">Current: ${item.quantity} | Min: ${item.minStock} ${item.unit}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm text-slate-600">Request:</label>
                                    <input type="number" id="quantity_${item.id}" min="1" value="${item.minStock * 2 - item.quantity}" class="w-20 px-2 py-1 rounded-lg border border-slate-200 text-center">
                                    <span class="text-sm text-slate-600">${item.unit}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <textarea id="requestNotes" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="Any special requirements or urgent notes..."></textarea>
                </div>

                <div class="flex gap-3">
                    <button onclick="app.saveRestockRequest()" class="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all">
                        Submit Request
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.loadLucideIcons();
    }

    saveRestockRequest() {
        const storeSelect = document.getElementById('storeSelect').value;
        const requestNotes = document.getElementById('requestNotes').value;
        
        if (!storeSelect) {
            alert('Please select a store');
            return;
        }

        const [storeId, storeName] = storeSelect.split('|');
        const currentStock = this.getCurrentBarStock();
        const lowStockItems = currentStock.filter(item => item.quantity <= item.minStock);
        
        const selectedItems = [];
        lowStockItems.forEach(item => {
            const checkbox = document.getElementById(`item_${item.id}`);
            const quantityInput = document.getElementById(`quantity_${item.id}`);
            
            if (checkbox && checkbox.checked && quantityInput && quantityInput.value > 0) {
                selectedItems.push({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    currentQuantity: item.quantity,
                    requestedQuantity: parseInt(quantityInput.value),
                    unit: item.unit,
                    price: item.price
                });
            }
        });

        if (selectedItems.length === 0) {
            alert('Please select at least one item to restock');
            return;
        }

        const request = {
            id: Date.now(),
            barId: this.user.bar_id,
            barName: this.user.bar_name,
            storeId: parseInt(storeId),
            storeName: storeName,
            items: selectedItems,
            notes: requestNotes,
            status: 'pending',
            timestamp: new Date().toISOString(),
            requestedBy: this.user.full_name
        };

        // Save to localStorage
        let requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');
        requests.push(request);
        localStorage.setItem('upis_restock_requests', JSON.stringify(requests));

        // Close modal and refresh
        document.querySelector('.fixed').remove();
        this.navigateToPage('requests');
        this.showNotification('Restock request submitted successfully!', 'success');
    }

    forwardToManager(requestId) {
        let requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');
        const requestIndex = requests.findIndex(req => req.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'forwarded';
            requests[requestIndex].forwardedBy = this.user.full_name;
            requests[requestIndex].forwardedAt = new Date().toISOString();
            localStorage.setItem('upis_restock_requests', JSON.stringify(requests));
            
            this.navigateToPage('requests');
            this.showNotification('Request forwarded to manager!', 'success');
        }
    }

    approveRequest(requestId) {
        let requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');
        const requestIndex = requests.findIndex(req => req.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'approved';
            requests[requestIndex].approvedBy = this.user.full_name;
            requests[requestIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('upis_restock_requests', JSON.stringify(requests));
            
            // Update stock levels (simulate restock)
            this.processApprovedRestock(requests[requestIndex]);
            
            this.navigateToPage('requests');
            this.showNotification('Request approved and stock updated!', 'success');
        }
    }

    rejectRequest(requestId) {
        const reason = prompt('Please provide reason for rejection:');
        if (!reason) return;
        
        let requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');
        const requestIndex = requests.findIndex(req => req.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'rejected';
            requests[requestIndex].rejectedBy = this.user.full_name;
            requests[requestIndex].rejectedAt = new Date().toISOString();
            requests[requestIndex].rejectionReason = reason;
            localStorage.setItem('upis_restock_requests', JSON.stringify(requests));
            
            this.navigateToPage('requests');
            this.showNotification('Request rejected!', 'warning');
        }
    }

    processApprovedRestock(request) {
        const barId = request.barId;
        if (!this.data.barStock[barId]) {
            this.data.barStock[barId] = JSON.parse(JSON.stringify(this.data.stock));
        }

        request.items.forEach(item => {
            const stockItem = this.data.barStock[barId].find(stock => stock.id === item.id);
            if (stockItem) {
                stockItem.quantity += item.requestedQuantity;
            }
        });

        this.saveBarStock();
    }

    // Accountant-specific functions
renderBarFinances() {
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const barFinancialData = bars.map(bar => {
        const today = new Date().toDateString();
        const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
        const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');

        const barSales = sales.filter(sale => 
            sale.barId === bar.id && 
            new Date(sale.timestamp).toDateString() === today
        ).reduce((total, sale) => total + (sale.quantity * sale.price), 0);

        const barExpenses = expenses.filter(expense => 
            expense.barId === bar.id && 
            new Date(expense.timestamp).toDateString() === today
        ).reduce((total, expense) => total + expense.amount, 0);

        const barDeposits = deposits.filter(deposit => 
            deposit.barId === bar.id && 
            new Date(deposit.timestamp).toDateString() === today
        ).reduce((total, deposit) => total + deposit.amount, 0);

        return {
            ...bar,
            todaySales: barSales,
            todayExpenses: barExpenses,
            todayDeposits: barDeposits,
            netCash: barDeposits - barExpenses,
            grossRevenue: barSales
        };
    });

    const totalSales = barFinancialData.reduce((sum, bar) => sum + bar.todaySales, 0);
    const totalExpenses = barFinancialData.reduce((sum, bar) => sum + bar.todayExpenses, 0);
    const totalDeposits = barFinancialData.reduce((sum, bar) => sum + bar.todayDeposits, 0);

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Bar Financial Overview</h1>
                <p class="text-slate-600">Today's financial performance across all bars</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">All Bars</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${totalSales.toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Sales</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-rose-100 p-3 rounded-xl">
                            <i data-lucide="receipt" class="w-6 h-6 text-rose-600"></i>
                        </div>
                        <span class="text-sm text-rose-600 font-semibold">All Bars</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${totalExpenses.toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Expenses</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="banknote" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">All Bars</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${totalDeposits.toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Deposits</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="wallet" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">All Bars</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${(totalDeposits - totalExpenses).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Net Cash Flow</p>
                </div>
            </div>

            <!-- Bar-by-Bar Breakdown -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Individual Bar Performance</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-200">
                                <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar Name</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Sales</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Expenses</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Deposits</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Net Cash</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${barFinancialData.map(bar => `
                                <tr class="border-b border-slate-100 hover:bg-slate-50">
                                    <td class="py-4 px-4">
                                        <div>
                                            <p class="font-medium text-slate-800">${bar.name}</p>
                                            <p class="text-sm text-slate-600">Bar ID: ${bar.id}</p>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-emerald-600">MWK ${bar.todaySales.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-rose-600">MWK ${bar.todayExpenses.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-blue-600">MWK ${bar.todayDeposits.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold ${bar.netCash >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                                            MWK ${bar.netCash.toLocaleString()}
                                        </span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <button onclick="app.viewBarDetails(${bar.id})" class="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-all text-sm">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

renderExpenseTracking() {
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const expensesByBar = bars.map(bar => {
        const barExpenses = expenses.filter(expense => expense.barId === bar.id);
        const totalExpenses = barExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        const categoryBreakdown = {
            transport: barExpenses.filter(exp => exp.category === 'transport').reduce((sum, exp) => sum + exp.amount, 0),
            staff_food: barExpenses.filter(exp => exp.category === 'staff_food').reduce((sum, exp) => sum + exp.amount, 0),
            maintenance: barExpenses.filter(exp => exp.category === 'maintenance').reduce((sum, exp) => sum + exp.amount, 0),
            other: barExpenses.filter(exp => exp.category === 'other').reduce((sum, exp) => sum + exp.amount, 0)
        };

        return {
            ...bar,
            totalExpenses,
            expenseCount: barExpenses.length,
            categoryBreakdown,
            recentExpenses: barExpenses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
        };
    });

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Expense Tracking</h1>
                <p class="text-slate-600">Monitor expenses across all bars</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-rose-100 p-3 rounded-xl">
                            <i data-lucide="receipt" class="w-6 h-6 text-rose-600"></i>
                        </div>
                        <span class="text-sm text-rose-600 font-semibold">All Time</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${expensesByBar.reduce((sum, bar) => sum + bar.totalExpenses, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Expenses</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="file-text" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">All Time</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${expenses.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Expense Records</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="truck" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Transport</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${expensesByBar.reduce((sum, bar) => sum + bar.categoryBreakdown.transport, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Transport Expenses</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="users" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Staff Food</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${expensesByBar.reduce((sum, bar) => sum + bar.categoryBreakdown.staff_food, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Staff Food Expenses</p>
                </div>
            </div>

            <!-- Bar-by-Bar Expense Breakdown -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Expense Breakdown by Bar</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${expensesByBar.map(bar => `
                        <div class="border border-slate-200 rounded-xl p-4">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-semibold text-slate-800">${bar.name}</h3>
                                    <p class="text-sm text-slate-600">${bar.expenseCount} expense records</p>
                                </div>
                                <span class="text-lg font-bold text-rose-600">MWK ${bar.totalExpenses.toLocaleString()}</span>
                            </div>
                            
                            <div class="space-y-2 mb-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-600">Transport:</span>
                                    <span class="font-medium">MWK ${bar.categoryBreakdown.transport.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-600">Staff Food:</span>
                                    <span class="font-medium">MWK ${bar.categoryBreakdown.staff_food.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-600">Maintenance:</span>
                                    <span class="font-medium">MWK ${bar.categoryBreakdown.maintenance.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-600">Other:</span>
                                    <span class="font-medium">MWK ${bar.categoryBreakdown.other.toLocaleString()}</span>
                                </div>
                            </div>

                            <button onclick="app.viewBarExpenses(${bar.id})" class="w-full bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-all text-sm">
                                View All Expenses
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

renderDepositTracking() {
    const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const depositsByBar = bars.map(bar => {
        const barDeposits = deposits.filter(deposit => deposit.barId === bar.id);
        const totalDeposits = barDeposits.reduce((sum, dep) => sum + dep.amount, 0);
        
        return {
            ...bar,
            totalDeposits,
            depositCount: barDeposits.length,
            recentDeposits: barDeposits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
        };
    });

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Deposit Tracking</h1>
                <p class="text-slate-600">Monitor bank deposits across all bars</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="banknote" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">All Time</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${depositsByBar.reduce((sum, bar) => sum + bar.totalDeposits, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Deposits</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="file-text" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">All Time</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${deposits.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Deposit Records</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Average</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${deposits.length > 0 ? Math.round(depositsByBar.reduce((sum, bar) => sum + bar.totalDeposits, 0) / deposits.length).toLocaleString() : '0'}</h3>
                    <p class="text-sm text-slate-600 mt-1">Average Deposit</p>
                </div>
            </div>

            <!-- Bar-by-Bar Deposit Breakdown -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Deposit Breakdown by Bar</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${depositsByBar.map(bar => `
                        <div class="border border-slate-200 rounded-xl p-4">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-semibold text-slate-800">${bar.name}</h3>
                                    <p class="text-sm text-slate-600">${bar.depositCount} deposit records</p>
                                </div>
                                <span class="text-lg font-bold text-blue-600">MWK ${bar.totalDeposits.toLocaleString()}</span>
                            </div>

                            <div class="mb-4">
                                <h4 class="text-sm font-medium text-slate-700 mb-2">Recent Deposits:</h4>
                                <div class="space-y-2">
                                    ${bar.recentDeposits.map(deposit => `
                                        <div class="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                            <div>
                                                <p class="font-medium text-slate-800">MWK ${deposit.amount.toLocaleString()}</p>
                                                <p class="text-slate-600">${deposit.depositedBy}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-slate-600">${new Date(deposit.timestamp).toLocaleDateString()}</p>
                                                ${deposit.receiptNumber ? `<p class="text-xs text-slate-500">Receipt: ${deposit.receiptNumber}</p>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                    ${bar.recentDeposits.length === 0 ? '<p class="text-sm text-slate-500">No deposits yet</p>' : ''}
                                </div>
                            </div>

                            <button onclick="app.viewBarDeposits(${bar.id})" class="w-full bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-all text-sm">
                                View All Deposits
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

renderFinancialSummary() {
    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const barSummaries = bars.map(bar => {
        const barSales = sales.filter(sale => sale.barId === bar.id);
        const barExpenses = expenses.filter(expense => expense.barId === bar.id);
        const barDeposits = deposits.filter(deposit => deposit.barId === bar.id);

        const totalSales = barSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
        const totalExpenses = barExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalDeposits = barDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);

        return {
            ...bar,
            totalSales,
            totalExpenses,
            totalDeposits,
            netCashFlow: totalDeposits - totalExpenses,
            profitMargin: totalSales > 0 ? ((totalSales - totalExpenses) / totalSales * 100).toFixed(1) : 0,
            salesCount: barSales.length,
            expenseCount: barExpenses.length,
            depositCount: barDeposits.length
        };
    });

    const grandTotals = {
        sales: barSummaries.reduce((sum, bar) => sum + bar.totalSales, 0),
        expenses: barSummaries.reduce((sum, bar) => sum + bar.totalExpenses, 0),
        deposits: barSummaries.reduce((sum, bar) => sum + bar.totalDeposits, 0),
        netCash: barSummaries.reduce((sum, bar) => sum + bar.netCashFlow, 0)
    };

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Financial Summary</h1>
                <p class="text-slate-600">Complete financial overview across all bars</p>
            </div>

            <!-- Grand Totals -->
            <div class="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
                <h2 class="text-2xl font-bold mb-6">Grand Totals - All Bars</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p class="text-violet-100 text-sm mb-1">Total Sales Revenue</p>
                        <p class="text-3xl font-bold">MWK ${grandTotals.sales.toLocaleString()}</p>
                    </div>
                    <div>
                        <p class="text-violet-100 text-sm mb-1">Total Expenses</p>
                        <p class="text-3xl font-bold">MWK ${grandTotals.expenses.toLocaleString()}</p>
                    </div>
                    <div>
                        <p class="text-violet-100 text-sm mb-1">Total Deposits</p>
                        <p class="text-3xl font-bold">MWK ${grandTotals.deposits.toLocaleString()}</p>
                    </div>
                    <div>
                        <p class="text-violet-100 text-sm mb-1">Net Cash Flow</p>
                        <p class="text-3xl font-bold">MWK ${grandTotals.netCash.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <!-- Performance Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Performance</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${grandTotals.sales > 0 ? ((grandTotals.sales - grandTotals.expenses) / grandTotals.sales * 100).toFixed(1) : 0}%</h3>
                    <p class="text-sm text-slate-600 mt-1">Overall Profit Margin</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="bar-chart" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Average</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${Math.round(grandTotals.sales / bars.length).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Average Sales per Bar</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="activity" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Efficiency</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${(grandTotals.netCash / grandTotals.sales * 100).toFixed(1)}%</h3>
                    <p class="text-sm text-slate-600 mt-1">Cash Retention Rate</p>
                </div>
            </div>

            <!-- Detailed Bar Comparison -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Detailed Bar Comparison</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-200">
                                <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar Name</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Sales</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Expenses</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Deposits</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Net Cash Flow</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Profit Margin</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${barSummaries.map(bar => `
                                <tr class="border-b border-slate-100 hover:bg-slate-50">
                                    <td class="py-4 px-4">
                                        <div>
                                            <p class="font-medium text-slate-800">${bar.name}</p>
                                            <p class="text-sm text-slate-600">${bar.salesCount} sales</p>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-emerald-600">MWK ${bar.totalSales.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-rose-600">MWK ${bar.totalExpenses.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-blue-600">MWK ${bar.totalDeposits.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold ${bar.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                                            MWK ${bar.netCashFlow.toLocaleString()}
                                        </span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold ${bar.profitMargin >= 20 ? 'text-emerald-600' : bar.profitMargin >= 10 ? 'text-amber-600' : 'text-rose-600'}">
                                            ${bar.profitMargin}%
                                        </span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <button onclick="app.viewBarFinancialDetails(${bar.id})" class="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-all text-sm">
                                            Full Report
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Manager-specific functions
renderBarOverview() {
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
    const requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');

    const barOverview = bars.map(bar => {
        const barSales = sales.filter(sale => sale.barId === bar.id);
        const barExpenses = expenses.filter(expense => expense.barId === bar.id);
        const barDeposits = deposits.filter(deposit => deposit.barId === bar.id);
        const barRequests = requests.filter(req => req.barId === bar.id);

        const todaySales = barSales.filter(sale => 
            new Date(sale.timestamp).toDateString() === new Date().toDateString()
        ).reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);

        const todayExpenses = barExpenses.filter(expense => 
            new Date(expense.timestamp).toDateString() === new Date().toDateString()
        ).reduce((sum, expense) => sum + expense.amount, 0);

        const pendingRequests = barRequests.filter(req => 
            req.status === 'pending' || req.status === 'forwarded'
        ).length;

        return {
            ...bar,
            todaySales,
            todayExpenses,
            todayDeposits: barDeposits.filter(dep => 
                new Date(dep.timestamp).toDateString() === new Date().toDateString()
            ).reduce((sum, dep) => sum + dep.amount, 0),
            totalSales: barSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0),
            totalExpenses: barExpenses.reduce((sum, expense) => sum + expense.amount, 0),
            totalDeposits: barDeposits.reduce((sum, deposit) => sum + deposit.amount, 0),
            pendingRequests,
            salesCount: barSales.length,
            expenseCount: barExpenses.length,
            depositCount: barDeposits.length
        };
    });

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Bar Overview</h1>
                <p class="text-slate-600">Monitor all bar operations and performance</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Today</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${barOverview.reduce((sum, bar) => sum + bar.todaySales, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Sales Today</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-rose-100 p-3 rounded-xl">
                            <i data-lucide="alert-circle" class="w-6 h-6 text-rose-600"></i>
                        </div>
                        <span class="text-sm text-rose-600 font-semibold">Pending</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${barOverview.reduce((sum, bar) => sum + bar.pendingRequests, 0)}</h3>
                    <p class="text-sm text-slate-600 mt-1">Restock Requests</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="users" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Active</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${bars.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Bars</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="activity" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">All Time</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${barOverview.reduce((sum, bar) => sum + bar.totalSales, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Revenue</p>
                </div>
            </div>

            <!-- Bar Details -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Individual Bar Performance</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${barOverview.map(bar => `
                        <div class="border border-slate-200 rounded-xl p-4">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-semibold text-slate-800">${bar.name}</h3>
                                    <p class="text-sm text-slate-600">Bar ID: ${bar.id}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-slate-600">Today</p>
                                    <p class="text-lg font-bold text-emerald-600">MWK ${bar.todaySales.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-3 gap-4 text-center">
                                <div class="bg-slate-50 rounded-lg p-3">
                                    <p class="text-2xl font-bold text-slate-800">${bar.salesCount}</p>
                                    <p class="text-xs text-slate-600">Sales</p>
                                </div>
                                <div class="bg-slate-50 rounded-lg p-3">
                                    <p class="text-2xl font-bold text-slate-800">${bar.expenseCount}</p>
                                    <p class="text-xs text-slate-600">Expenses</p>
                                </div>
                                <div class="bg-slate-50 rounded-lg p-3">
                                    <p class="text-2xl font-bold text-slate-800">${bar.pendingRequests}</p>
                                    <p class="text-xs text-slate-600">Pending</p>
                                </div>
                            </div>

                            <div class="mt-4 flex gap-2">
                                <button onclick="app.viewBarDetails('${bar.id}')" class="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-all text-sm">
                                    View Details
                                </button>
                                <button onclick="app.manageBar('${bar.id}')" class="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-all text-sm">
                                    Manage
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

renderStaffManagement() {
    const users = JSON.parse(localStorage.getItem('upis_users') || '[]');
    const staff = users.filter(user => user.role === 'bartender' || user.role === 'store_officer');

    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const staffByBar = bars.map(bar => {
        const barStaff = staff.filter(user => user.bar_id === bar.id);
        const activeToday = barStaff.filter(user => {
            // Check if user has activity today (simplified check)
            const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
            const userSales = sales.filter(sale => 
                sale.barId === user.bar_id && 
                new Date(sale.timestamp).toDateString() === new Date().toDateString()
            );
            return userSales.length > 0;
        });

        return {
            ...bar,
            totalStaff: barStaff.length,
            activeToday: activeToday.length,
            staff: barStaff
        };
    });

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Staff Management</h1>
                <p class="text-slate-600">Manage and monitor staff across all bars</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="users" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Total</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${staff.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Staff</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="user-check" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Active Today</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${staffByBar.reduce((sum, bar) => sum + bar.activeToday, 0)}</h3>
                    <p class="text-sm text-slate-600 mt-1">Staff Active Today</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="map-pin" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Locations</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${bars.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Bar Locations</p>
                </div>
            </div>

            <!-- Staff by Bar -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Staff by Bar</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${staffByBar.map(bar => `
                        <div class="border border-slate-200 rounded-xl p-4">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-semibold text-slate-800">${bar.name}</h3>
                                    <p class="text-sm text-slate-600">${bar.totalStaff} staff members</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-slate-600">Active Today</p>
                                    <p class="text-lg font-bold text-emerald-600">${bar.activeToday}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                ${bar.staff.length > 0 ? bar.staff.map(staffMember => `
                                    <div class="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <div>
                                            <p class="font-medium text-slate-800">${staffMember.full_name}</p>
                                            <p class="text-sm text-slate-600">${staffMember.role === 'bartender' ? 'Bartender' : 'Store Officer'}</p>
                                        </div>
                                        <span class="px-2 py-1 text-xs rounded-full ${
                                            staffMember.bar_id ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }">
                                            ${staffMember.bar_id ? 'Assigned' : 'Unassigned'}
                                        </span>
                                    </div>
                                `).join('') : '<p class="text-sm text-slate-500">No staff assigned</p>'}
                            </div>

                            <div class="mt-4 flex gap-2">
                                <button onclick="app.assignStaff('${bar.id}')" class="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-all text-sm">
                                    Assign Staff
                                </button>
                                <button onclick="app.viewBarStaff('${bar.id}')" class="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-all text-sm">
                                    View All
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

renderPerformance() {
    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
    const requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');

    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toDateString();
    });

    const performanceData = bars.map(bar => {
        const barSales = sales.filter(sale => sale.barId === bar.id);
        const barExpenses = expenses.filter(expense => expense.barId === bar.id);
        const barDeposits = deposits.filter(deposit => deposit.barId === bar.id);

        const last7DaysSales = barSales.filter(sale => 
            last7Days.includes(new Date(sale.timestamp).toDateString())
        ).reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);

        const last7DaysExpenses = barExpenses.filter(expense => 
            last7Days.includes(new Date(expense.timestamp).toDateString())
        ).reduce((sum, expense) => sum + expense.amount, 0);

        const avgDailySales = last7DaysSales / 7;
        const profitMargin = last7DaysSales > 0 ? ((last7DaysSales - last7DaysExpenses) / last7DaysSales * 100).toFixed(1) : 0;

        return {
            ...bar,
            last7DaysSales,
            last7DaysExpenses,
            avgDailySales,
            profitMargin: parseFloat(profitMargin),
            totalTransactions: barSales.length,
            efficiency: last7DaysSales > 0 ? (last7DaysExpenses / last7DaysSales * 100).toFixed(1) : 0
        };
    });

    const topPerformingBar = performanceData.reduce((best, bar) => 
        bar.last7DaysSales > best.last7DaysSales ? bar : best
    , performanceData[0]);

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Performance Analytics</h1>
                <p class="text-slate-600">Track performance metrics across all bars</p>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">7 Days</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${performanceData.reduce((sum, bar) => sum + bar.last7DaysSales, 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Sales</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="bar-chart" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Average</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${Math.round(performanceData.reduce((sum, bar) => sum + bar.avgDailySales, 0)).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Daily Sales</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="percent" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Average</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${(performanceData.reduce((sum, bar) => sum + bar.profitMargin, 0) / bars.length).toFixed(1)}%</h3>
                    <p class="text-sm text-slate-600 mt-1">Profit Margin</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="star" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Top Bar</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${topPerformingBar.name}</h3>
                    <p class="text-sm text-slate-600 mt-1">Best Performer</p>
                </div>
            </div>

            <!-- Performance Table -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Bar Performance Rankings</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-200">
                                <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar Name</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">7-Day Sales</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Daily Average</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Profit Margin</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Efficiency</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Transactions</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${performanceData.sort((a, b) => b.last7DaysSales - a.last7DaysSales).map((bar, index) => `
                                <tr class="border-b border-slate-100 hover:bg-slate-50">
                                    <td class="py-4 px-4">
                                        <div class="flex items-center">
                                            ${index === 0 ? '<i data-lucide="trophy" class="w-4 h-4 text-amber-500 mr-2"></i>' : ''}
                                            <span class="font-medium text-slate-800">${bar.name}</span>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold text-emerald-600">MWK ${bar.last7DaysSales.toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-medium">MWK ${Math.round(bar.avgDailySales).toLocaleString()}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-semibold ${bar.profitMargin >= 20 ? 'text-emerald-600' : bar.profitMargin >= 10 ? 'text-amber-600' : 'text-rose-600'}">
                                            ${bar.profitMargin}%
                                        </span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-medium">${bar.efficiency}%</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <span class="font-medium">${bar.totalTransactions}</span>
                                    </td>
                                    <td class="py-4 px-4 text-center">
                                        <button onclick="app.viewBarPerformance('${bar.id}')" class="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-all text-sm">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Enhanced Manager Functions
renderStaffAccountability() {
    const users = JSON.parse(localStorage.getItem('upis_users') || '[]');
    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
    const damages = JSON.parse(localStorage.getItem('upis_damages') || '[]');
    const reports = JSON.parse(localStorage.getItem('upis_reports') || '[]');

    const staff = users.filter(user => user.role === 'bartender' || user.role === 'store_officer');
    
    const staffAccountability = staff.map(member => {
        const memberSales = sales.filter(sale => sale.barId === member.bar_id);
        const memberExpenses = expenses.filter(exp => exp.barId === member.bar_id);
        const memberDeposits = deposits.filter(dep => dep.barId === member.bar_id);
        const memberDamages = damages.filter(damage => damage.barId === member.bar_id);
        const memberReports = reports.filter(report => report.submittedBy === member.full_name);

        const today = new Date().toDateString();
        const todayActivity = memberSales.filter(sale => 
            new Date(sale.timestamp).toDateString() === today
        ).length > 0;

        const lastReportDate = memberReports.length > 0 ? 
            new Date(Math.max(...memberReports.map(r => new Date(r.timestamp)))) : null;

        return {
            ...member,
            totalSales: memberSales.length,
            totalExpenses: memberExpenses.length,
            totalDeposits: memberDeposits.length,
            totalDamages: memberDamages.length,
            totalReports: memberReports.length,
            todayActivity,
            lastReportDate,
            salesValue: memberSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0),
            expensesValue: memberExpenses.reduce((sum, exp) => sum + exp.amount, 0),
            depositsValue: memberDeposits.reduce((sum, dep) => sum + dep.amount, 0),
            complianceScore: this.calculateComplianceScore(memberSales, memberExpenses, memberDeposits, memberReports)
        };
    });

    // Helper functions for cleaner template
    const getReportStatus = (staff) => {
        if (!staff.lastReportDate) return 'No reports';
        const daysSinceReport = (new Date() - staff.lastReportDate) / (1000 * 60 * 60 * 24);
        const isOverdue = daysSinceReport > 7;
        const statusText = isOverdue ? 'Overdue' : 'Recent';
        const statusClass = isOverdue ? 'text-rose-600' : 'text-emerald-600';
        return { date: staff.lastReportDate.toLocaleDateString(), statusText, statusClass, isOverdue };
    };

    const getComplianceClass = (score) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-rose-600';
    };

    const shouldShowRemind = (staff) => {
        const daysSinceReport = staff.lastReportDate ? 
            (new Date() - staff.lastReportDate) / (1000 * 60 * 60 * 24) : 999;
        return daysSinceReport > 7;
    };

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Staff Accountability</h1>
                <p class="text-slate-600">Track staff performance, compliance, and reporting</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="users" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Total</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${staff.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Staff Members</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="check-circle" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Active Today</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${staffAccountability.filter(s => s.todayActivity).length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Staff Active</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="file-text" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Pending</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${staffAccountability.filter(s => !s.lastReportDate || (new Date() - s.lastReportDate) > 7 * 24 * 60 * 60 * 1000).length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Missing Reports</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="award" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Average</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${(staffAccountability.reduce((sum, s) => sum + s.complianceScore, 0) / staff.length).toFixed(1)}%</h3>
                    <p class="text-sm text-slate-600 mt-1">Compliance Score</p>
                </div>
            </div>

            <!-- Staff Accountability Table -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Staff Performance Overview</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-200">
                                <th class="text-left py-3 px-4 font-semibold text-slate-700">Staff Member</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Role</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Bar</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Sales</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Reports</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Last Report</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Compliance</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${staffAccountability.map(staff => {
                                const reportStatus = getReportStatus(staff);
                                const complianceClass = getComplianceClass(staff.complianceScore);
                                const showRemind = shouldShowRemind(staff);
                                
                                return `
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="py-4 px-4">
                                            <div>
                                                <p class="font-medium text-slate-800">${staff.full_name}</p>
                                                <p class="text-sm text-slate-600">${staff.bar_id || 'Unassigned'}</p>
                                            </div>
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            <span class="px-2 py-1 text-xs rounded-full ${staff.role === 'bartender' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}">
                                                ${staff.role === 'bartender' ? 'Bartender' : 'Store Officer'}
                                            </span>
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            <span class="font-medium">${staff.bar_id || 'N/A'}</span>
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            <div>
                                                <p class="font-semibold text-emerald-600">${staff.totalSales}</p>
                                                <p class="text-sm text-slate-600">MWK ${staff.salesValue.toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            <div>
                                                <p class="font-semibold text-amber-600">${staff.totalReports}</p>
                                                ${staff.todayActivity ? '<span class="text-xs text-emerald-600">Active Today</span>' : ''}
                                            </div>
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            ${reportStatus.date !== 'No reports' ? `
                                                <div>
                                                    <p class="text-sm text-slate-600">${reportStatus.date}</p>
                                                    <p class="text-xs ${reportStatus.statusClass}">${reportStatus.statusText}</p>
                                                </div>
                                            ` : '<p class="text-sm text-slate-500">No reports</p>'}
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            <span class="font-semibold ${complianceClass}">${staff.complianceScore}%</span>
                                        </td>
                                        <td class="py-4 px-4 text-center">
                                            <div class="flex gap-2 justify-center">
                                                <button onclick="app.viewStaffDetails('${staff.full_name}')" class="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700">
                                                    View
                                                </button>
                                                ${showRemind ? `
                                                    <button onclick="app.remindStaff('${staff.full_name}')" class="bg-amber-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-amber-700">
                                                        Remind
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

renderSupplierOrders() {
    const orders = JSON.parse(localStorage.getItem('upis_supplier_orders') || '[]');
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    const suppliers = [
        { id: 1, name: 'Castel Malawi', contact: '+265 123 4567', email: 'orders@castel.mw' },
        { id: 2, name: 'Malawi Bottling Co', contact: '+265 234 5678', email: 'info@malawibottling.mw' },
        { id: 3, name: 'SABMiller Malawi', contact: '+265 345 6789', email: 'sales@sabmiller.mw' },
        { id: 4, name: 'Carlsberg Malawi', contact: '+265 456 7890', email: 'orders@carlsberg.mw' }
    ];

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    };

    // Helper functions
    const getStatusClass = (status) => {
        switch(status) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const getOrderRows = () => {
        if (orders.length === 0) {
            return `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                    <p class="text-slate-500">No supplier orders yet.</p>
                </div>
            `;
        }

        return orders.slice(0, 10).map(order => {
            const statusClass = getStatusClass(order.status);
            const showProcessButton = order.status === 'pending';
            
            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="py-4 px-4 font-medium text-slate-800">#${order.id}</td>
                    <td class="py-4 px-4 text-slate-600">${order.supplierName}</td>
                    <td class="py-4 px-4 text-slate-600">${order.items.length} items</td>
                    <td class="py-4 px-4 text-center font-semibold text-violet-600">MWK ${order.totalAmount.toLocaleString()}</td>
                    <td class="py-4 px-4 text-slate-600">${new Date(order.deliveryDate).toLocaleDateString()}</td>
                    <td class="py-4 px-4 text-center">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClass}">
                            ${order.status}
                        </span>
                    </td>
                    <td class="py-4 px-4 text-center">
                        <div class="flex gap-2 justify-center">
                            <button onclick="app.viewOrderDetails(${order.id})" class="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700">
                                View
                            </button>
                            ${showProcessButton ? `
                                <button onclick="app.processOrder(${order.id})" class="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-700">
                                    Process
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Supplier Orders</h1>
                <p class="text-slate-600">Manage supplier orders and inventory replenishment</p>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <button onclick="app.createSupplierOrder()" class="bg-violet-600 text-white p-6 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center justify-center">
                    <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                    New Order
                </button>
                <button onclick="app.viewSuppliers()" class="bg-blue-600 text-white p-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center">
                    <i data-lucide="truck" class="w-5 h-5 mr-2"></i>
                    Suppliers
                </button>
                <button onclick="app.generateAutoReorder()" class="bg-emerald-600 text-white p-6 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center">
                    <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                    Auto Reorder
                </button>
                <button onclick="app.viewOrderHistory()" class="bg-slate-600 text-white p-6 rounded-xl font-semibold hover:bg-slate-700 transition-all shadow-lg shadow-slate-100 flex items-center justify-center">
                    <i data-lucide="history" class="w-5 h-5 mr-2"></i>
                    Order History
                </button>
            </div>

            <!-- Order Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="package" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Total</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${orderStats.total}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Orders</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="clock" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Pending</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${orderStats.pending}</h3>
                    <p class="text-sm text-slate-600 mt-1">Pending Orders</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="truck" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Delivered</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${orderStats.delivered}</h3>
                    <p class="text-sm text-slate-600 mt-1">Delivered Orders</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="dollar-sign" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Total Value</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${orderStats.totalValue.toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Order Value</p>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Recent Orders</h2>
                ${orders.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="inbox" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                        <p class="text-slate-500">No supplier orders yet.</p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Order ID</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Supplier</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Items</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Amount</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Delivery Date</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${getOrderRows()}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}

renderBusinessInsights() {
    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const damages = JSON.parse(localStorage.getItem('upis_damages') || '[]');
    const bars = [
        { id: 'classic', name: "UPI's Classic bar" },
        { id: 'lounge', name: "UPI's Lounge bar" },
        { id: 'club', name: "UPI's Club bar" },
        { id: 'waterfront-main', name: 'Waterfront Main bar' },
        { id: 'waterfront-vip', name: 'Waterfront VIP bar' },
        { id: 'liquor-lounge', name: "UPI's Liqour Lounge" }
    ];

    // Calculate business insights
    const last30Days = [...Array(30)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toDateString();
    });

    const insights = {
        totalSales: sales.filter(sale => 
            last30Days.includes(new Date(sale.timestamp).toDateString())
        ).reduce((sum, sale) => sum + (sale.quantity * sale.price), 0),
        topSellingProducts: this.getTopSellingProducts(sales, last30Days),
        lowStockAlerts: this.getLowStockAlerts(),
        dailyPerformance: this.getDailyPerformance(sales, last30Days),
        expenseAnalysis: this.getExpenseAnalysis(expenses, last30Days),
        damageAnalysis: this.getDamageAnalysis(damages, last30Days)
    };

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Business Insights</h1>
                <p class="text-slate-600">Data-driven insights for better decision making</p>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">30 Days</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${insights.totalSales.toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Sales</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-rose-100 p-3 rounded-xl">
                            <i data-lucide="alert-triangle" class="w-6 h-6 text-rose-600"></i>
                        </div>
                        <span class="text-sm text-rose-600 font-semibold">Alerts</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${insights.lowStockAlerts.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Low Stock Items</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="star" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Top</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${insights.topSellingProducts.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Top Products</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="activity" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Average</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${Math.round(insights.dailyPerformance.avgDailySales).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Daily Sales</p>
                </div>
            </div>

            <!-- Insights Sections -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Selling Products -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <i data-lucide="star" class="w-6 h-6 mr-3 text-amber-600"></i>
                        Top Selling Products
                    </h2>
                    ${insights.topSellingProducts.length > 0 ? `
                        <div class="space-y-3">
                            ${insights.topSellingProducts.slice(0, 5).map((product, index) => `
                                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p class="font-medium text-slate-800">${index + 1}. ${product.name}</p>
                                        <p class="text-sm text-slate-600">${product.quantity} units sold</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-emerald-600">MWK ${product.revenue.toLocaleString()}</p>
                                        <p class="text-sm text-slate-600">revenue</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-slate-500">No sales data available</p>'}
                </div>

                <!-- Low Stock Alerts -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <i data-lucide="alert-triangle" class="w-6 h-6 mr-3 text-rose-600"></i>
                        Low Stock Alerts
                    </h2>
                    ${insights.lowStockAlerts.length > 0 ? `
                        <div class="space-y-3">
                            ${insights.lowStockAlerts.map(item => `
                                <div class="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                                    <div>
                                        <p class="font-medium text-slate-800">${item.name}</p>
                                        <p class="text-sm text-slate-600">Current: ${item.quantity} | Min: ${item.minStock}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-rose-600">Critical</p>
                                        <p class="text-sm text-slate-600">Reorder needed</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-slate-500">No low stock items</p>'}
                </div>
            </div>

            <!-- Performance Trends -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <i data-lucide="trending-up" class="w-6 h-6 mr-3 text-blue-600"></i>
                    Performance Trends
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-2xl font-bold text-slate-800">${insights.dailyPerformance.bestDay}</p>
                        <p class="text-sm text-slate-600">Best Day</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-2xl font-bold text-slate-800">${insights.dailyPerformance.peakHour}</p>
                        <p class="text-sm text-slate-600">Peak Hour</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-2xl font-bold text-slate-800">${insights.dailyPerformance.avgTransactionValue}</p>
                        <p class="text-sm text-slate-600">Avg Transaction</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

renderAlertsLogs() {
    const alerts = JSON.parse(localStorage.getItem('upis_alerts') || '[]');
    const reports = JSON.parse(localStorage.getItem('upis_reports') || '[]');
    const users = JSON.parse(localStorage.getItem('upis_users') || '[]');

    const alertStats = {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length,
        today: alerts.filter(a => 
            new Date(a.timestamp).toDateString() === new Date().toDateString()
        ).length
    };

    const recentReports = reports.slice(-10).reverse();

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Alerts & Logs</h1>
                <p class="text-slate-600">Monitor system alerts, irregularities, and compliance</p>
            </div>

            <!-- Alert Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-rose-100 p-3 rounded-xl">
                            <i data-lucide="alert-triangle" class="w-6 h-6 text-rose-600"></i>
                        </div>
                        <span class="text-sm text-rose-600 font-semibold">Critical</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${alertStats.critical}</h3>
                    <p class="text-sm text-slate-600 mt-1">Critical Alerts</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="alert-circle" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Warning</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${alertStats.warning}</h3>
                    <p class="text-sm text-slate-600 mt-1">Warning Alerts</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="info" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Today</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${alertStats.today}</h3>
                    <p class="text-sm text-slate-600 mt-1">Today's Alerts</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="bell" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Total</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${alertStats.total}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Alerts</p>
                </div>
            </div>

            <!-- Recent Alerts -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <i data-lucide="bell" class="w-6 h-6 mr-3 text-violet-600"></i>
                    Recent Alerts
                </h2>
                ${alerts.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="check-circle" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                        <p class="text-slate-500">No alerts at this time.</p>
                    </div>
                ` : `
                    <div class="space-y-3">
                        ${alerts.slice(0, 10).map(alert => `
                            <div class="flex justify-between items-start p-4 rounded-lg ${
                                alert.severity === 'critical' ? 'bg-rose-50 border-rose-200' :
                                alert.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                                'bg-blue-50 border-blue-200'
                            }">
                                <div class="flex-1">
                                    <div class="flex items-center mb-2">
                                        <span class="px-2 py-1 text-xs rounded-full font-semibold ${
                                            alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                                            alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }">
                                            ${alert.severity.toUpperCase()}
                                        </span>
                                        <p class="font-medium text-slate-800 ml-2">${alert.title}</p>
                                    </div>
                                    <p class="text-sm text-slate-600">${alert.message}</p>
                                    <div class="flex items-center text-xs text-slate-500 mt-2">
                                        <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
                                        ${alert.location || 'System'}
                                        <i data-lucide="clock" class="w-4 h-4 ml-2"></i>
                                        ${new Date(alert.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <button onclick="app.resolveAlert(${alert.id})" class="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700">
                                        Resolve
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <!-- Report Submission Log -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <i data-lucide="file-text" class="w-6 h-6 mr-3 text-violet-600"></i>
                    Recent Report Submissions
                </h2>
                ${recentReports.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="file-text" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                        <p class="text-slate-500">No reports submitted yet.</p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Report ID</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Submitted By</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Date</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentReports.map(report => `
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="py-4 px-4 font-medium text-slate-800">#${report.id}</td>
                                        <td class="py-4 px-4 text-slate-600">${report.submittedBy}</td>
                                        <td class="py-4 px-4">
                                            <span class="px-2 py-1 text-xs rounded-full ${
                                                report.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                                                report.type === 'incident' ? 'bg-rose-100 text-rose-700' :
                                                'bg-violet-100 text-violet-700'
                                            }">
                                                ${report.type}
                                            </span>
                                        </td>
                                        <td class="py-4 px-4 text-slate-600">${report.description}</td>
                                        <td class="py-4 px-4 text-slate-600">${new Date(report.timestamp).toLocaleDateString()}</td>
                                        <td class="py-4 px-4 text-center">
                                            <span class="px-2 py-1 text-xs rounded-full ${
                                                report.status === 'reviewed' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-amber-100 text-amber-700'
                                            }">
                                                ${report.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Helper functions for business insights
getTopSellingProducts(sales, dateRange) {
    const productSales = {};
    sales.filter(sale => dateRange.includes(new Date(sale.timestamp).toDateString()))
        .forEach(sale => {
            if (!productSales[sale.name]) {
                productSales[sale.name] = { quantity: 0, revenue: 0 };
            }
            productSales[sale.name].quantity += sale.quantity;
            productSales[sale.name].revenue += sale.quantity * sale.price;
        });

    return Object.entries(productSales)
        .sort(([,a], [,b]) => b.revenue - a.revenue)
        .slice(0, 10)
        .map(([name, data]) => ({ name, ...data }));
}

getLowStockAlerts() {
    const stock = JSON.parse(localStorage.getItem('upis_stock') || '[]');
    return stock.filter(item => item.quantity <= item.minStock);
}

getDailyPerformance(sales, dateRange) {
    const dailySales = {};
    dateRange.forEach(date => {
        const daySales = sales.filter(sale => 
            new Date(sale.timestamp).toDateString() === date
        );
        dailySales[date] = daySales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
    });

    const dailyValues = Object.values(dailySales);
    const bestDay = Object.entries(dailySales).reduce((best, [day, sales]) => 
        sales > best[1] ? [day, sales] : best
    , ['', 0]);

    return {
        bestDay: bestDay[0] || 'N/A',
        bestDaySales: bestDay[1] || 0,
        avgDailySales: dailyValues.length > 0 ? dailyValues.reduce((sum, val) => sum + val, 0) / dailyValues.length : 0,
        peakHour: '18:00', // Simplified - could be calculated from timestamps
        avgTransactionValue: dailyValues.length > 0 ? Math.round(dailyValues.reduce((sum, val) => sum + val, 0) / sales.filter(sale => dateRange.includes(new Date(sale.timestamp).toDateString())).length) : 0
    };
}

getExpenseAnalysis(expenses, dateRange) {
    const categoryExpenses = { transport: 0, staff_food: 0, maintenance: 0, other: 0 };
    expenses.filter(expense => dateRange.includes(new Date(expense.timestamp).toDateString()))
        .forEach(expense => {
            categoryExpenses[expense.category] += expense.amount;
        });

    return categoryExpenses;
}

getDamageAnalysis(damages, dateRange) {
    const relevantDamages = damages.filter(damage => dateRange.includes(new Date(damage.timestamp).toDateString()));
    const totalDamages = relevantDamages.length;
    const totalValue = relevantDamages.reduce((sum, damage) => sum + (damage.quantity * damage.price), 0);
    
    let topDamageType = 'N/A';
    if (relevantDamages.length > 0) {
        const topDamage = relevantDamages.reduce((most, damage) => 
            damage.quantity > most.quantity ? damage : most
        , { name: '', quantity: 0 });
        topDamageType = topDamage.name;
    }
    
    return {
        totalDamages,
        totalValue,
        topDamageType
    };
}

calculateComplianceScore(sales, expenses, deposits, reports) {
    let score = 100;
    
    // Deduct points for missing reports
    const daysSinceLastReport = reports.length > 0 ? 
        (new Date() - new Date(Math.max(...reports.map(r => new Date(r.timestamp)))) / (1000 * 60 * 60 * 24)) : 999;
    
    if (daysSinceLastReport > 7) score -= 30;
    if (daysSinceLastReport > 14) score -= 20;
    if (daysSinceLastReport > 30) score -= 30;
    
    // Bonus points for activity
    if (sales.length > 0) score += 10;
    if (deposits.length > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

// Helper functions for dashboard data
getBarPendingRequests() {
    const requests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');
    return requests.filter(req => 
        req.barId === this.user.bar_id && 
        (req.status === 'pending' || req.status === 'forwarded')
    );
}

getTodaySales() {
    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => 
        sale.barId === this.user.bar_id && 
        new Date(sale.timestamp).toDateString() === today
    );
    return todaySales.reduce((total, sale) => total + (sale.quantity * sale.price), 0);
}

getTodayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(expense => 
        expense.barId === this.user.bar_id && 
        new Date(expense.timestamp).toDateString() === today
    );
    return todayExpenses.reduce((total, expense) => total + expense.amount, 0);
}

getTodayDeposits() {
    const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
    const today = new Date().toDateString();
    const todayDeposits = deposits.filter(deposit => 
        deposit.barId === this.user.bar_id && 
        new Date(deposit.timestamp).toDateString() === today
    );
    return todayDeposits.reduce((total, deposit) => total + deposit.amount, 0);
}

getRecentSales() {
    const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
    const today = new Date().toDateString();
    return sales
        .filter(sale => 
            sale.barId === this.user.bar_id && 
            new Date(sale.timestamp).toDateString() === today
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

showExpenseForm() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-slate-800">Add Expense</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <form id="expenseForm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Expense Category *</label>
                        <select id="expenseCategory" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none">
                            <option value="">Select category...</option>
                            <option value="transport">Transport</option>
                            <option value="staff_food">Staff Food</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Paid By *</label>
                        <input type="text" id="paidBy" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" placeholder="Enter name">
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Amount (MWK) *</label>
                        <input type="number" id="expenseAmount" required min="0" step="0.01" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" placeholder="0.00">
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Receipt Photo *</label>
                        <input type="file" id="expenseReceipt" required accept="image/*" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none">
                        <p class="text-xs text-slate-500 mt-1">Upload receipt image (Max 10MB)</p>
                    </div>
                </div>

                <div class="mt-6">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <textarea id="expenseNotes" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" placeholder="Any additional details..."></textarea>
                </div>

                <div class="flex gap-3 mt-8">
                    <button type="submit" class="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-all">
                        Submit Expense
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    this.loadLucideIcons();
    
    // Handle form submission
    modal.querySelector('#expenseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveExpense();
    });
}

saveExpense() {
    const category = document.getElementById('expenseCategory').value;
    const paidBy = document.getElementById('paidBy').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const notes = document.getElementById('expenseNotes').value;
    const receiptFile = document.getElementById('expenseReceipt').files[0];

    if (!category || !paidBy || !amount || !receiptFile) {
        this.showNotification('Please fill all required fields', 'error');
        return;
    }

    if (receiptFile.size > 10 * 1024 * 1024) {
        this.showNotification('File size must be less than 10MB', 'error');
        return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const expense = {
            id: Date.now(),
            barId: this.user.bar_id,
            barName: this.user.bar_name,
            category: category,
            paidBy: paidBy,
            amount: amount,
            notes: notes,
            receiptImage: e.target.result,
            timestamp: new Date().toISOString(),
            submittedBy: this.user.full_name
        };

        // Save to localStorage
        let expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
        expenses.push(expense);
        localStorage.setItem('upis_expenses', JSON.stringify(expenses));

        // Close modal and refresh
        document.querySelector('.fixed').remove();
        this.navigateToPage('dashboard');
        this.showNotification('Expense submitted successfully!', 'success');
    };
    reader.readAsDataURL(receiptFile);
}

showDepositForm() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-slate-800">Bank Deposit</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <form id="depositForm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Amount Deposited (MWK) *</label>
                        <input type="number" id="depositAmount" required min="0" step="0.01" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="0.00">
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Deposited By *</label>
                        <input type="text" id="depositedBy" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="Enter name">
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Bank Receipt *</label>
                        <input type="file" id="bankReceipt" required accept="image/*" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                        <p class="text-xs text-slate-500 mt-1">Upload bank receipt image (Max 10MB)</p>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Receipt Number</label>
                        <input type="text" id="receiptNumber" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="Enter receipt number">
                    </div>
                </div>

                <div class="mt-6">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <textarea id="depositNotes" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="Any additional details..."></textarea>
                </div>

                <div class="flex gap-3 mt-8">
                    <button type="submit" class="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all">
                        Submit Deposit
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    this.loadLucideIcons();
    
    // Handle form submission
    modal.querySelector('#depositForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveDeposit();
    });
}

saveDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const depositedBy = document.getElementById('depositedBy').value;
    const receiptNumber = document.getElementById('receiptNumber').value;
    const notes = document.getElementById('depositNotes').value;
    const receiptFile = document.getElementById('bankReceipt').files[0];

    if (!amount || !depositedBy || !receiptFile) {
        this.showNotification('Please fill all required fields', 'error');
        return;
    }

    if (receiptFile.size > 10 * 1024 * 1024) {
        this.showNotification('File size must be less than 10MB', 'error');
        return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const deposit = {
            id: Date.now(),
            barId: this.user.bar_id,
            barName: this.user.bar_name,
            amount: amount,
            depositedBy: depositedBy,
            receiptNumber: receiptNumber,
            notes: notes,
            receiptImage: e.target.result,
            timestamp: new Date().toISOString(),
            submittedBy: this.user.full_name
        };

        // Save to localStorage
        let deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
        deposits.push(deposit);
        localStorage.setItem('upis_deposits', JSON.stringify(deposits));

        // Close modal and refresh
        document.querySelector('.fixed').remove();
        this.navigateToPage('dashboard');
        this.showNotification('Bank deposit submitted successfully!', 'success');
    };
    reader.readAsDataURL(receiptFile);
}

    // Store Officer Functions
    renderStockReceiving() {
        const stockReceivings = JSON.parse(localStorage.getItem('upis_stock_receivings') || '[]');
        const suppliers = [
            { id: 1, name: 'Castel Malawi', contact: '+265 123 4567' },
            { id: 2, name: 'Malawi Bottling Co', contact: '+265 234 5678' },
            { id: 3, name: 'SABMiller Malawi', contact: '+265 345 6789' },
            { id: 4, name: 'Carlsberg Malawi', contact: '+265 456 7890' }
        ];

        const todayReceivings = stockReceivings.filter(receiving => 
            new Date(receiving.timestamp).toDateString() === new Date().toDateString()
        );

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Stock Receiving</h1>
                    <p class="text-slate-600">Record incoming stock from suppliers</p>
                </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button onclick="app.openStockReceivingModal()" class="bg-violet-600 text-white p-6 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center justify-center">
                    <i data-lucide="package-open" class="w-5 h-5 mr-2"></i>
                    Receive Stock
                </button>
                <button onclick="app.viewReceivingHistory()" class="bg-blue-600 text-white p-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center">
                    <i data-lucide="history" class="w-5 h-5 mr-2"></i>
                    View History
                </button>
                <button onclick="app.printReceivingReport()" class="bg-emerald-600 text-white p-6 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center">
                    <i data-lucide="printer" class="w-5 h-5 mr-2"></i>
                    Print Report
                </button>
            </div>

            <!-- Today's Summary -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="package-open" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Today</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${todayReceivings.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Receivings Today</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="package" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Total Items</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${todayReceivings.reduce((sum, r) => sum + (r.items ? r.items.length : 0), 0)}</h3>
                    <p class="text-sm text-slate-600 mt-1">Items Received</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="truck" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Suppliers</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${new Set(todayReceivings.map(r => r.supplierName || 'Unknown')).size}</h3>
                    <p class="text-sm text-slate-600 mt-1">Active Suppliers</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-amber-100 p-3 rounded-xl">
                            <i data-lucide="dollar-sign" class="w-6 h-6 text-amber-600"></i>
                        </div>
                        <span class="text-sm text-amber-600 font-semibold">Value</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${todayReceivings.reduce((sum, r) => sum + (r.totalValue || 0), 0).toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Total Value</p>
                </div>
            </div>

            <!-- Recent Receivings -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Recent Stock Receivings</h2>
                ${stockReceivings.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="package-open" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                        <p class="text-slate-500">No stock receivings recorded yet.</p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Supplier</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Items</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Quantity</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Value</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Received By</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stockReceivings.slice(0, 10).map(receiving => `
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="py-4 px-4 text-slate-600">${new Date(receiving.timestamp).toLocaleDateString()}</td>
                                        <td class="py-4 px-4 text-slate-600">${receiving.supplierName}</td>
                                        <td class="py-4 px-4 text-slate-600">${receiving.items.length} items</td>
                                        <td class="py-4 px-4 text-center font-semibold text-emerald-600">${receiving.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                        <td class="py-4 px-4 text-center font-semibold text-violet-600">MWK ${receiving.totalValue.toLocaleString()}</td>
                                        <td class="py-4 px-4 text-slate-600">${receiving.receivedBy}</td>
                                        <td class="py-4 px-4 text-center">
                                            <button onclick="app.viewReceivingDetails(${receiving.id})" class="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}

    renderWarehouseManagement() {
        const warehouseStock = JSON.parse(localStorage.getItem('upis_warehouse_stock') || '[]');
        const stockReceivings = JSON.parse(localStorage.getItem('upis_stock_receivings') || '[]');
        const distributions = JSON.parse(localStorage.getItem('upis_stock_distributions') || '[]');

        // Calculate warehouse stats
        const totalItems = warehouseStock.length;
        const totalValue = warehouseStock.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
        const lowStockItems = warehouseStock.filter(item => item.quantity <= item.minStock);
        const recentReceivings = stockReceivings.filter(r => 
            new Date(r.timestamp).toDateString() === new Date().toDateString()
        ).length;

    return `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Warehouse Management</h1>
                <p class="text-slate-600">Manage warehouse inventory and stock levels</p>
            </div>

            <!-- Warehouse Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-100 p-3 rounded-xl">
                            <i data-lucide="warehouse" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-semibold">Total</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${totalItems}</h3>
                    <p class="text-sm text-slate-600 mt-1">Stock Items</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-emerald-100 p-3 rounded-xl">
                            <i data-lucide="package" class="w-6 h-6 text-emerald-600"></i>
                        </div>
                        <span class="text-sm text-emerald-600 font-semibold">Value</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">MWK ${totalValue.toLocaleString()}</h3>
                    <p class="text-sm text-slate-600 mt-1">Warehouse Value</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-rose-100 p-3 rounded-xl">
                            <i data-lucide="alert-triangle" class="w-6 h-6 text-rose-600"></i>
                        </div>
                        <span class="text-sm text-rose-600 font-semibold">Low Stock</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${lowStockItems.length}</h3>
                    <p class="text-sm text-slate-600 mt-1">Need Reorder</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-violet-100 p-3 rounded-xl">
                            <i data-lucide="truck" class="w-6 h-6 text-violet-600"></i>
                        </div>
                        <span class="text-sm text-violet-600 font-semibold">Today</span>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800">${recentReceivings}</h3>
                    <p class="text-sm text-slate-600 mt-1">New Receivings</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button onclick="app.addWarehouseItem()" class="bg-violet-600 text-white p-6 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center justify-center">
                    <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                    Add Item
                </button>
                <button onclick="app.updateStockLevels()" class="bg-blue-600 text-white p-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center">
                    <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                    Update Stock
                </button>
                <button onclick="app.generateWarehouseReport()" class="bg-emerald-600 text-white p-6 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center">
                    <i data-lucide="file-text" class="w-5 h-5 mr-2"></i>
                    Generate Report
                </button>
            </div>

            <!-- Warehouse Stock Table -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Current Warehouse Stock</h2>
                ${warehouseStock.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="warehouse" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                        <p class="text-slate-500">No items in warehouse stock.</p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Item Name</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Current Stock</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Min Stock</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Unit Price</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Value</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${warehouseStock.map(item => {
                                    const stockStatus = item.quantity <= item.minStock ? 'critical' : 
                                                       item.quantity <= item.minStock * 2 ? 'low' : 'good';
                                    const statusClass = stockStatus === 'critical' ? 'bg-rose-100 text-rose-700' :
                                                      stockStatus === 'low' ? 'bg-amber-100 text-amber-700' :
                                                      'bg-emerald-100 text-emerald-700';
                                    const totalValue = item.quantity * item.unitPrice;
                                    
                                    return `
                                        <tr class="border-b border-slate-100 hover:bg-slate-50">
                                            <td class="py-4 px-4">
                                                <div>
                                                    <p class="font-medium text-slate-800">${item.name}</p>
                                                    <p class="text-sm text-slate-600">${item.sku || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td class="py-4 px-4 text-slate-600">${item.category}</td>
                                            <td class="py-4 px-4 text-center font-semibold ${stockStatus === 'critical' ? 'text-rose-600' : stockStatus === 'low' ? 'text-amber-600' : 'text-emerald-600'}">${item.quantity}</td>
                                            <td class="py-4 px-4 text-center text-slate-600">${item.minStock}</td>
                                            <td class="py-4 px-4 text-center text-slate-600">MWK ${item.unitPrice.toLocaleString()}</td>
                                            <td class="py-4 px-4 text-center font-semibold text-violet-600">MWK ${totalValue.toLocaleString()}</td>
                                            <td class="py-4 px-4 text-center">
                                                <span class="px-2 py-1 text-xs rounded-full font-semibold ${statusClass}">
                                                    ${stockStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td class="py-4 px-4 text-center">
                                                <div class="flex gap-2 justify-center">
                                                    <button onclick="app.editWarehouseItem(${item.id})" class="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700">
                                                        Edit
                                                    </button>
                                                    <button onclick="app.distributeItem(${item.id})" class="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-700">
                                                        Distribute
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}

    renderStockDistribution() {
        const distributions = JSON.parse(localStorage.getItem('upis_stock_distributions') || '[]');
        const bars = [
            { id: 'classic', name: "UPI's Classic" },
            { id: 'lounge', name: "UPI's Lounge" },
            { id: 'club', name: "UPI's Club" },
            { id: 'waterfront-main', name: "Waterfront Main" },
            { id: 'waterfront-vip', name: "Waterfront VIP" },
            { id: 'liquor-lounge', name: "Liquor Lounge" }
        ];

        const todayDistributions = distributions.filter(d => 
            new Date(d.timestamp).toDateString() === new Date().toDateString()
        );

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Stock Distribution</h1>
                    <p class="text-slate-600">Distribute stock from warehouse to bars</p>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <button onclick="app.openDistributionModal()" class="bg-violet-600 text-white p-6 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center justify-center">
                        <i data-lucide="truck" class="w-5 h-5 mr-2"></i>
                        Distribute Stock
                    </button>
                    <button onclick="app.viewDistributionHistory()" class="bg-blue-600 text-white p-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center">
                        <i data-lucide="history" class="w-5 h-5 mr-2"></i>
                        View History
                    </button>
                    <button onclick="app.printDistributionReport()" class="bg-emerald-600 text-white p-6 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center">
                        <i data-lucide="printer" class="w-5 h-5 mr-2"></i>
                        Print Report
                    </button>
                </div>

                <!-- Today's Summary -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-violet-100 p-3 rounded-xl">
                                <i data-lucide="truck" class="w-6 h-6 text-violet-600"></i>
                            </div>
                            <span class="text-sm text-violet-600 font-semibold">Today</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${todayDistributions.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Distributions</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="package" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">Items</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${todayDistributions.reduce((sum, d) => sum + (d.items ? d.items.length : 0), 0)}</h3>
                        <p class="text-sm text-slate-600 mt-1">Items Distributed</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="map-pin" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Bars</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${new Set(todayDistributions.map(d => d.barName)).size}</h3>
                        <p class="text-sm text-slate-600 mt-1">Bars Served</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="dollar-sign" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Value</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${todayDistributions.reduce((sum, d) => sum + (d.totalValue || 0), 0).toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Total Value</p>
                    </div>
                </div>

                <!-- Recent Distributions -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Recent Stock Distributions</h2>
                    ${distributions.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="truck" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                            <p class="text-slate-500">No stock distributions recorded yet.</p>
                        </div>
                    ` : `
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-slate-200">
                                        <th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                                        <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar</th>
                                        <th class="text-left py-3 px-4 font-semibold text-slate-700">Items</th>
                                        <th class="text-center py-3 px-4 font-semibold text-slate-700">Quantity</th>
                                        <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Value</th>
                                        <th class="text-left py-3 px-4 font-semibold text-slate-700">Distributed By</th>
                                        <th class="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${distributions.slice(0, 10).map(distribution => `
                                        <tr class="border-b border-slate-100 hover:bg-slate-50">
                                            <td class="py-4 px-4 text-slate-600">${new Date(distribution.timestamp).toLocaleDateString()}</td>
                                            <td class="py-4 px-4 text-slate-600">${distribution.barName}</td>
                                            <td class="py-4 px-4 text-slate-600">${distribution.items.length} items</td>
                                            <td class="py-4 px-4 text-center font-semibold text-emerald-600">${distribution.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                            <td class="py-4 px-4 text-center font-semibold text-violet-600">MWK ${distribution.totalValue.toLocaleString()}</td>
                                            <td class="py-4 px-4 text-slate-600">${distribution.distributedBy}</td>
                                            <td class="py-4 px-4 text-center">
                                                <button onclick="app.viewDistributionDetails(${distribution.id})" class="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    renderStockTracking() {
        const stockReceivings = JSON.parse(localStorage.getItem('upis_stock_receivings') || '[]');
        const distributions = JSON.parse(localStorage.getItem('upis_stock_distributions') || '[]');
        const warehouseStock = JSON.parse(localStorage.getItem('upis_warehouse_stock') || '[]');
        
        // Calculate summary stats
        const totalReceived = stockReceivings.reduce((sum, r) => sum + (r.totalValue || 0), 0);
        const totalDistributed = distributions.reduce((sum, d) => sum + (d.totalValue || 0), 0);
        const warehouseValue = warehouseStock.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
        
        const todayReceivings = stockReceivings.filter(r => 
            new Date(r.timestamp).toDateString() === new Date().toDateString()
        ).length;
        
        const todayDistributions = distributions.filter(d => 
            new Date(d.timestamp).toDateString() === new Date().toDateString()
        ).length;

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Stock Tracking</h1>
                    <p class="text-slate-600">Complete overview of stock movements across all locations</p>
                </div>

                <!-- Overview Stats -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="package-open" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">Total</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalReceived.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Stock Received</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="truck" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Total</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalDistributed.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Stock Distributed</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-violet-100 p-3 rounded-xl">
                                <i data-lucide="warehouse" class="w-6 h-6 text-violet-600"></i>
                            </div>
                            <span class="text-sm text-violet-600 font-semibold">Current</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${warehouseValue.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Warehouse Value</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="package-open" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Today</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${todayReceivings}</h3>
                        <p class="text-sm text-slate-600 mt-1">Receivings</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-rose-100 p-3 rounded-xl">
                                <i data-lucide="truck" class="w-6 h-6 text-rose-600"></i>
                            </div>
                            <span class="text-sm text-rose-600 font-semibold">Today</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${todayDistributions}</h3>
                        <p class="text-sm text-slate-600 mt-1">Distributions</p>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <button onclick="app.exportStockReport()" class="bg-emerald-600 text-white p-6 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center">
                        <i data-lucide="download" class="w-5 h-5 mr-2"></i>
                        Export Report
                    </button>
                    <button onclick="app.printStockSummary()" class="bg-blue-600 text-white p-6 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center">
                        <i data-lucide="printer" class="w-5 h-5 mr-2"></i>
                        Print Summary
                    </button>
                    <button onclick="app.viewStockAnalytics()" class="bg-violet-600 text-white p-6 rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center justify-center">
                        <i data-lucide="bar-chart" class="w-5 h-5 mr-2"></i>
                        Analytics
                    </button>
                    <button onclick="app.refreshStockData()" class="bg-amber-600 text-white p-6 rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-100 flex items-center justify-center">
                        <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                        Refresh Data
                    </button>
                </div>

                <!-- Recent Activities -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Recent Receivings -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 class="text-xl font-bold text-slate-800 mb-6">Recent Stock Receivings</h2>
                        ${stockReceivings.length === 0 ? `
                            <div class="text-center py-8">
                                <i data-lucide="package-open" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
                                <p class="text-slate-500">No receivings recorded</p>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${stockReceivings.slice(0, 5).map(receiving => `
                                    <div class="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                        <div>
                                            <p class="font-medium text-slate-800">${receiving.supplierName}</p>
                                            <p class="text-sm text-slate-600">${new Date(receiving.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-semibold text-emerald-600">MWK ${receiving.totalValue.toLocaleString()}</p>
                                            <p class="text-sm text-slate-600">${receiving.items.length} items</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <!-- Recent Distributions -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 class="text-xl font-bold text-slate-800 mb-6">Recent Stock Distributions</h2>
                        ${distributions.length === 0 ? `
                            <div class="text-center py-8">
                                <i data-lucide="truck" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
                                <p class="text-slate-500">No distributions recorded</p>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${distributions.slice(0, 5).map(distribution => `
                                    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <p class="font-medium text-slate-800">${distribution.barName}</p>
                                            <p class="text-sm text-slate-600">${new Date(distribution.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-semibold text-blue-600">MWK ${distribution.totalValue.toLocaleString()}</p>
                                            <p class="text-sm text-slate-600">${distribution.items.length} items</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>

                <!-- Stock Flow Summary -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Stock Flow Summary</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center p-6 bg-emerald-50 rounded-xl">
                            <i data-lucide="package-open" class="w-12 h-12 text-emerald-600 mx-auto mb-3"></i>
                            <h3 class="text-lg font-semibold text-slate-800">Stock In</h3>
                            <p class="text-2xl font-bold text-emerald-600">MWK ${totalReceived.toLocaleString()}</p>
                            <p class="text-sm text-slate-600 mt-2">${stockReceivings.length} transactions</p>
                        </div>
                        <div class="text-center p-6 bg-violet-50 rounded-xl">
                            <i data-lucide="warehouse" class="w-12 h-12 text-violet-600 mx-auto mb-3"></i>
                            <h3 class="text-lg font-semibold text-slate-800">Current Stock</h3>
                            <p class="text-2xl font-bold text-violet-600">MWK ${warehouseValue.toLocaleString()}</p>
                            <p class="text-sm text-slate-600 mt-2">${warehouseStock.length} items</p>
                        </div>
                        <div class="text-center p-6 bg-blue-50 rounded-xl">
                            <i data-lucide="truck" class="w-12 h-12 text-blue-600 mx-auto mb-3"></i>
                            <h3 class="text-lg font-semibold text-slate-800">Stock Out</h3>
                            <p class="text-2xl font-bold text-blue-600">MWK ${totalDistributed.toLocaleString()}</p>
                            <p class="text-sm text-slate-600 mt-2">${distributions.length} transactions</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Store Officer Helper Functions
    openStockReceivingModal() {
        // Implementation for stock receiving modal
        this.showNotification('Stock receiving modal would open here', 'info');
    }

    viewReceivingHistory() {
        // Implementation for viewing receiving history
        this.showNotification('Receiving history would open here', 'info');
    }

    printReceivingReport() {
        // Implementation for printing receiving report
        this.showNotification('Receiving report would print here', 'info');
    }

    openDistributionModal() {
        // Implementation for distribution modal
        this.showNotification('Distribution modal would open here', 'info');
    }

    viewDistributionHistory() {
        // Implementation for viewing distribution history
        this.showNotification('Distribution history would open here', 'info');
    }

    printDistributionReport() {
        // Implementation for printing distribution report
        this.showNotification('Distribution report would print here', 'info');
    }

    addWarehouseItem() {
        // Implementation for adding warehouse item
        this.showNotification('Add warehouse item would open here', 'info');
    }

    updateStockLevels() {
        // Implementation for updating stock levels
        this.showNotification('Update stock levels would open here', 'info');
    }

    generateWarehouseReport() {
        // Implementation for generating warehouse report
        this.showNotification('Warehouse report would generate here', 'info');
    }

    editWarehouseItem(id) {
        // Implementation for editing warehouse item
        this.showNotification(`Edit warehouse item ${id} would open here`, 'info');
    }

    distributeItem(id) {
        // Implementation for distributing item
        this.showNotification(`Distribute item ${id} would open here`, 'info');
    }

    viewReceivingDetails(id) {
        // Implementation for viewing receiving details
        this.showNotification(`View receiving details ${id} would open here`, 'info');
    }

    viewDistributionDetails(id) {
        // Implementation for viewing distribution details
        this.showNotification(`View distribution details ${id} would open here`, 'info');
    }

    exportStockReport() {
        // Implementation for exporting stock report
        this.showNotification('Stock report would export here', 'info');
    }

    printStockSummary() {
        // Implementation for printing stock summary
        this.showNotification('Stock summary would print here', 'info');
    }

    viewStockAnalytics() {
        // Implementation for viewing stock analytics
        this.showNotification('Stock analytics would open here', 'info');
    }

    refreshStockData() {
        // Implementation for refreshing stock data
        this.showNotification('Stock data would refresh here', 'info');
    }

    // Managing Director Functions
    renderChainPerformance() {
        const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
        const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
        
        const bars = [
            { id: 'classic', name: "UPI's Classic" },
            { id: 'lounge', name: "UPI's Lounge" },
            { id: 'club', name: "UPI's Club" },
            { id: 'waterfront-main', name: "Waterfront Main" },
            { id: 'waterfront-vip', name: "Waterfront VIP" },
            { id: 'liquor-lounge', name: "Liquor Lounge" }
        ];

        const barPerformance = bars.map(bar => {
            const barSales = sales.filter(sale => sale.barId === bar.id);
            const barExpenses = expenses.filter(expense => expense.barId === bar.id);
            const barDeposits = deposits.filter(deposit => deposit.barId === bar.id);
            
            const totalSales = barSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
            const totalExpenses = barExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
            const totalDeposits = barDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
            
            return {
                ...bar,
                totalSales,
                totalExpenses,
                totalDeposits,
                netProfit: totalSales - totalExpenses,
                depositRate: totalSales > 0 ? (totalDeposits / totalSales) * 100 : 0
            };
        });

        const totalChainSales = barPerformance.reduce((sum, bar) => sum + bar.totalSales, 0);
        const totalChainExpenses = barPerformance.reduce((sum, bar) => sum + bar.totalExpenses, 0);
        const totalChainDeposits = barPerformance.reduce((sum, bar) => sum + bar.totalDeposits, 0);

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Chain Performance</h1>
                    <p class="text-slate-600">Overall performance across all UPI bars</p>
                </div>

                <!-- Chain Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="trending-up" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">Total Sales</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalChainSales.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">All Bars Combined</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-rose-100 p-3 rounded-xl">
                                <i data-lucide="credit-card" class="w-6 h-6 text-rose-600"></i>
                            </div>
                            <span class="text-sm text-rose-600 font-semibold">Total Expenses</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalChainExpenses.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">All Bars Combined</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="banknote" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Total Deposits</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalChainDeposits.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">All Bars Combined</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-violet-100 p-3 rounded-xl">
                                <i data-lucide="dollar-sign" class="w-6 h-6 text-violet-600"></i>
                            </div>
                            <span class="text-sm text-violet-600 font-semibold">Net Profit</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${(totalChainSales - totalChainExpenses).toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">All Bars Combined</p>
                    </div>
                </div>

                <!-- Individual Bar Performance -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Individual Bar Performance</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Bar Name</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Sales</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Expenses</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Total Deposits</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Net Profit</th>
                                    <th class="text-center py-3 px-4 font-semibold text-slate-700">Deposit Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${barPerformance.map(bar => `
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="py-4 px-4 font-medium text-slate-800">${bar.name}</td>
                                        <td class="py-4 px-4 text-center font-semibold text-emerald-600">MWK ${bar.totalSales.toLocaleString()}</td>
                                        <td class="py-4 px-4 text-center font-semibold text-rose-600">MWK ${bar.totalExpenses.toLocaleString()}</td>
                                        <td class="py-4 px-4 text-center font-semibold text-blue-600">MWK ${bar.totalDeposits.toLocaleString()}</td>
                                        <td class="py-4 px-4 text-center font-semibold text-violet-600">MWK ${bar.netProfit.toLocaleString()}</td>
                                        <td class="py-4 px-4 text-center">
                                            <span class="px-2 py-1 text-xs rounded-full font-semibold ${bar.depositRate >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                                ${bar.depositRate.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderWeeklyExpenses() {
        const expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyExpenses = expenses.filter(expense => 
            new Date(expense.timestamp) >= oneWeekAgo
        );

        const expensesByCategory = weeklyExpenses.reduce((acc, expense) => {
            const category = expense.category || 'Other';
            acc[category] = (acc[category] || 0) + (expense.amount || 0);
            return acc;
        }, {});

        const totalWeeklyExpenses = weeklyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Weekly Expenses</h1>
                    <p class="text-slate-600">Expenses across all bars for the past 7 days</p>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-rose-100 p-3 rounded-xl">
                                <i data-lucide="credit-card" class="w-6 h-6 text-rose-600"></i>
                            </div>
                            <span class="text-sm text-rose-600 font-semibold">This Week</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalWeeklyExpenses.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Total Expenses</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Transactions</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${weeklyExpenses.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Expense Entries</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="calculator" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Average</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${weeklyExpenses.length > 0 ? Math.round(totalWeeklyExpenses / weeklyExpenses.length).toLocaleString() : '0'}</h3>
                        <p class="text-sm text-slate-600 mt-1">Per Transaction</p>
                    </div>
                </div>

                <!-- Expenses by Category -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Expenses by Category</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${Object.entries(expensesByCategory).map(([category, amount]) => `
                            <div class="p-4 bg-slate-50 rounded-xl">
                                <div class="flex items-center justify-between">
                                    <span class="font-medium text-slate-700">${category}</span>
                                    <span class="font-bold text-rose-600">MWK ${amount.toLocaleString()}</span>
                                </div>
                                <div class="mt-2">
                                    <div class="w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-rose-600 h-2 rounded-full" style="width: ${(amount / totalWeeklyExpenses) * 100}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderWeeklyDeposits() {
        const deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyDeposits = deposits.filter(deposit => 
            new Date(deposit.timestamp) >= oneWeekAgo
        );

        const depositsByBar = weeklyDeposits.reduce((acc, deposit) => {
            const barId = deposit.barId || 'unknown';
            acc[barId] = (acc[barId] || 0) + (deposit.amount || 0);
            return acc;
        }, {});

        const totalWeeklyDeposits = weeklyDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

        const barNames = {
            'classic': "UPI's Classic",
            'lounge': "UPI's Lounge", 
            'club': "UPI's Club",
            'waterfront-main': "Waterfront Main",
            'waterfront-vip': "Waterfront VIP",
            'liquor-lounge': "Liquor Lounge"
        };

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Weekly Deposits</h1>
                    <p class="text-slate-600">Bank deposits across all bars for the past 7 days</p>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="banknote" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">This Week</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${totalWeeklyDeposits.toLocaleString()}</h3>
                        <p class="text-sm text-slate-600 mt-1">Total Deposits</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">Transactions</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${weeklyDeposits.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Deposit Entries</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="calculator" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">Average</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">MWK ${weeklyDeposits.length > 0 ? Math.round(totalWeeklyDeposits / weeklyDeposits.length).toLocaleString() : '0'}</h3>
                        <p class="text-sm text-slate-600 mt-1">Per Transaction</p>
                    </div>
                </div>

                <!-- Deposits by Bar -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Deposits by Bar</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${Object.entries(depositsByBar).map(([barId, amount]) => `
                            <div class="p-4 bg-slate-50 rounded-xl">
                                <div class="flex items-center justify-between">
                                    <span class="font-medium text-slate-700">${barNames[barId] || barId}</span>
                                    <span class="font-bold text-emerald-600">MWK ${amount.toLocaleString()}</span>
                                </div>
                                <div class="mt-2">
                                    <div class="w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-emerald-600 h-2 rounded-full" style="width: ${(amount / totalWeeklyDeposits) * 100}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderTrendingProducts() {
        const sales = JSON.parse(localStorage.getItem('upis_sales') || '[]');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentSales = sales.filter(sale => 
            new Date(sale.timestamp) >= oneWeekAgo
        );

        const productSales = recentSales.reduce((acc, sale) => {
            if (sale.items && Array.isArray(sale.items)) {
                sale.items.forEach(item => {
                    const productName = item.name || 'Unknown Product';
                    acc[productName] = (acc[productName] || 0) + (item.quantity || 0);
                });
            }
            return acc;
        }, {});

        const trendingProducts = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Trending Products</h1>
                    <p class="text-slate-600">Top selling products across all bars for the past 7 days</p>
                </div>

                <!-- Top Products -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Top 10 Products</h2>
                    <div class="space-y-4">
                        ${trendingProducts.map(([productName, quantity], index) => `
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                        <span class="text-sm font-bold text-violet-600">${index + 1}</span>
                                    </div>
                                    <div>
                                        <p class="font-medium text-slate-800">${productName}</p>
                                        <p class="text-sm text-slate-600">Units sold</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-xl font-bold text-emerald-600">${quantity}</p>
                                    <p class="text-sm text-slate-600">This week</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderSupplyReports() {
        const supplierOrders = JSON.parse(localStorage.getItem('upis_supplier_orders') || '[]');
        const stockReceivings = JSON.parse(localStorage.getItem('upis_stock_receivings') || '[]');
        const restockRequests = JSON.parse(localStorage.getItem('upis_restock_requests') || '[]');

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentOrders = supplierOrders.filter(order => 
            new Date(order.timestamp) >= oneWeekAgo
        );

        const recentReceivings = stockReceivings.filter(receiving => 
            new Date(receiving.timestamp) >= oneWeekAgo
        );

        const recentRequests = restockRequests.filter(request => 
            new Date(request.timestamp) >= oneWeekAgo
        );

        const ordersBySupplier = recentOrders.reduce((acc, order) => {
            const supplier = order.supplierName || 'Unknown';
            acc[supplier] = (acc[supplier] || 0) + 1;
            return acc;
        }, {});

        return `
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">Supply Reports</h1>
                    <p class="text-slate-600">Supply chain overview for the past 7 days</p>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-blue-100 p-3 rounded-xl">
                                <i data-lucide="truck" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-blue-600 font-semibold">This Week</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${recentOrders.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Supplier Orders</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-emerald-100 p-3 rounded-xl">
                                <i data-lucide="package-open" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <span class="text-sm text-emerald-600 font-semibold">This Week</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${recentReceivings.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Stock Receivings</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-amber-100 p-3 rounded-xl">
                                <i data-lucide="refresh-cw" class="w-6 h-6 text-amber-600"></i>
                            </div>
                            <span class="text-sm text-amber-600 font-semibold">This Week</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${recentRequests.length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Restock Requests</p>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <div class="bg-violet-100 p-3 rounded-xl">
                                <i data-lucide="building" class="w-6 h-6 text-violet-600"></i>
                            </div>
                            <span class="text-sm text-violet-600 font-semibold">Active</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800">${Object.keys(ordersBySupplier).length}</h3>
                        <p class="text-sm text-slate-600 mt-1">Suppliers</p>
                    </div>
                </div>

                <!-- Orders by Supplier -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Orders by Supplier</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${Object.entries(ordersBySupplier).map(([supplier, count]) => `
                            <div class="p-4 bg-slate-50 rounded-xl">
                                <div class="flex items-center justify-between">
                                    <span class="font-medium text-slate-700">${supplier}</span>
                                    <span class="font-bold text-blue-600">${count} orders</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Helper Functions for Deposits and Expenses
    addDeposit() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 fade-in">
                <h3 class="text-xl font-bold text-slate-800 mb-6">Add Bank Deposit</h3>
                <form onsubmit="app.saveDeposit(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Amount (MWK)</label>
                            <input type="number" id="depositAmount" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="Enter amount">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                            <textarea id="depositNotes" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="Enter notes (optional)"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Deposit Photo (Evidence)</label>
                            <div class="border-2 border-dashed border-slate-300 rounded-xl p-4">
                                <input type="file" id="depositPhoto" accept="image/*" capture="environment" class="hidden">
                                <div id="photoPreview" class="text-center">
                                    <div class="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
                                        <i data-lucide="camera" class="w-8 h-8 text-slate-400"></i>
                                    </div>
                                    <button type="button" onclick="document.getElementById('depositPhoto').click()" class="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700 transition-all">
                                        <i data-lucide="upload" class="w-4 h-4 inline mr-2"></i>
                                        Choose Photo
                                    </button>
                                    <p class="text-xs text-slate-500 mt-2">Take a photo or upload an image as evidence</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button type="submit" class="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                            Save Deposit
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        this.loadLucideIcons();
        
        // Add photo preview functionality
        document.getElementById('depositPhoto').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoPreview = document.getElementById('photoPreview');
                    photoPreview.innerHTML = `
                        <img src="${e.target.result}" class="w-full h-48 object-cover rounded-xl mb-4" alt="Deposit photo">
                        <button type="button" onclick="app.clearDepositPhoto()" class="mt-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-lg text-sm hover:bg-rose-200 transition-all">
                            <i data-lucide="trash-2" class="w-4 h-4 inline mr-1"></i>
                            Remove Photo
                        </button>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    saveDeposit(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const notes = document.getElementById('depositNotes').value;
        const photoInput = document.getElementById('depositPhoto');
        const photoPreview = document.getElementById('photoPreview');
        const photoImg = photoPreview.querySelector('img');
        
        const deposit = {
            id: Date.now(),
            amount,
            notes,
            photo: photoImg ? photoImg.src : null,
            timestamp: new Date().toISOString(),
            barId: this.user.bar_id,
            barName: this.user.bar_name
        };
        
        let deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
        deposits.push(deposit);
        localStorage.setItem('upis_deposits', JSON.stringify(deposits));
        
        document.querySelector('.fixed').remove();
        this.navigateToPage('bank-deposits');
        this.showNotification('Deposit added successfully!', 'success');
    }

    clearDepositPhoto() {
        const photoInput = document.getElementById('depositPhoto');
        const photoPreview = document.getElementById('photoPreview');
        
        photoInput.value = '';
        photoPreview.innerHTML = `
            <div class="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
                <i data-lucide="camera" class="w-8 h-8 text-slate-400"></i>
            </div>
            <button type="button" onclick="document.getElementById('depositPhoto').click()" class="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700 transition-all">
                <i data-lucide="upload" class="w-4 h-4 inline mr-2"></i>
                Choose Photo
            </button>
            <p class="text-xs text-slate-500 mt-2">Take a photo or upload an image as evidence</p>
        `;
        this.loadLucideIcons();
    }

    viewDepositPhoto(photoSrc) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="relative">
                <img src="${photoSrc}" class="max-w-4xl max-h-screen object-contain rounded-xl" alt="Deposit evidence">
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 bg-white text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    removeDeposit(id) {
        if (confirm('Are you sure you want to remove this deposit?')) {
            let deposits = JSON.parse(localStorage.getItem('upis_deposits') || '[]');
            deposits = deposits.filter(deposit => deposit.id !== id);
            localStorage.setItem('upis_deposits', JSON.stringify(deposits));
            this.navigateToPage('bank-deposits');
            this.showNotification('Deposit removed successfully!', 'success');
        }
    }

    refreshDeposits() {
        this.navigateToPage('bank-deposits');
    }

    addExpense() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 fade-in">
                <h3 class="text-xl font-bold text-slate-800 mb-6">Add Expense</h3>
                <form onsubmit="app.saveExpense(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Amount (MWK)</label>
                            <input type="number" id="expenseAmount" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" placeholder="Enter amount">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                            <select id="expenseCategory" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none">
                                <option value="">Select category...</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Supplies">Supplies</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Staff">Staff Costs</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea id="expenseDescription" rows="3" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" placeholder="Enter description"></textarea>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button type="submit" class="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-all">
                            Save Expense
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        this.loadLucideIcons();
    }

    saveExpense(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const description = document.getElementById('expenseDescription').value;
        
        const expense = {
            id: Date.now(),
            amount,
            category,
            description,
            timestamp: new Date().toISOString(),
            barId: this.user.bar_id,
            barName: this.user.bar_name
        };
        
        let expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
        expenses.push(expense);
        localStorage.setItem('upis_expenses', JSON.stringify(expenses));
        
        document.querySelector('.fixed').remove();
        this.navigateToPage('expenses');
        this.showNotification('Expense added successfully!', 'success');
    }

    removeExpense(id) {
        if (confirm('Are you sure you want to remove this expense?')) {
            let expenses = JSON.parse(localStorage.getItem('upis_expenses') || '[]');
            expenses = expenses.filter(expense => expense.id !== id);
            localStorage.setItem('upis_expenses', JSON.stringify(expenses));
            this.navigateToPage('expenses');
            this.showNotification('Expense removed successfully!', 'success');
        }
    }

    refreshExpenses() {
        this.navigateToPage('expenses');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 fade-in ${
            type === 'success' ? 'bg-emerald-600 text-white' :
            type === 'error' ? 'bg-rose-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="${
                    type === 'success' ? 'check-circle' :
                    type === 'error' ? 'x-circle' :
                    'info'
                }" class="w-5 h-5 mr-2"></i>
                ${message}
            </div>
        `;
        document.body.appendChild(notification);
        this.loadLucideIcons();
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app
const app = new UPISApp();
