// Login functionality

// Mock user database (in production, this would be a real backend)
const VALID_USERS = [
  { email: 'test@example.com', password: 'password123', name: 'Test User' },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin' },
];

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const userMenuBtn = document.getElementById('userMenuBtn');
const loginPanel = document.getElementById('loginPanel');
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const loginCancel = document.getElementById('loginCancel');
const loginError = document.getElementById('loginError');
const userMenu = document.getElementById('userMenu');
const userMenuBtn2 = document.getElementById('userMenuBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const menuUserName = document.getElementById('menuUserName');
const menuUserEmail = document.getElementById('menuUserEmail');

// Get current user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Save user to localStorage
function saveCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Update UI based on login status
function updateUI() {
  const user = getCurrentUser();
  
  if (user) {
    loginBtn.classList.add('hidden');
    userMenuBtn.classList.remove('hidden');
    userName.textContent = user.name;
    menuUserName.textContent = user.name;
    menuUserEmail.textContent = user.email;
  } else {
    loginBtn.classList.remove('hidden');
    userMenuBtn.classList.add('hidden');
    userMenu.classList.add('hidden');
  }
}

// Open login panel
loginBtn.addEventListener('click', () => {
  loginPanel.classList.remove('hidden');
  loginError.classList.add('hidden');
  loginForm.reset();
});

// Close login panel
function closeLoginPanel() {
  loginPanel.classList.add('hidden');
  loginForm.reset();
  loginError.classList.add('hidden');
}

loginCancel.addEventListener('click', closeLoginPanel);
loginOverlay.addEventListener('click', closeLoginPanel);

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Check credentials
  const user = VALID_USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Save user and update UI
    saveCurrentUser({ email: user.email, name: user.name });
    updateUI();
    closeLoginPanel();
    console.log('Logg inn vellykket:', user.name);
  } else {
    // Show error
    loginError.textContent = 'E-post eller passord er feil';
    loginError.classList.remove('hidden');
  }
});

// User menu dropdown
userMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  userMenu.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
    userMenu.classList.add('hidden');
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  updateUI();
  userMenu.classList.add('hidden');
  console.log('Logg ut vellykket');
});

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', updateUI);
