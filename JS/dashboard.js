// Dashboard functionality
let currentIssues = [];
let currentPage = 1;
const issuesPerPage = 6;

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

function initializeDashboard() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('civictrack_user') || 'null');
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Load issues
    currentIssues = [...mockIssues];
    renderIssues();
    setupPagination();
}
const mockIssues = [
    {
                id: 1,
                title: "Streetlight not working",
                description: "Street light has been non-functional for 3 days, causing safety concerns.",
                category: "lighting",
                status: "in-progress",
                location: "Main Street",
                reporter: "Anonymous",
                timestamp: new Date(Date.now() - 86400000 * 3),
                images: ["Images/light.jpeg"],
                lat: 23.0225,
                lng: 72.5714
            },
            {
                id: 2,
                title: "Pothole on main road",
                description: "Large pothole causing damage to vehicles and creating traffic issues.",
                category: "roads",
                status: "reported",
                location: "Oak Avenue",
                reporter: "John Doe",
                timestamp: new Date(Date.now() - 86400000 * 1),
                images: ["pothole1.jpg"],
                lat: 23.0278,
                lng: 72.5626
            },
            {
                id: 3,
                title: "Garbage not collected",
                description: "Garbage bins overflowing for over a week, attracting pests.",
                category: "cleanliness",
                status: "in-progress",
                location: "Block C",
                reporter: "Jane Smith",
                timestamp: new Date(Date.now() - 86400000 * 7),
                images: [],
                lat: 23.0300,
                lng: 72.5700
            },
            {
                id: 4,
                title: "Water leak on sidewalk",
                description: "Continuous water leak from underground pipe causing flooding.",
                category: "water",
                status: "resolved",
                location: "Park Avenue",
                reporter: "Mike Johnson",
                timestamp: new Date(Date.now() - 86400000 * 14),
                images: [],
                lat: 23.0215,
                lng: 72.5800
            },
            {
                id: 5,
                title: "Broken street sign",
                description: "Stop sign damaged and unclear, creating potential traffic hazard.",
                category: "safety",
                status: "reported",
                location: "Elm & Pine",
                reporter: "Anonymous",
                timestamp: new Date(Date.now() - 86400000 * 2),
                images: ["sign1.jpg"],
                lat: 23.0230,
                lng: 72.5690
            },
            {
                id: 6,
                title: "Tree blocking pathway",
                description: "Fallen tree after storm blocking pedestrian walkway.",
                category: "obstructions",
                status: "in-progress",
                location: "Central Park",
                reporter: "Park Visitor",
                timestamp: new Date(Date.now() - 86400000 * 4),
                images: ["tree1.jpg", "tree2.jpg"],
                lat: 23.0250,
                lng: 72.5650
            }
];

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `Just now`;
}

function getCategoryInfo(category) {
    const icons = {
        Roads: { icon: 'fas fa-road' },
        Lights: { icon: 'fas fa-lightbulb' },
        Water: { icon: 'fas fa-tint' },
        Garbage: { icon: 'fas fa-trash' },
        Other: { icon: 'fas fa-question-circle' }
    };
    return icons[category] || icons['Other'];
}

function getStatusInfo(status) {
    const labels = {
        reported: { label: 'Reported' },
        'in-progress': { label: 'In Progress' },
        resolved: { label: 'Resolved' }
    };
    return labels[status] || { label: 'Unknown' };
}

// Filter form functionality
const categoryFilter = document.getElementById('filter-category');
const statusFilter = document.getElementById('filter-status');
const filterBtn = document.getElementById('filter-btn');
const clearBtn = document.getElementById('clear-btn');

if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        const category = categoryFilter.value || null;
        const status = statusFilter.value || null;
        filterIssues(category, status);
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        categoryFilter.value = '';
        statusFilter.value = '';
        filterIssues(); // show all
    });
}


function setupEventListeners() {
    // Issue card clicks
    document.addEventListener('click', function(e) {
        const issueCard = e.target.closest('.issue-card');
        if (issueCard) {
            const issueId = parseInt(issueCard.dataset.issueId);
            showIssueDetail(issueId);
        }
    });
    
    // Pagination clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-btn') && !e.target.classList.contains('active')) {
            const pageText = e.target.textContent;
            if (pageText === '<') {
                if (currentPage > 1) currentPage--;
            } else if (pageText === '>') {
                const maxPages = Math.ceil(currentIssues.length / issuesPerPage);
                if (currentPage < maxPages) currentPage++;
            } else if (!isNaN(pageText)) {
                currentPage = parseInt(pageText);
            }
            renderIssues();
            updatePagination();
        }
    });
}

function renderIssues() {
    const issuesGrid = document.getElementById('issues-grid');
    if (!issuesGrid) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * issuesPerPage;
    const endIndex = startIndex + issuesPerPage;
    const currentPageIssues = currentIssues.slice(startIndex, endIndex);
    
    if (currentPageIssues.length === 0) {
        issuesGrid.innerHTML = `
            <div class="no-issues">
                <i class="fas fa-clipboard-list"></i>
                <h3>No Issues Found</h3>
                <p>There are no reported issues in your area at the moment.</p>
                <a href="report.html" class="btn btn-primary">Report First Issue</a>
            </div>
        `;
        return;
    }
    
    issuesGrid.innerHTML = currentPageIssues.map(issue => {
        const categoryInfo = getCategoryInfo(issue.category);
        const statusInfo = getStatusInfo(issue.status);
        
        return `
            <div class="issue-card" data-issue-id="${issue.id}">
                <div class="issue-image">
                    <i class="${categoryInfo.icon}"></i>
                    <div class="issue-status-badge ${issue.status}">
                        ${statusInfo.label}
                    </div>
                </div>
                <div class="issue-content">
                    <h3 class="issue-title">${issue.title}</h3>
                    <p class="issue-description">${issue.description}</p>
                    <div class="issue-meta">
                        <span class="issue-time">
                            <i class="fas fa-clock"></i>
                            ${formatTimeAgo(issue.timestamp)}
                        </span>
                        <span class="issue-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${issue.location}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupPagination() {
    updatePagination();
}

function updatePagination() {
    const maxPages = Math.ceil(currentIssues.length / issuesPerPage);
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    let paginationHTML = '<button class="page-btn">&lt;</button>';
    
    // Show pages with smart pagination
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(maxPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
    
    if (endPage < maxPages) {
        paginationHTML += `<button class="page-btn">${maxPages}</button>`;
    }
    
    paginationHTML += '<button class="page-btn">&gt;</button>';
    
    paginationContainer.innerHTML = paginationHTML;
}

function showIssueDetail(issueId) {
    const issue = currentIssues.find(i => i.id === issueId);
    if (!issue) return;
    // Store selected issue in localStorage
    localStorage.setItem('selected_issue', JSON.stringify(issue));
    // Redirect to detail page (no ?id needed)
    window.location.href = 'issue-detail.html';
}

// Filter functionality (if needed)
function filterIssues(category = null, status = null) {
    currentIssues = mockIssues.filter(issue => {
        if (category && issue.category !== category) return false;
        if (status && issue.status !== status) return false;
        return true;
    });
    
    currentPage = 1;
    renderIssues();
    updatePagination();
}

// CSS for no issues state
const style = document.createElement('style');
style.textContent = `
    .no-issues {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #718096;
    }
    
    .no-issues i {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .no-issues h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: #4a5568;
    }
    
    .no-issues p {
        margin-bottom: 30px;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);
