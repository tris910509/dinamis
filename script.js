// -----------------------
// Helper Functions
// -----------------------
function showAlert(message, type = "success") {
    alert(`${type.toUpperCase()}: ${message}`);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// -----------------------
// Theme Handling
// -----------------------
function toggleTheme() {
    const currentTheme = document.body.dataset.theme || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.body.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.dataset.theme = savedTheme;
}

applySavedTheme();

// -----------------------
// Authentication
// -----------------------
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = loadFromLocalStorage("users");
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        saveToLocalStorage("currentUser", user);
        showAlert("Login berhasil!", "success");
        window.location.href = "dashboard.html";
    } else {
        showAlert("Username atau password salah!", "danger");
    }
});

document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const users = loadFromLocalStorage("users");
    if (users.some(u => u.username === username)) {
        showAlert("Username sudah terdaftar!", "danger");
    } else {
        users.push({ username, password, role });
        saveToLocalStorage("users", users);
        showAlert("Registrasi berhasil!", "success");
        window.location.href = "index.html";
    }
});

// -----------------------
// Dashboard Handling
// -----------------------
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    document.getElementById("roleTitle")?.textContent = `${currentUser.role.toUpperCase()} Dashboard`;

    if (currentUser.role === "admin") {
        manageUsers();
    } else if (currentUser.role === "kasir") {
        manageTransactions();
    } else if (currentUser.role === "operator") {
        viewLogs();
    }
} else if (window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
}

// -----------------------
// Admin Features
// -----------------------
function manageUsers() {
    const users = loadFromLocalStorage("users");
    const userRows = users.map((user, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="editUser(${index})">Edit</button>
                <button onclick="deleteUser(${index})">Hapus</button>
            </td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Manajemen Pengguna</h1>
        <table>
            <tr>
                <th>No</th>
                <th>Username</th>
                <th>Role</th>
                <th>Aksi</th>
            </tr>
            ${userRows}
        </table>
    `;
}

function editUser(index) {
    const users = loadFromLocalStorage("users");
    const user = users[index];

    const newUsername = prompt("Masukkan username baru:", user.username) || user.username;
    const newRole = prompt("Masukkan role baru (admin/kasir/operator):", user.role) || user.role;

    if (newUsername && newRole) {
        users[index] = { ...user, username: newUsername, role: newRole };
        saveToLocalStorage("users", users);
        manageUsers();
        showAlert("Pengguna berhasil diperbarui!", "success");
    }
}

function deleteUser(index) {
    const users = loadFromLocalStorage("users");
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
        users.splice(index, 1);
        saveToLocalStorage("users", users);
        manageUsers();
        showAlert("Pengguna berhasil dihapus!", "success");
    }
}

// -----------------------
// Kasir Features
// -----------------------
function manageTransactions() {
    const transactions = loadFromLocalStorage("transactions");
    const transactionRows = transactions.map((trx, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${trx.item}</td>
            <td>${trx.amount}</td>
            <td>${trx.date}</td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Manajemen Transaksi</h1>
        <form id="transactionForm">
            <input type="text" id="item" placeholder="Nama Barang" required>
            <input type="number" id="amount" placeholder="Jumlah" required>
            <button type="submit">Tambah Transaksi</button>
        </form>
        <table>
            <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
            </tr>
            ${transactionRows}
        </table>
        <button onclick="exportTransactions()">Ekspor ke CSV</button>
    `;

    document.getElementById("transactionForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const item = document.getElementById("item").value.trim();
        const amount = parseInt(document.getElementById("amount").value);
        const date = new Date().toLocaleDateString();

        transactions.push({ item, amount, date });
        saveToLocalStorage("transactions", transactions);
        manageTransactions();
        showAlert("Transaksi berhasil ditambahkan!", "success");
    });
}

function exportTransactions() {
    const transactions = loadFromLocalStorage("transactions");
    if (transactions.length === 0) {
        showAlert("Tidak ada transaksi untuk diekspor!", "danger");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8,No,Nama Barang,Jumlah,Tanggal\n" +
        transactions.map((trx, index) => `${index + 1},${trx.item},${trx.amount},${trx.date}`).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transaksi.csv";
    link.click();
}

// -----------------------
// Operator Features
// -----------------------
function viewLogs() {
    const logs = loadFromLocalStorage("logs");
    const logRows = logs.map((log, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${log.action}</td>
            <td>${log.date}</td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Log Aktivitas</h1>
        <table>
            <tr>
                <th>No</th>
                <th>Aktivitas</th>
                <th>Tanggal</th>
            </tr>
            ${logRows}
        </table>
    `;
}

function logActivity(action) {
    const logs = loadFromLocalStorage("logs");
    logs.push({ action, date: new Date().toLocaleString() });
    saveToLocalStorage("logs", logs);
}
