// Login functionality with Firebase

// Firebase config - VIKTIG: Du må bytte ut disse verdiene med dine egne fra Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDbzkfjsCfIedBpHu62vERaN1dpxbbCCeI",
  authDomain: "campino-2025.firebaseapp.com",
  projectId: "campino-2025",
  storageBucket: "campino-2025.firebasestorage.app",
  messagingSenderId: "858885561098",
  appId: "1:858885561098:web:4298982c728af7023a38f3",
  measurementId: "G-Y4MBKYP7D0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const userMenuBtn = document.getElementById('userMenuBtn');
const loginPanel = document.getElementById('loginPanel');
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const loginCancel = document.getElementById('loginCancel');
const loginError = document.getElementById('loginError');
const userMenu = document.getElementById('userMenu');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const menuUserName = document.getElementById('menuUserName');
const menuUserEmail = document.getElementById('menuUserEmail');
const googleLoginBtn = document.getElementById('googleLoginBtn');

// Update UI based on login status
function updateUI(user) {
  if (user) {
    loginBtn.classList.add('hidden');
    userMenuBtn.classList.remove('hidden');
    const displayName = user.displayName || user.email;
    userName.textContent = displayName;
    menuUserName.textContent = displayName;
    menuUserEmail.textContent = user.email;
  } else {
    loginBtn.classList.remove('hidden');
    userMenuBtn.classList.add('hidden');
    userMenu.classList.add('hidden');
  }
}

// Listen to auth state changes
auth.onAuthStateChanged((user) => {
  updateUI(user);
  // Close login panel when user successfully logs in
  if (user) {
    setTimeout(() => {
      closeLoginPanel();
    }, 100);
  }
});

// Open login panel
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    if (loginPanel) loginPanel.classList.remove('hidden');
    if (loginError) loginError.classList.add('hidden');
    if (loginForm) loginForm.reset();
  });
}

// Close login panel
function closeLoginPanel() {
  const panel = document.getElementById('loginPanel');
  if (panel) {
    panel.classList.add('hidden');
  }
  if (loginForm) {
    loginForm.reset();
  }
  if (loginError) {
    loginError.classList.add('hidden');
  }
}

if (loginCancel) loginCancel.addEventListener('click', closeLoginPanel);
if (loginOverlay) loginOverlay.addEventListener('click', closeLoginPanel);

// Close login panel with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLoginPanel();
  }
});

// Show error message
function showError(message) {
  loginError.textContent = message;
  loginError.classList.remove('hidden');
}

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Try to create new account first
    await auth.createUserWithEmailAndPassword(email, password);
    closeLoginPanel();
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      // If email exists, try to sign in
      try {
        await auth.signInWithEmailAndPassword(email, password);
        closeLoginPanel();
      } catch (signInError) {
        showError('E-post eller passord er feil');
      }
    } else {
      showError(error.message);
    }
  }
});

// Google Login
googleLoginBtn.addEventListener('click', async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    // Force close the panel after successful login
    if (result && result.user) {
      setTimeout(() => {
        closeLoginPanel();
      }, 200);
    }
  } catch (error) {
    // Only show error if it's not a popup closed by user
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      showError('Google-innlogging feilet: ' + error.message);
    }
  }
});

// User menu dropdown
if (userMenuBtn) {
  userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (userMenu) userMenu.classList.toggle('hidden');
  });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (userMenu && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
    userMenu.classList.add('hidden');
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
    if (userMenu) userMenu.classList.add('hidden');
  } catch (error) {
    console.error('Logout error:', error);
  }
});

// Ensure loginPanel is hidden on load
if (loginPanel) {
  loginPanel.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('loginPanel');
  if (panel) {
    panel.classList.add('hidden');
  }
  updateUI(auth.currentUser || null);
});
