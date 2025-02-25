let transactionsData = [];
let currentPage = 1;
let recordsPerPage = 10;
let editingIndex = null; // Δείκτης για την επεξεργασία εγγραφής

// Φόρτωση και επεξεργασία του CSV αρχείου
function handleFile(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    transactionsData = results.data;
                    currentPage = 1; // Reset σελίδας όταν φορτώνεται νέο αρχείο
                    renderTable();
                    setupPagination();
                    document.getElementById('downloadBtn').style.display = 'block';
                }
            });
        };
        reader.readAsText(file);
    } else {
        alert('Παρακαλώ επιλέξτε ένα αρχείο CSV.');
    }
}

// Εμφάνιση δεδομένων στον πίνακα
function renderTable() {
    const tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = ''; // Καθαρισμός πίνακα

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const pageData = transactionsData.slice(startIndex, endIndex);

    pageData.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.invoice_no}</td>
            <td>${transaction.customer_id}</td>
            <td>${transaction.gender}</td>
            <td>${transaction.age}</td>
            <td>${transaction.category}</td>
            <td>${transaction.quantity}</td>
            <td>${transaction.price}</td>
            <td>${transaction.payment_method}</td>
            <td>${transaction.invoice_date}</td>
            <td>${transaction.shopping_mall}</td>
            <td><button onclick="editTransaction(${startIndex + index})">Επεξεργασία</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Σελιδοποίηση των δεδομένων
function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(transactionsData.length / recordsPerPage);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Προηγούμενη';
        prevButton.onclick = prevPage;
        pagination.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Επόμενη';
        nextButton.onclick = nextPage;
        pagination.appendChild(nextButton);
    }
}

// Προηγούμενη Σελίδα
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        setupPagination();
    }
}

// Επόμενη Σελίδα
function nextPage() {
    const totalPages = Math.ceil(transactionsData.length / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        setupPagination();
    }
}

// Επεξεργασία Εγγραφής
function editTransaction(index) {
    editingIndex = index;
    const transaction = transactionsData[index];

    document.getElementById('invoice_no').value = transaction.invoice_no;
    document.getElementById('customer_id').value = transaction.customer_id;
    document.getElementById('gender').value = transaction.gender;
    document.getElementById('age').value = transaction.age;
    document.getElementById('category').value = transaction.category;
    document.getElementById('quantity').value = transaction.quantity;
    document.getElementById('price').value = transaction.price;
    document.getElementById('payment_method').value = transaction.payment_method;
    document.getElementById('invoice_date').value = transaction.invoice_date;
    document.getElementById('shopping_mall').value = transaction.shopping_mall;

    document.getElementById('addForm').style.display = 'block';

    // Αυτόματο scroll στη φόρμα επεξεργασίας
    document.getElementById('addForm').scrollIntoView({ behavior: 'smooth' })
}

// Προσθήκη Νέας Εγγραφής ή Επεξεργασία
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newTransaction = {
        invoice_no: document.getElementById('invoice_no').value,
        customer_id: document.getElementById('customer_id').value,
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value),
        category: document.getElementById('category').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: document.getElementById('price').value,
        payment_method: document.getElementById('payment_method').value,
        invoice_date: document.getElementById('invoice_date').value,
        shopping_mall: document.getElementById('shopping_mall').value
    };

    if (editingIndex !== null) {
        transactionsData[editingIndex] = newTransaction; // Ενημέρωση υπάρχουσας εγγραφής
    } else {
        transactionsData.push(newTransaction); // Προσθήκη νέας εγγραφής
    }

    renderTable();
    setupPagination();
    closeAddForm();
});

// Κλείσιμο της φόρμας
function closeAddForm() {
    document.getElementById('addForm').style.display = 'none';
    editingIndex = null;
}

// Εμφάνιση φόρμας προσθήκης
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
}

// Κατέβασμα νέου CSV
function downloadCSV() {
    const csv = Papa.unparse(transactionsData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
}
