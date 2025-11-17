// Login functionality with Firebase

// Firebase config
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

// Enable persistence
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

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
const githubLoginBtn = document.getElementById('githubLoginBtn');

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
});

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
    await auth.createUserWithEmailAndPassword(email, password);
    closeLoginPanel();
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
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
    await auth.signInWithPopup(provider);
    closeLoginPanel();
  } catch (error) {
    showError('Google-innlogging feilet: ' + error.message);
  }
});

// GitHub Login
githubLoginBtn.addEventListener('click', async () => {
  const provider = new firebase.auth.GithubAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    closeLoginPanel();
  } catch (error) {
    showError('GitHub-innlogging feilet: ' + error.message);
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
logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
    userMenu.classList.add('hidden');
  } catch (error) {
    console.error('Logout error:', error);
  }
});
