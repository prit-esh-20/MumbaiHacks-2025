// API Base URL
const API_BASE_URL = '/api';

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const dashboardModal = document.getElementById('dashboard-modal');
const closeButtons = document.querySelectorAll('.close');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');
const recommendationForm = document.getElementById('recommendation-form');
const addMemberBtn = document.getElementById('add-member');
const familyMembersContainer = document.getElementById('family-members');
const recommendationsList = document.getElementById('recommendations-list');

// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 3 seconds
    setTimeout(function() {
        loadingScreen.classList.add('hidden');
    }, 3000);
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Modal functionality
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(signupModal);
            closeModal(dashboardModal);
        });
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) closeModal(loginModal);
        if (event.target === signupModal) closeModal(signupModal);
        if (event.target === dashboardModal) closeModal(dashboardModal);
    });
    
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    recommendationForm.addEventListener('submit', handleRecommendation);
    
    addMemberBtn.addEventListener('click', addFamilyMember);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
        
        // Animate bar graphs when they come into view
        const graphBars = document.querySelectorAll('.graph-bar');
        graphBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition) {
                bar.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize animations
    animateOnScroll();
    
    // Counter animation for market stats
    const animateCounters = function() {
        const counters = document.querySelectorAll('.stat-value');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 100;
            
            let current = 0;
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.innerText = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };
            
            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };
    
    animateCounters();
    
    // Form submission for contact form
    const contactForm = document.getElementById('access-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            // Show success message
            alert(`Thank you ${name}! We've received your request for early access. We'll contact you at ${email} soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Add animation classes to elements that should animate on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const elements = section.querySelectorAll('h2, h3, p, .feature-card, .step, .team-member, .stat');
        elements.forEach(element => {
            if (!element.classList.contains('animate-on-scroll')) {
                element.classList.add('animate-on-scroll');
            }
        });
    });
    
    // Prototype flow animation
    const flowNodes = document.querySelectorAll('.flow-node');
    let currentIndex = 0;
    
    const animateFlow = function() {
        flowNodes.forEach((node, index) => {
            if (index === currentIndex) {
                node.style.background = '#10b981';
                node.style.transform = 'scale(1.05)';
            } else {
                node.style.background = '#1e3a8a';
                node.style.transform = 'scale(1)';
            }
        });
        
        currentIndex = (currentIndex + 1) % flowNodes.length;
    };
    
    // Start flow animation
    setInterval(animateFlow, 2000);
    
    // Initialize first animation
    animateFlow();
});

// Modal functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Close modal and open dashboard
            closeModal(loginModal);
            openModal(dashboardModal);
            
            // Update UI
            updateDashboardUser(data.user);
            
            // Show success message
            alert('Login successful!');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const phone = document.getElementById('signup-phone').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Close modal and open dashboard
            closeModal(signupModal);
            openModal(dashboardModal);
            
            // Update UI
            updateDashboardUser(data.user);
            
            // Show success message
            alert('Account created successfully!');
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup');
    }
}

function handleLogout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Close dashboard modal
    closeModal(dashboardModal);
    
    // Show success message
    alert('You have been logged out');
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        // User is logged in, update UI
        fetchUserProfile();
    }
}

async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            updateDashboardUser(user);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

function updateDashboardUser(user) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
}

// Recommendation functions
function addFamilyMember() {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'family-member-input';
    memberDiv.innerHTML = `
        <input type="text" placeholder="Name" class="member-name">
        <input type="number" placeholder="Age" class="member-age">
        <select class="member-relationship">
            <option value="self">Self</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
        </select>
        <input type="text" placeholder="Medical History (comma separated)" class="member-history">
    `;
    familyMembersContainer.appendChild(memberDiv);
}

async function handleRecommendation(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to get recommendations');
        openModal(loginModal);
        return;
    }
    
    // Get form data
    const familyMembers = [];
    const memberInputs = document.querySelectorAll('.family-member-input');
    
    memberInputs.forEach(memberDiv => {
        const name = memberDiv.querySelector('.member-name').value;
        const age = memberDiv.querySelector('.member-age').value;
        const relationship = memberDiv.querySelector('.member-relationship').value;
        const history = memberDiv.querySelector('.member-history').value;
        
        if (name && age) {
            familyMembers.push({
                name,
                age: parseInt(age),
                relationship,
                medicalHistory: history ? history.split(',').map(item => item.trim()) : []
            });
        }
    });
    
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    
    if (familyMembers.length === 0) {
        alert('Please add at least one family member');
        return;
    }
    
    if (!city || !state || !pincode) {
        alert('Please fill in all location fields');
        return;
    }
    
    const familyProfile = {
        members: familyMembers,
        location: { city, state, pincode }
    };
    
    try {
        // Show loading state
        const submitBtn = recommendationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Generating Recommendations...';
        submitBtn.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/recommendations/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ familyProfile })
        });
        
        const data = await response.json();
        
        // Restore button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (response.ok) {
            displayRecommendations(data.recommendations);
        } else {
            alert(data.message || 'Failed to generate recommendations');
        }
    } catch (error) {
        console.error('Recommendation error:', error);
        alert('An error occurred while generating recommendations');
        
        // Restore button
        const submitBtn = recommendationForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Get Recommendations';
        submitBtn.disabled = false;
    }
}

function displayRecommendations(recommendations) {
    recommendationsList.innerHTML = '';
    
    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<p>No recommendations found. Please try different criteria.</p>';
        return;
    }
    
    recommendations.forEach(rec => {
        const recCard = document.createElement('div');
        recCard.className = 'recommendation-card';
        recCard.innerHTML = `
            <h4>${rec.planName} by ${rec.provider}</h4>
            <div class="recommendation-details">
                <div class="detail-item">
                    <div class="value">₹${rec.annualPremium.toLocaleString()}</div>
                    <div class="label">Annual Premium</div>
                </div>
                <div class="detail-item">
                    <div class="value">${rec.coverageScore.toFixed(1)}/10</div>
                    <div class="label">Coverage Score</div>
                </div>
                <div class="detail-item">
                    <div class="value">${rec.costScore.toFixed(1)}/10</div>
                    <div class="label">Cost Score</div>
                </div>
            </div>
            <div class="reason">
                <strong>Why this plan:</strong> ${rec.reason}
            </div>
            <div class="savings">
                Estimated Annual Savings: ₹${rec.savings.toLocaleString()}
            </div>
        `;
        recommendationsList.appendChild(recCard);
    });
}