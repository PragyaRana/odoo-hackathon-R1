// Mock data for the application
const mockIssues = [
    {
        id: 1,
        title: "Streetlight not working",
        description: "Street light has been non-functional for 3 days, causing safety concerns for pedestrians.",
        category: "lighting",
        status: "in-progress",
        location: "Main Street, Downtown",
        reporter: "Anonymous",
        timestamp: new Date(Date.now() - 86400000 * 3),
        images: ["streetlight1.jpg"],
        coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
        id: 2,
        title: "Pothole on main road",
        description: "Large pothole causing damage to vehicles and creating traffic issues.",
        category: "roads",
        status: "reported",
        location: "Oak Avenue & 5th Street",
        reporter: "John Doe",
        timestamp: new Date(Date.now() - 86400000 * 1),
        images: ["pothole1.jpg", "pothole2.jpg"],
        coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
        id: 3,
        title: "Garbage not collected",
        description: "Garbage bins overflowing for over a week, attracting pests and creating unsanitary conditions.",
        category: "cleanliness",
        status: "in-progress",
        location: "Residential Area, Block C",
        reporter: "Jane Smith",
        timestamp: new Date(Date.now() - 86400000 * 7),
        images: ["garbage1.jpg"],
        coordinates: { lat: 40.7282, lng: -74.0776 }
    },
    {
        id: 4,
        title: "Water leak on sidewalk",
        description: "Continuous water leak from underground pipe causing flooding on sidewalk.",
        category: "water",
        status: "resolved",
        location: "Park Avenue",
        reporter: "Mike Johnson",
        timestamp: new Date(Date.now() - 86400000 * 14),
        images: [],
        coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    {
        id: 5,
        title: "Broken street sign",
        description: "Stop sign damaged and unclear, creating potential traffic hazard.",
        category: "safety",
        status: "reported",
        location: "Intersection of Elm & Pine",
        reporter: "Anonymous",
        timestamp: new Date(Date.now() - 86400000 * 2),
        images: ["sign1.jpg"],
        coordinates: { lat: 40.7308, lng: -73.9973 }
    },
    {
        id: 6,
        title: "Tree blocking pathway",
        description: "Fallen tree after storm blocking pedestrian walkway in the park.",
        category: "obstructions",
        status: "in-progress",
        location: "Central Park East Side",
        reporter: "Park Visitor",
        timestamp: new Date(Date.now() - 86400000 * 4),
        images: ["tree1.jpg", "tree2.jpg"],
        coordinates: { lat: 40.7829, lng: -73.9654 }
    }
];

// Category configurations
const issueCategories = {
    roads: { label: "Roads", icon: "fas fa-road", color: "#e53e3e" },
    lighting: { label: "Lighting", icon: "fas fa-lightbulb", color: "#dd6b20" },
    water: { label: "Water Supply", icon: "fas fa-tint", color: "#4299e1" },
    cleanliness: { label: "Cleanliness", icon: "fas fa-trash", color: "#38a169" },
    safety: { label: "Public Safety", icon: "fas fa-exclamation-triangle", color: "#e53e3e" },
    obstructions: { label: "Obstructions", icon: "fas fa-tree", color: "#2d3748" }
};

// Status configurations
const issueStatuses = {
    reported: { label: "Reported", color: "#e53e3e" },
    "in-progress": { label: "In Progress", color: "#dd6b20" },
    resolved: { label: "Resolved", color: "#38a169" }
};

// Helper functions
function getCategoryInfo(category) {
    return issueCategories[category] || { label: category, icon: "fas fa-question", color: "#718096" };
}

function getStatusInfo(status) {
    return issueStatuses[status] || { label: status, color: "#718096" };
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
}
