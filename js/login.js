// Simple login functionality without popups

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const userMenuBtn = document.getElementById('userMenuBtn');
const userName = document.getElementById('userName');

// Simulated user state (in a real app, this would come from a backend/Firebase)
let currentUser = null;

// Check if user is logged in (check localStorage)
function checkLoginState() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    updateUI();
  } else {
    loginBtn.classList.remove('hidden');
  }
}

// Update UI based on login state
function updateUI() {
  if (currentUser) {
    loginBtn.classList.add('hidden');
    userMenuBtn.classList.remove('hidden');
    userName.textContent = currentUser.name || currentUser.email;
  } else {
    loginBtn.classList.remove('hidden');
    userMenuBtn.classList.add('hidden');
  }
}

// Login button click - redirect to login page or show simple prompt
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    // Simple prompt-based login (no popup)
    const email = prompt('E-post:');
    if (email && email.trim()) {
      const name = prompt('Navn (valgfritt):') || email.split('@')[0];
      
      // Store user
      currentUser = { email, name };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Update UI
      updateUI();
    }
  });
}

// User menu button - show logout option
if (userMenuBtn) {
  userMenuBtn.addEventListener('click', () => {
    const shouldLogout = confirm('Vil du logge ut?');
    if (shouldLogout) {
      currentUser = null;
      localStorage.removeItem('user');
      updateUI();
    }
  });
}

// Check login state on page load
checkLoginState();
