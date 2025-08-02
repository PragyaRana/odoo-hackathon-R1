// Report functionality
let uploadedPhotos = [];
let currentStep = 1;
let isDraftSaved = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeReport();
    setupEventListeners();
    loadDraft();
});

function initializeReport() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('civictrack_user') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Detect location on page load
    detectUserLocation();
    
    // Update progress
    updateProgress();
}

function setupEventListeners() {
    // Form field changes
    document.getElementById('issue-title').addEventListener('input', handleTitleChange);
    document.getElementById('issue-description').addEventListener('input', handleDescriptionChange);
    document.getElementById('issue-category').addEventListener('change', updateProgress);
    document.getElementById('issue-location').addEventListener('change', updateProgress);
    
    // Photo upload
    document.getElementById('issue-photos').addEventListener('change', handlePhotoUpload);
    
    // Location detection
    document.getElementById('detect-location').addEventListener('click', detectUserLocation);
    document.getElementById('manual-location').addEventListener('click', enableManualLocation);
    
    // Anonymous reporting toggle
    document.getElementById('anonymous-report').addEventListener('change', toggleContactInfo);
    
    // Form submission
    document.getElementById('report-form').addEventListener('submit', handleReportSubmit);
    
    // Save draft
    document.getElementById('save-draft').addEventListener('click', saveDraft);
    
    // Auto-save draft every 30 seconds
    setInterval(autoSaveDraft, 30000);
}

function handleTitleChange(e) {
    const title = e.target.value;
    const counter = e.target.parentElement.querySelector('.char-counter');
    counter.textContent = `${title.length}/100`;
    
    if (title.length > 90) {
        counter.style.color = '#e53e3e';
    } else if (title.length > 70) {
        counter.style.color = '#dd6b20';
    } else {
        counter.style.color = '#a0aec0';
    }
    
    updateProgress();
}

function handleDescriptionChange(e) {
    const description = e.target.value;
    const counter = e.target.parentElement.querySelector('.char-counter');
    counter.textContent = `${description.length}/500`;
    
    if (description.length > 450) {
        counter.style.color = '#e53e3e';
    } else if (description.length > 350) {
        counter.style.color = '#dd6b20';
    } else {
        counter.style.color = '#a0aec0';
    }
    
    updateProgress();
}

function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    const maxFiles = 3;
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Filter valid files
    const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
            showAlert('Please select only image files.', 'error');
            return false;
        }
        if (file.size > maxSize) {
            showAlert(`${file.name} is too large. Maximum size is 5MB.`, 'error');
            return false;
        }
        return true;
    });
    
    // Limit to 3 files
    if (uploadedPhotos.length + validFiles.length > maxFiles) {
        const allowedCount = maxFiles - uploadedPhotos.length;
        validFiles.splice(allowedCount);
        showAlert(`Maximum ${maxFiles} photos allowed. Only first ${allowedCount} selected.`, 'warning');
    }
    
    // Process files
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoObj = {
                id: Date.now() + Math.random(),
                file: file,
                dataUrl: e.target.result,
                name: file.name,
                size: file.size
            };
            
            uploadedPhotos.push(photoObj);
            renderPhotoPreview();
            updateProgress();
        };
        reader.readAsDataURL(file);
    });
    
    // Clear input
    e.target.value = '';
}

