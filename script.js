const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");
const list = document.getElementById("list");

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

const filterRadios = document.querySelectorAll('input[name="filter"]');

let entries = [];
let editId = null;
let currentFilter = "all";


function saveToLocalStorage() {
    localStorage.setItem("entries", JSON.stringify(entries));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("entries");
    if (data) {
        entries = JSON.parse(data);
    }
}

loadFromLocalStorage();
renderEntries();


filterRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        currentFilter = e.target.value;
        renderEntries();
    });
});


addBtn.addEventListener("click", () => {
     console.log(amountInput.value, typeof amountInput.value);
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector('input[name="type"]:checked').value;

    if (description === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid description and amount");
        return;
    }

    if (editId) {
        entries = entries.map(entry =>
            entry.id === editId
                ? { ...entry, description, amount, type }
                : entry
        );
        editId = null;
    } else {
        entries.push({
            id: Date.now(),
            description,
            amount,
            type
        });
    }

    saveToLocalStorage();
    renderEntries();
    resetForm();
});


resetBtn.addEventListener("click", resetForm);

function resetForm() {
    descriptionInput.value = "";
    amountInput.value = "";
}


function renderEntries() {
    list.innerHTML = "";

    const filteredEntries =
        currentFilter === "all"
            ? entries
            : entries.filter(entry => entry.type === currentFilter);

    filteredEntries.forEach(entry => {
        const li = document.createElement("li");
        li.classList.add(entry.type);

        li.innerHTML = `
            <span>${entry.description} - ₹${entry.amount}</span>
            <div class="actions">
                <button onclick="editEntry(${entry.id})">Edit</button>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });

    updateSummary();
}


function updateSummary() {
    let income = 0;
    let expense = 0;

    entries.forEach(entry => {
        if (entry.type === "income") {
            income += entry.amount;
        } else {
            expense += entry.amount;
        }
    });

    totalIncomeEl.textContent = `₹${income}`;
    totalExpenseEl.textContent = `₹${expense}`;
    balanceEl.textContent = `₹${income - expense}`;
}


function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    saveToLocalStorage();
    renderEntries();
}


function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);

    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;

    editId = id;
};
