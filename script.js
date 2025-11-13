// Simple backend simulation using localStorage
const STORAGE_KEY = 'voltworks_projects';

// Initialize projects array if not exists
if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

// Get all projects
function getProjects() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Save a project
function saveProject(project) {
    const projects = getProjects();
    project.id = Date.now().toString();
    project.status = 'new';
    project.createdAt = new Date().toISOString();
    projects.push(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return project;
}

// File upload handling
document.getElementById('browse-files').addEventListener('click', function() {
    document.getElementById('attachments').click();
});

document.getElementById('attachments').addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const fileList = document.getElementById('file-list');
        const fileNames = document.getElementById('file-names');
        fileNames.innerHTML = '';
        
        for (let i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-file mr-2"></i>${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)`;
            fileNames.appendChild(li);
        }
        
        fileList.classList.remove('hidden');
    }
});

// Drag and drop file upload
const fileUploadArea = document.getElementById('file-upload-area');

fileUploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', function() {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    document.getElementById('attachments').files = files;
    
    // Trigger change event
    const event = new Event('change');
    document.getElementById('attachments').dispatchEvent(event);
});

// Form submission
document.getElementById('project-request-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const project = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        college: formData.get('college'),
        project_name: formData.get('project_name'),
        deadline: formData.get('deadline'),
        description: formData.get('description'),
        budget: formData.get('budget')
    };
    
    // Save project to our "backend"
    saveProject(project);
    
    // Show success message
    document.getElementById('success-message').classList.remove('hidden');
    
    // Reset form
    this.reset();
    document.getElementById('file-list').classList.add('hidden');
    
    // Scroll to success message
    document.getElementById('success-message').scrollIntoView({ behavior: 'smooth' });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        document.getElementById('success-message').classList.add('hidden');
    }, 5000);
});


// ===== ADMIN AUTHENTICATION =====
// Add this at the END of your script.js file

const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "$Appunaju1" // CHANGE THIS PASSWORD!
};

// Check if user is logged in as admin
function isAdminLoggedIn() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

// Show admin login modal
document.getElementById('admin-toggle').addEventListener('click', function() {
    if (isAdminLoggedIn()) {
        document.getElementById('admin-panel').classList.remove('translate-x-full');
        loadProjectsToAdmin();
    } else {
        document.getElementById('admin-login-modal').classList.remove('hidden');
    }
});

// Admin login form submission
document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        localStorage.setItem('adminAuthenticated', 'true');
        document.getElementById('admin-login-modal').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('translate-x-full');
        loadProjectsToAdmin();
        
        // Clear form
        this.reset();
    } else {
        alert('Invalid admin credentials!');
    }
});

// Close login modal
document.getElementById('close-login-modal').addEventListener('click', function() {
    document.getElementById('admin-login-modal').classusList.add('hidden');
});

// Close modal when clicking outside
document.getElementById('admin-login-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Auto-logout after 2 hours for security
setTimeout(() => {
    localStorage.removeItem('adminAuthenticated');
}, 2 * 60 * 60 * 1000);