function renderPhotoPreview() {
    const previewContainer = document.getElementById('photo-preview');
    
    previewContainer.innerHTML = uploadedPhotos.map(photo => `
        <div class="photo-preview-item">
            <img src="${photo.dataUrl}" alt="${photo.name}">
            <button type="button" class="photo-remove" onclick="removePhoto('${photo.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    renderPhotoPreview();
    updateProgress();
}

function detectUserLocation() {
    const locationInput = document.getElementById('issue-location');
    const locationStatus = document.getElementById('location-status');
    const detectBtn = document.getElementById('detect-location');
    
    // Update UI
    detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
    detectBtn.disabled = true;
    locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Detecting your location...</span>';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mock reverse geocoding
                const mockAddress = `${Math.floor(Math.random() * 1000)} Main Street, Downtown District`;
                locationInput.value = mockAddress;
                locationInput.readOnly = true;
                
                locationStatus.className = 'location-status success';
                locationStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Location detected successfully</span>';
                
                detectBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect Location';
                detectBtn.disabled = false;
                
                updateProgress();
            },
            (error) => {
                console.error('Geolocation error:', error);
                locationStatus.className = 'location-status error';
                locationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Could not detect location. Please enter manually.</span>';
                
                detectBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect Location';
                detectBtn.disabled = false;
                
                enableManualLocation();
            }
        );
    } else {
        locationStatus.className = 'location-status error';
        locationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Geolocation not supported. Please enter manually.</span>';
        
        detectBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect Location';
        detectBtn.disabled = false;
        
        enableManualLocation();
    }
}

function enableManualLocation() {
    const locationInput = document.getElementById('issue-location');
    const locationStatus = document.getElementById('location-status');
    
    locationInput.readOnly = false;
    locationInput.placeholder = 'Enter the exact location of the issue';
    locationInput.focus();
    
    locationStatus.className = 'location-status';
    locationStatus.innerHTML = '<i class="fas fa-info-circle"></i> <span>Please enter the specific location where the issue is located</span>';
}

function toggleContactInfo() {
    const contactInfo = document.getElementById('contact-info');
    const isAnonymous = document.getElementById('anonymous-report').checked;
    
    contactInfo.style.display = isAnonymous ? 'none' : 'block';
}

function updateProgress() {
    const title = document.getElementById('issue-title').value.trim();
    const category = document.getElementById('issue-category').value;
    const description = document.getElementById('issue-description').value.trim();
    const location = document.getElementById('issue-location').value.trim();
    
    // Update step completion
    updateStepStatus(1, title && category);
    updateStepStatus(2, description.length >= 20);
    updateStepStatus(3, location.length > 0);
    updateStepStatus(4, title && category && description.length >= 20 && location);
    
    // Update active step
    if (!title || !category) {
        setActiveStep(1);
    } else if (description.length < 20) {
        setActiveStep(2);
    } else if (!location) {
        setActiveStep(3);
    } else {
        setActiveStep(4);
    }
}

function updateStepStatus(stepNumber, isCompleted) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (isCompleted) {
        step.classList.add('completed');
    } else {
        step.classList.remove('completed');
    }
}

function setActiveStep(stepNumber) {
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const activeStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (activeStep) {
        activeStep.classList.add('active');
    }
    
    currentStep = stepNumber;
}

function saveDraft() {
    const formData = getFormData();
    localStorage.setItem('civictrack_draft', JSON.stringify({
        ...formData,
        savedAt: new Date().toISOString(),
        photos: uploadedPhotos.map(photo => ({
            id: photo.id,
            name: photo.name,
            dataUrl: photo.dataUrl
        }))
    }));
    
    isDraftSaved = true;
    showAlert('Draft saved successfully!', 'success');
}

function autoSaveDraft() {
    if (hasFormData() && !isDraftSaved) {
        saveDraft();
    }
}

function loadDraft() {
    const draft = JSON.parse(localStorage.getItem('civictrack_draft') || 'null');
    if (!draft) return;
    
    // Show draft notification
    const notification = document.createElement('div');
    notification.className = 'draft-notification';
    notification.innerHTML = `
        <div class="draft-content">
            <i class="fas fa-info-circle"></i>
            <span>You have a saved draft from ${new Date(draft.savedAt).toLocaleDateString()}</span>
            <div class="draft-actions">
                <button onclick="restoreDraft()" class="btn-link">Restore</button>
                <button onclick="deleteDraft()" class="btn-link">Delete</button>
                <button onclick="closeDraftNotification()" class="btn-link">&times;</button>
            </div>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: '#4299e1',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 5px 25px rgba(66, 153, 225, 0.3)',
        zIndex: '1000',
        maxWidth: '350px'
    });
    
    document.body.appendChild(notification);
    
    // Store draft globally for restoration
    window.currentDraft = draft;
}

