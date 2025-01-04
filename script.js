// Helper: Tampilkan Alert
function showAlert(message, type = "success") {
    const alertMessage = document.getElementById("alertMessage");
    if (alertMessage) {
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = "block";

        setTimeout(() => {
            alertMessage.style.display = "none";
        }, 3000);
    }
}

// Register
if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;
        const role = document.getElementById("regRole").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some(user => user.username === username)) {
            showAlert("Username sudah digunakan!", "danger");
        } else {
            users.push({ username, password, role });
            localStorage.setItem("users", JSON.stringify(users));
            showAlert("Registrasi berhasil! Silakan login.", "success");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
    });
}

// Login
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            showAlert("Login berhasil!", "success");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 3000);
        } else {
            showAlert("Username atau password salah!", "danger");
        }
    });
}

// Dashboard Dinamis
if (window.location.pathname.endsWith("dashboard.html")) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Harap login terlebih dahulu!");
        window.location.href = "index.html";
    } else {
        const dashboardContent = document.getElementById("dashboardContent");
        const role = currentUser.role;
if (role === "admin") {
    dashboardContent.innerHTML = `
        <h1>Admin Dashboard</h1>
        <p>Selamat datang, ${currentUser.username}. Anda dapat mengelola pengguna.</p>
        <button class="btn btn-primary" onclick="manageUsers()">Kelola Pengguna</button>
    `;
}
        
        } else if (role === "kasir") {
            dashboardContent.innerHTML = `
                <h1>Kasir Dashboard</h1>
                <p>Selamat datang, ${currentUser.username}. Anda dapat mengelola transaksi.</p>
            `;
        } else if (role === "operator") {
            dashboardContent.innerHTML = `
                <h1>Operator Dashboard</h1>
                <p>Selamat datang, ${currentUser.username}. Anda dapat melihat log aktivitas Anda.</p>
            `;
        }
    }
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    alert("Anda telah logout.");
    window.location.href = "index.html";
}


//fitur agar kasir dapat menambah dan melihat transaksi.
function manageTransactions() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transactionList = transactions.map((trx, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${trx.item}</td>
            <td>${trx.amount}</td>
            <td>${trx.date}</td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Kelola Transaksi</h1>
        <button class="btn btn-secondary mt-3" onclick="toggleTheme()">Toggle Tema</button>

        <form id="transactionForm">
            <div class="mb-3">
                <label for="item" class="form-label">Nama Barang</label>
                <input type="text" id="item" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="amount" class="form-label">Jumlah</label>
                <input type="number" id="amount" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Tambah Transaksi</button>
        </form>
        <table class="table table-striped mt-3">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Tanggal</th>
                </tr>
            </thead>
            <tbody>${transactionList}</tbody>
        </table>
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

// Tambahkan pemanggilan fungsi saat role "kasir" dipilih
if (currentUser.role === "kasir") {
    manageTransactions();
}



//fitur agar operator dapat melihat log aktivitasnya.
function viewLogs() {
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
    const logList = logs.map((log, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${log.action}</td>
            <td>${log.date}</td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Log Aktivitas</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Aksi</th>
                    <th>Tanggal</th>
                </tr>
            </thead>
            <tbody>${logList}</tbody>
        </table>
    `;
}

// Simpan aktivitas ke log
function logActivity(action) {
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
    const date = new Date().toLocaleDateString();

    logs.push({ action, date });
    localStorage.setItem("logs", JSON.stringify(logs));
}

// Contoh pemanggilan log saat operator mengakses
if (currentUser.role === "operator") {
    logActivity(`Operator ${currentUser.username} mengakses dashboard`);
    viewLogs();
}




//fitur sesuai dengan role pengguna.
if (role === "admin") {
    dashboardContent.innerHTML = `
        <h1>Admin Dashboard</h1>
        <p>Selamat datang, ${currentUser.username}. Anda dapat mengelola pengguna.</p>
        <button class="btn btn-primary" onclick="manageUsers()">Kelola Pengguna</button>
    `;
} else if (role === "kasir") {
    dashboardContent.innerHTML = `
        <h1>Kasir Dashboard</h1>
        <p>Selamat datang, ${currentUser.username}. Anda dapat mengelola transaksi.</p>
    `;
    if (role === "kasir") {
    dashboardContent.innerHTML += `
        <button class="btn btn-success mt-3" onclick="exportToCSV()">Ekspor Transaksi ke CSV</button>
    `;
}
    manageTransactions();
} else if (role === "operator") {
    dashboardContent.innerHTML = `
        <h1>Operator Dashboard</h1>
        <p>Selamat datang, ${currentUser.username}. Anda dapat melihat log aktivitas Anda.</p>
    `;
    viewLogs();
}




//fungsi berikut untuk mengelola pengguna:
function manageUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userRows = users.map((user, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editUser(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${index})">Hapus</button>
            </td>
        </tr>
    `).join("");

    document.getElementById("dashboardContent").innerHTML = `
        <h1>Manajemen Pengguna</h1>
        <form id="userForm">
            <div class="mb-3">
                <label for="newUsername" class="form-label">Username</label>
                <input type="text" id="newUsername" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="newPassword" class="form-label">Password</label>
                <input type="password" id="newPassword" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="newRole" class="form-label">Role</label>
                <select id="newRole" class="form-select" required>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                    <option value="operator">Operator</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Tambah Pengguna</button>
        </form>
        <table class="table table-striped mt-3">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>${userRows}</tbody>
        </table>
    `;

    document.getElementById("userForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("newUsername").value;
        const password = document.getElementById("newPassword").value;
        const role = document.getElementById("newRole").value;

        if (users.some(user => user.username === username)) {
            showAlert("Username sudah ada!", "danger");
        } else {
            users.push({ username, password, role });
            localStorage.setItem("users", JSON.stringify(users));
            manageUsers();
            showAlert("Pengguna berhasil ditambahkan!", "success");
        }
    });
}

function editUser(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users[index];
    const newUsername = prompt("Edit Username", user.username);
    const newRole = prompt("Edit Role (admin, kasir, operator)", user.role);

    if (newUsername && newRole) {
        users[index] = { ...user, username: newUsername, role: newRole };
        localStorage.setItem("users", JSON.stringify(users));
        manageUsers();
        showAlert("Pengguna berhasil diperbarui!", "success");
    }
}

function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        manageUsers();
        showAlert("Pengguna berhasil dihapus!", "success");
    }
}



function exportToCSV() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    if (transactions.length === 0) {
        showAlert("Tidak ada data transaksi untuk diekspor!", "danger");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,No,Nama Barang,Jumlah,Tanggal\n";
    transactions.forEach((trx, index) => {
        csvContent += `${index + 1},${trx.item},${trx.amount},${trx.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaksi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//Tema Gelap/Terang dengan Penyimpanan Preferensi
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


