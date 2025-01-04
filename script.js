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
            `;
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
