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