function restoreDraft() {
    const draft = window.currentDraft;
    if (!draft) return;
    
    // Restore form fields
    document.getElementById('issue-title').value = draft.title || '';
    document.getElementById('issue-category').value = draft.category || '';
    document.getElementById('issue-description').value = draft.description || '';
    document.getElementById('issue-location').value = draft.location || '';
    document.getElementById('anonymous-report').checked = draft.anonymous || false;
    document.getElementById('follow-updates').checked = draft.followUpdates || false;
    
    if (draft.contactPhone) document.getElementById('contact-phone').value = draft.contactPhone;
    if (draft.contactEmail) document.getElementById('contact-email').value = draft.contactEmail;
    
    // Restore priority
    if (draft.priority) {
        document.querySelector(`input[name="priority"][value="${draft.priority}"]`).checked = true;
    }
    
    // Restore photos
    if (draft.photos) {
        uploadedPhotos = draft.photos.map(photo => ({
            ...photo,
            file: null // File object cannot be restored
        }));
        renderPhotoPreview();
    }
    
    // Update UI
    toggleContactInfo();
    updateProgress();
    handleTitleChange({ target: document.getElementById('issue-title') });
    handleDescriptionChange({ target: document.getElementById('issue-description') });
    
    closeDraftNotification();
    showAlert('Draft restored successfully!', 'success');
}

function deleteDraft() {
    localStorage.removeItem('civictrack_draft');
    closeDraftNotification();
    showAlert('Draft deleted.', 'info');
}

function closeDraftNotification() {
    const notification = document.querySelector('.draft-notification');
    if (notification) {
        notification.remove();
    }
}

function handleReportSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    // Validation
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
        // Generate issue ID
        const issueId = Math.floor(Math.random() * 9000) + 1000;
        
        // Clear draft
        localStorage.removeItem('civictrack_draft');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        document.getElementById('issue-id').textContent = `#${issueId}`;
        document.getElementById('success-modal').style.display = 'block';
        
    }, 2000);
}

function getFormData() {
    return {
        title: document.getElementById('issue-title').value.trim(),
        category: document.getElementById('issue-category').value,
        description: document.getElementById('issue-description').value.trim(),
        location: document.getElementById('issue-location').value.trim(),
        priority: document.querySelector('input[name="priority"]:checked')?.value || 'low',
        anonymous: document.getElementById('anonymous-report').checked,
        followUpdates: document.getElementById('follow-updates').checked,
        contactPhone: document.getElementById('contact-phone')?.value.trim() || '',
        contactEmail: document.getElementById('contact-email')?.value.trim() || ''
    };
}

function hasFormData() {
    const formData = getFormData();
    return formData.title || formData.description || formData.location || uploadedPhotos.length > 0;
}

function validateForm(formData) {
    if (!formData.title) {
        showAlert('Please enter an issue title.', 'error');
        document.getElementById('issue-title').focus();
        return false;
    }
    
    if (!formData.category) {
        showAlert('Please select an issue category.', 'error');
        document.getElementById('issue-category').focus();
        return false;
    }
    
    if (formData.description.length < 20) {
        showAlert('Please provide a more detailed description (at least 20 characters).', 'error');
        document.getElementById('issue-description').focus();
        return false;
    }
    
    if (!formData.location) {
        showAlert('Please provide the issue location.', 'error');
        document.getElementById('issue-location').focus();
        return false;
    }
    
    return true;
}

function reportAnother() {
    // Reset form
    document.getElementById('report-form').reset();
    uploadedPhotos = [];
    renderPhotoPreview();
    updateProgress();
    
    // Close modal
    document.getElementById('success-modal').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        ${message}
    `;
    
    Object.assign(alert.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getAlertColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px'
    });
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(alert), 300);
    }, 4000);
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getAlertColor(type) {
    const colors = {
        success: '#38a169',
        error: '#e53e3e',
        warning: '#dd6b20',
        info: '#4299e1'
    };
    return colors[type] || '#4299e1';
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Add styles for draft notification
const draftStyles = document.createElement('style');
draftStyles.textContent = `
    .draft-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .draft-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 5px;
    }
    
    .btn-link {
        background: none;
        border: none;
        color: white;
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0;
    }
    
    .btn-link:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(draftStyles);
