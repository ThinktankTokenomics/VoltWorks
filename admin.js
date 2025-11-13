// ===== ADMIN SECURITY CHECK =====
// Security check - prevent unauthorized access
if (!localStorage.getItem('adminAuthenticated') || localStorage.getItem('adminAuthenticated') !== 'true') {
    document.getElementById('admin-panel').classList.add('translate-x-full');
    throw new Error('Unauthorized access to admin panel');
}

// Add logout functionality
function addLogoutButton() {
    const logoutBtn = document.createElement('button');
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i>Logout';
    logoutBtn.className = 'px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300';
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminAuthenticated');
        document.getElementById('admin-panel').classList.add('translate-x-full');
        alert('Logged out successfully!');
    });
    
    // Add logout button to admin panel header
    const adminHeader = document.querySelector('#admin-panel .flex.justify-between');
    if (adminHeader) {
        adminHeader.appendChild(logoutBtn);
    }
}

// Get all projects from localStorage
function getProjects() {
    return JSON.parse(localStorage.getItem('voltworks_projects') || '[]');
}

// Load projects to admin panel
function loadProjectsToAdmin(filter = 'all', search = '') {
    const projects = getProjects();
    const container = document.getElementById('projects-container');
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-4"></i>
                <p>No project requests yet</p>
                <p class="text-sm mt-2">When users submit the form, their requests will appear here</p>
            </div>
        `;
        return;
    }
    
    let filteredProjects = projects;
    
    // Apply status filter
    if (filter !== 'all') {
        filteredProjects = projects.filter(p => p.status === filter);
    }
    
    // Apply search filter
    if (search) {
        const searchLower = search.toLowerCase();
        filteredProjects = filteredProjects.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.project_name.toLowerCase().includes(searchLower) ||
            p.email.toLowerCase().includes(searchLower)
        );
    }
    
    // Sort by creation date (newest first)
    filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = '';
    
    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card p-4';
        
        const statusColors = {
            'new': 'bg-blue-500',
            'contacted': 'bg-yellow-500',
            'quoted': 'bg-purple-500',
            'completed': 'bg-green-500'
        };
        
        projectCard.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg">${project.project_name}</h3>
                <span class="px-2 py-1 text-xs rounded-full text-white ${statusColors[project.status]}">${project.status.toUpperCase()}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                <div><strong>Name:</strong> ${project.name}</div>
                <div><strong>Phone:</strong> ${project.phone}</div>
                <div><strong>Email:</strong> ${project.email}</div>
                <div><strong>Budget:</strong> ${project.budget ? '₹' + project.budget : 'Not specified'}</div>
            </div>
            <p class="text-sm text-gray-300 mb-3 line-clamp-2">${project.description}</p>
            <div class="flex justify-between items-center text-xs text-gray-400">
                <span>Submitted: ${new Date(project.createdAt).toLocaleDateString()}</span>
                <span>Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not specified'}</span>
            </div>
            <div class="flex space-x-2 mt-3">
                <button class="change-status px-2 py-1 bg-electric-blue text-dark-primary text-xs rounded" data-id="${project.id}">Change Status</button>
                <button class="delete-project px-2 py-1 bg-red-500 text-white text-xs rounded" data-id="${project.id}">Delete</button>
            </div>
        `;
        
        container.appendChild(projectCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.change-status').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            changeProjectStatus(projectId);
        });
    });
    
    document.querySelectorAll('.delete-project').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this project?')) {
                deleteProject(projectId);
                loadProjectsToAdmin(document.getElementById('status-filter').value, document.getElementById('search-projects').value);
            }
        });
    });
}

function changeProjectStatus(projectId) {
    const statuses = ['new', 'contacted', 'quoted', 'completed'];
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    const currentStatus = project.status;
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    
    updateProjectStatus(projectId, nextStatus);
    loadProjectsToAdmin(document.getElementById('status-filter').value, document.getElementById('search-projects').value);
}

function updateProjectStatus(projectId, status) {
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        projects[projectIndex].status = status;
        localStorage.setItem('voltworks_projects', JSON.stringify(projects));
        return true;
    }
    return false;
}

function deleteProject(projectId) {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('voltworks_projects', JSON.stringify(filteredProjects));
    return filteredProjects.length !== projects.length;
}

// Admin panel controls
document.getElementById('refresh-projects').addEventListener('click', function() {
    loadProjectsToAdmin(document.getElementById('status-filter').value, document.getElementById('search-projects').value);
});

document.getElementById('export-projects').addEventListener('click', function() {
    const projects = getProjects();
    if (projects.length === 0) {
        alert('No projects to export');
        return;
    }
    
    let csv = 'Name,Email,Phone,College,Project Name,Deadline,Budget,Description,Status,Created At\n';
    
    projects.forEach(project => {
        csv += `"${project.name}","${project.email}","${project.phone}","${project.college || ''}","${project.project_name}","${project.deadline || ''}","${project.budget || ''}","${project.description.replace(/"/g, '""')}","${project.status}","${project.createdAt}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voltworks-projects-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('status-filter').addEventListener('change', function() {
    loadProjectsToAdmin(this.value, document.getElementById('search-projects').value);
});

document.getElementById('search-projects').addEventListener('input', function() {
    loadProjectsToAdmin(document.getElementById('status-filter').value, this.value);
});

// Initialize admin panel
addLogoutButton();
loadProjectsToAdmin();
