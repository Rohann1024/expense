let income = 0;
let expenses = [];
function setIncome() {
    const incomeInput = document.getElementById('income');
    income = parseFloat(incomeInput.value) || 0;
    updateSummary();
}
// Fetch expenses from the server and update the local expenses array
function updateSummary() {
    const incomeAmountElement = document.getElementById('incomeAmount');
    const remainingAmountElement = document.getElementById('remainingAmount');

    incomeAmountElement.textContent = income.toFixed(2);
    remainingAmountElement.textContent = (income - calculateTotalExpenses()).toFixed(2);
}

async function fetchExpenses() {
    try {
        const response = await fetch('http://localhost:3000/api/expenses');
        const data = await response.json();
        expenses = data;
        updateSummary();
        updateExpenseList();
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

// Store new expense on the server
async function addExpense() {
    const expenseTitleInput = document.getElementById('expenseTitle');
    const expenseAmountInput = document.getElementById('expenseAmount');

    const title = expenseTitleInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value) || 0;
    console.log(title);
    console.log(amount);

    if (title && amount > 0) {
        try {
            const response = await fetch('http://localhost:3000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title:title,
                    amount:amount,
                }),
            });

            const data = await response.json();
            expenses.push(data);
            updateSummary();
            updateExpenseList();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }

    // Clear input fields
    expenseTitleInput.value = '';
    expenseAmountInput.value = '';
}


function calculateTotalExpenses() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function updateExpenseList() {
    const expensesList = document.getElementById('expenses');
    expensesList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Expense ${index + 1}: ${expense.title} - $${expense.amount.toFixed(2)}`;
        expensesList.appendChild(listItem);
    });
}

// Fetch expenses when the page loads
fetchExpenses();
