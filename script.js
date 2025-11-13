// ===== ADMIN AUTHENTICATION =====
// KEEP ONLY THIS PART

const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "voltworks2024" // CHANGE THIS PASSWORD!
};

function isAdminLoggedIn() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

document.getElementById('admin-toggle').addEventListener('click', function() {
    if (isAdminLoggedIn()) {
        document.getElementById('admin-panel').classList.remove('translate-x-full');
        // loadProjectsToAdmin(); // Remove this line since we're not using localStorage anymore
        alert('Admin panel disabled - Using Formspree for submissions');
    } else {
        document.getElementById('admin-login-modal').classList.remove('hidden');
    }
});

document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        document.getElementById('admin-login-modal').classList.add('hidden');
        alert('Login successful! Check Formspree dashboard for submissions.');
        this.reset();
    } else {
        alert('Invalid admin credentials!');
    }
});

document.getElementById('close-login-modal').addEventListener('click', function() {
    document.getElementById('admin-login-modal').classList.add('hidden');
});

document.getElementById('admin-login-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Formspree success handling - ADD THIS
document.querySelector('form').addEventListener('submit', function(e) {
    setTimeout(() => {
        document.getElementById('success-message').classList.remove('hidden');
        this.reset();
    }, 1000);
});

setTimeout(() => {
    localStorage.removeItem('adminAuthenticated');
}, 2 * 60 * 60 * 1000);
