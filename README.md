# odoo-hackathon-R1
<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# CivicTrack - Community Issue Reporting System

## Overview

CivicTrack is a modern web application that enables citizens to report and track local civic issues such as potholes, broken streetlights, water leaks, and other community problems. Built with HTML5, CSS3, and vanilla JavaScript.

## Features

### 🏠 **Core Functionality**

- **Issue Reporting**: Submit detailed reports with photos, location, and priority levels
- **Status Tracking**: Real-time timeline showing issue progression from reported to resolved
- **User Authentication**: Login/registration system for personalized experience


### 🔍 **Advanced Filtering \& Search**

- **Category Filters**: Roads, Lighting, Water Supply, Cleanliness, Public Safety, Obstructions
- **Status Filters**: Reported, In Progress, Resolved
- **Distance Filters**: 1km, 3km, 5km radius based on GPS location
- **Interactive Map**: Visual representation of issues as color-coded pins


### 📱 **User Experience**

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Photo Upload**: Support for up to 3 images per report
- **Location Detection**: Automatic GPS-based location detection with manual override


## File Structure

```
CivicTrack/
├── HTML/
│   ├── index.html          # Landing page
│   ├── login.html          # User login
│   ├── register.html       # User registration  
│   ├── dashboard.html      # Main issues dashboard
│   ├── search.html         # Search & filter page
│   ├── issue-detail.html   # Individual issue details
│   └── report.html         # New issue reporting form
├── CSS/
│   ├── style.css           # Global styles
│   ├── dashboard.css       # Dashboard-specific styles
│   ├── search.css          # Search page styles
│   ├── issue-detail.css    # Issue detail page styles
│   └── report.css          # Report form styles
└── README.md
```


## Quick Start

1. **Clone or download** the project files
2. **Open `HTML/index.html`** in your web browser
3. **Navigate** through the application using the intuitive interface
4. **Register/Login** to report and track issues
5. **Use filters** to find specific issues by category, status, or distance

## Key Pages

- **Landing Page**: Introduction and feature overview
- **Dashboard**: Grid view of all reported issues with pagination
- **Search \& Filter**: Advanced filtering with interactive map
- **Issue Details**: Comprehensive issue information with timeline
- **Report Form**: Multi-step form for submitting new issues


## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Inter font family, Font Awesome icons
- **Features**: Local storage for data persistence, Geolocation API
- **Design**: Modern gradient backgrounds, responsive grid layouts


## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+


## Demo Data

The application includes mock data with 6 sample issues across different categories and statuses for demonstration purposes.

**Built for communities, by developers who care about civic engagement.**

