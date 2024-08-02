document.addEventListener('DOMContentLoaded', () => {
    clearTransactionsOnLoad();
    document.getElementById('choose-transaction-type').addEventListener('click', openModal);
    document.getElementById('received-button').addEventListener('click', () => selectTransactionType('received'));
    document.getElementById('spent-button').addEventListener('click', () => selectTransactionType('spent'));
    document.getElementById('add-transaction').addEventListener('click', addTransaction);
});

let transactionType = null;

function clearTransactionsOnLoad() {
    localStorage.setItem('transactions', JSON.stringify([]));
    loadTransactions();  // Load empty list
}

function openModal() {
    if (document.getElementById('amount').value.trim() === '') {
        alert('Please enter an amount first');
        return;
    }
    document.getElementById('transaction-type-modal').style.display = 'block';
}

function selectTransactionType(type) {
    transactionType = type;
    document.getElementById('transaction-type-modal').style.display = 'none';
}

function addTransaction() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (isNaN(amount) || category.trim() === '' || description.trim() === '' || !transactionType) {
        alert('Please fill in all fields with valid data and select a transaction type');
        return;
    }

    const adjustedAmount = transactionType === 'received' ? amount : -amount;
    const transaction = { amount: adjustedAmount, category, description };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').value = '';
    transactionType = null;

    loadTransactions();
}

function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `$${Math.abs(transaction.amount).toFixed(2)} | ${transaction.category} | ${transaction.description}`;
        transactionList.appendChild(li);

        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expense').textContent = `$${Math.abs(totalExpense).toFixed(2)}`;
    document.getElementById('net-savings').textContent = formatNetSavings(totalIncome + totalExpense);
}

function formatNetSavings(netSavings) {
    const absSavings = Math.abs(netSavings).toFixed(2);
    return netSavings < 0 ? `-$${absSavings}` : `$${absSavings}`;
}