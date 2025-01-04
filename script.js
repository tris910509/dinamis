// -----------------------
// Helper Functions
// -----------------------
function showAlert(message, type = "success") {
    alert(`${type.toUpperCase()}: ${message}`);
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// -----------------------
// Theme Handling
// -----------------------
function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.dataset.theme = savedTheme;
}

applySavedTheme();

// -----------------------
// Login and Register
// -----------------------
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        showAlert("Username atau password salah!", "danger");
    }
});

document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.username === username)) {
        showAlert("Username sudah digunakan!", "danger");
    } else {
        users.push({ username, password, role });
        localStorage.setItem("users", JSON.stringify(users));
        showAlert("Registrasi berhasil!", "success");
        window.location.href = "index.html";
    }
});

// -----------------------
// Dashboard Logic
// -----------------------
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    document.getElementById("roleTitle").textContent = `${currentUser.role.toUpperCase()} Dashboard`;

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
    const users = JSON.parse(localStorage.getItem("users")) || [];
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
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users[index];

    const newUsername = prompt("Username baru:", user.username);
    const newRole = prompt("Role baru (admin/kasir/operator):", user.role);

    if (newUsername && newRole) {
        users[index] = { ...user, username: newUsername, role: newRole };
        localStorage.setItem("users", JSON.stringify(users));
        manageUsers();
        showAlert("Pengguna berhasil diupdate!", "success");
    }
}

function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (confirm("Yakin ingin menghapus pengguna?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        manageUsers();
        showAlert("Pengguna berhasil dihapus!", "success");
    }
}

// -----------------------
// Kasir Features
// -----------------------
function manageTransactions() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transactionRows = transactions.map((trx, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${trx.item}</td>
            <td>${trx.amount}</td>
            <td>${trx.date}</td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Transaksi</h1>
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
        <button onclick="exportToCSV()">Ekspor ke CSV</button>
    `;

    document.getElementById("transactionForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const item = document.getElementById("item").value;
        const amount = document.getElementById("amount").value;
        const date = new Date().toLocaleDateString();

        transactions.push({ item, amount, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        manageTransactions();
        showAlert("Transaksi berhasil ditambahkan!", "success");
    });
}

function exportToCSV() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
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
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
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
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.push({ action, date: new Date().toLocaleString() });
    localStorage.setItem("logs", JSON.stringify(logs));
}
