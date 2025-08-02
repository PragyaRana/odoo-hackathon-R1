// Search functionality
let searchResults = [];
let activeFilters = {
    category: '',
    status: '',
    distance: '5'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    setupSearchEventListeners();
});

function initializeSearch() {
    // Initialize with all issues
    searchResults = [...mockIssues];
    renderSearchResults();
}

function setupSearchEventListeners() {
    // Filter changes
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    const distanceFilter = document.getElementById('distance-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            activeFilters.category = e.target.value;
            applyFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            activeFilters.status = e.target.value;
            applyFilters();
        });
    }
    
    if (distanceFilter) {
        distanceFilter.addEventListener('change', (e) => {
            activeFilters.distance = e.target.value;
            applyFilters();
        });
    }
    
    // Search button
    const searchBtn = document.querySelector('.search-issues-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Report new issue form
    const reportForm = document.querySelector('.submit-issue-btn');
    if (reportForm) {
        reportForm.addEventListener('click', handleReportSubmission);
    }
}

function applyFilters() {
    searchResults = mockIssues.filter(issue => {
        // Category filter
        if (activeFilters.category && issue.category !== activeFilters.category) {
            return false;
        }
        
        // Status filter
        if (activeFilters.status && issue.status !== activeFilters.status) {
            return false;
        }
        
        // Distance filter (mock implementation)
        // In a real app, this would calculate actual distance from user location
        const maxDistance = parseInt(activeFilters.distance);
        if (maxDistance < 5) {
            // For demo, randomly filter some issues for smaller distances
            return Math.random() > 0.3;
        }
        
        return true;
    });
    
    renderSearchResults();
}

function performSearch() {
    // Add loading state
    const searchBtn = document.querySelector('.search-issues-btn');
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
    
    // Simulate search delay
    setTimeout(() => {
        applyFilters();
        
        // Reset button
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
        
        // Show results notification
        showSearchNotification(searchResults.length);
    }, 800);
}

function renderSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Issues Found</h3>
                <p>Try adjusting your search filters or expanding the search area.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <h3>Search Results (${searchResults.length} issues found)</h3>
        </div>
        <div class="results-grid">
            ${searchResults.map(issue => {
                const categoryInfo = getCategoryInfo(issue.category);
                const statusInfo = getStatusInfo(issue.status);
                
                return `
                    <div class="result-card" onclick="viewIssueDetail(${issue.id})">
                        <div class="result-header">
                            <div class="result-icon">
                                <i class="${categoryInfo.icon}"></i>
                            </div>
                            <div class="result-status ${issue.status}">
                                ${statusInfo.label}
                            </div>
                        </div>
                        <div class="result-content">
                            <h4>${issue.title}</h4>
                            <p>${issue.description}</p>
                            <div class="result-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${issue.location}</span>
                                <span><i class="fas fa-clock"></i> ${formatTimeAgo(issue.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function viewIssueDetail(issueId) {
    const issue = mockIssues.find(i => i.id === issueId);
    if (issue) {
        localStorage.setItem('selected_issue', JSON.stringify(issue));
        window.location.href = 'issue-detail.html';
    }
}

function handleReportSubmission() {
    // Get form data
    const category = document.querySelector('.category-section select').value;
    const description = document.querySelector('.description-section textarea').value;
    const anonymous = document.querySelector('#anonymous').checked;
    
    if (!category || !description.trim()) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    // Create new issue
    const newIssue = {
        id: mockIssues.length + 1,
        title: description.split(' ').slice(0, 5).join(' ') + '...',
        description: description,
        category: category,
        status: 'reported',
        location: 'Current Location',
        reporter: anonymous ? 'Anonymous' : 'Current User',
        timestamp: new Date(),
        images: [],
        coordinates: { lat: 40.7128, lng: -74.0060 }
    };
    
    // Add to mock data
    mockIssues.unshift(newIssue);
    
    // Reset form
    document.querySelector('.category-section select').value = '';
    document.querySelector('.description-section textarea').value = '';
    document.querySelector('#anonymous').checked = false;
    
    // Show success message
    showAlert('Issue reported successfully!', 'success');
    
    // Refresh results
    searchResults = [...mockIssues];
    renderSearchResults();
}

function showSearchNotification(count) {
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        Found ${count} issue${count !== 1 ? 's' : ''} matching your criteria
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(66, 153, 225, 0.9)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '25px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '9999',
        animation: 'fadeInOut 3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    Object.assign(alert.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#38a169' : '#e53e3e',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(alert), 300);
    }, 3000);
}

// Add styles for search results
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-results-header {
        margin: 20px 0;
        padding: 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .search-results-header h3 {
        color: white;
        font-size: 1.2rem;
    }
    
    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .result-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .result-card:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .result-icon {
        width: 40px;
        height: 40px;
        background: rgba(66, 153, 225, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4299e1;
        font-size: 1.2rem;
    }
    
    .result-status {
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .result-status.reported { background: rgba(229, 62, 62, 0.8); }
    .result-status.in-progress { background: rgba(221, 107, 32, 0.8); }
    .result-status.resolved { background: rgba(56, 161, 105, 0.8); }
    
    .result-content h4 {
        color: white;
        margin-bottom: 8px;
        font-size: 1.1rem;
    }
    
    .result-content p {
        color: #cbd5e0;
        font-size: 0.9rem;
        line-height: 1.4;
        margin-bottom: 12px;
    }
    
    .result-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #a0aec0;
    }
    
    .no-results {
        text-align: center;
        padding: 60px 20px;
        color: #a0aec0;
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .no-results h3 {
        font-size: 1.3rem;
        margin-bottom: 10px;
        color: white;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(searchStyles);
