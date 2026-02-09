// DOM Elements
const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Tab Switching
loginTabBtn.addEventListener('click', () => {
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerTabBtn.addEventListener('click', () => {
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Validate Mobile Number
function isValidMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

// Show Message
function showMessage(message, type = 'success') {
    alert(message); // Simple alert for now
}

// Login Form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const mobile = document.getElementById('loginMobile').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!isValidMobile(mobile)) {
        showMessage('Please enter 10-digit mobile number', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be 6+ characters', 'error');
        return;
    }
    
    // Convert mobile to email format
    const email = mobile + '@rudrakshmatka.com';
    
    try {
        // Login with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        showMessage('Login successful! Welcome to Rudraksh Family!');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            showMessage('Account not found. Please register first.', 'error');
        } else if (error.code === 'auth/wrong-password') {
            showMessage('Wrong password. Try again.', 'error');
        } else {
            showMessage('Login error: ' + error.message, 'error');
        }
    }
});

// Register Form
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validation
    if (name.length < 3) {
        showMessage('Enter valid name (3+ letters)', 'error');
        return;
    }
    
    if (!isValidMobile(mobile)) {
        showMessage('Enter 10-digit mobile number', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be 6+ characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (!document.getElementById('agree').checked) {
        showMessage('Please agree to Terms & Conditions', 'error');
        return;
    }
    
    const email = mobile + '@rudrakshmatka.com';
    
    try {
        // Create user in Firebase
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        await user.updateProfile({
            displayName: name
        });
        
        showMessage('Registration successful! Welcome ' + name + ' to Rudraksh Family!');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 3000);
        
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showMessage('Mobile number already registered. Please login.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showMessage('Password too weak. Use stronger password.', 'error');
        } else {
            showMessage('Registration error: ' + error.message, 'error');
        }
    }
});

// Check if user already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'dashboard.html';
    }
});
