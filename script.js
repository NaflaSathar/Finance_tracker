// Initialize transactions array from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');

// Format currency in INR
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

// Update the balance, income, and expense
const updateBalance = () => {
    const amounts = transactions.map(transaction => 
        transaction.type === 'income' ? transaction.amount : -transaction.amount
    );

    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    const expense = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    totalBalance.textContent = formatCurrency(total);
    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);

    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Add transaction
const addTransaction = (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description.trim() === '' || isNaN(amount)) {
        alert('Please enter valid description and amount');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        date: new Date().toLocaleDateString('en-IN')
    };

    transactions.push(transaction);
    updateBalance();
    addTransactionToDOM(transaction);
    transactionForm.reset();
};

// Add transaction to DOM
const addTransactionToDOM = (transaction) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td><span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">${transaction.type}</span></td>
        <td>${formatCurrency(transaction.amount)}</td>
        <td>
            <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    transactionList.appendChild(row);
};

// Delete transaction
const deleteTransaction = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateBalance();
        init();
    }
};

// Initialize the app
const init = () => {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateBalance();
};

// Event Listeners
transactionForm.addEventListener('submit', addTransaction);

// Initialize the app
init();