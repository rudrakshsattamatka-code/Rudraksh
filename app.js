// ============================================
// app.js - Rudraksh Satta Matka
// Complete Firebase Authentication Logic
// ============================================

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. INITIALIZE FIREBASE
    // ============================================
    
    // Your Firebase configuration - make sure this matches your firebase-config.js
    const firebaseConfig = {
        apiKey: "AIzaSyDVxg4EZHm4D2zMrz_ndLzcqx3wkhdPdVc",
        authDomain: "rudraksh-d74c3.firebaseapp.com",
        projectId: "rudraksh-d74c3",
        storageBucket: "rudraksh-d74c3.firebasestorage.app",
        messagingSenderId: "270620722307",
        appId: "1:270620722307:web:5a6454b69e12c201f6c7b6"
    };
    
    // Initialize Firebase (this is for safety, but you should also have it in firebase-config.js)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Get Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore(); // For saving user data
    
    console.log("Firebase initialized successfully!");
    
    // ============================================
    // 2. DOM ELEMENTS
    // ============================================
    
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const notification = document.getElementById('notification');
    
    // Login form elements
    const loginMobile = document.getElementById('loginMobile');
    const loginPassword = document.getElementById('loginPassword');
    
    // Register form elements
    const regName = document.getElementById('regName');
    const regMobile = document.getElementById('regMobile');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');
    
    // ============================================
    // 3. TAB SWITCHING
    // ============================================
    
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }
    
    // ============================================
    // 4. NOTIFICATION FUNCTION
    // ============================================
    
    function showNotification(message, type = 'success') {
        if (!notification) return;
        
        notification.textContent = message;
        notification.style.background = type === 'error' ? '#f44336' : '#4CAF50';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    }
    
    // ============================================
    // 5. VALIDATION FUNCTIONS
    // ============================================
    
    function isValidMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile);
    }
    
    function isValidName(name) {
        return name.length >= 3 && /^[a-zA-Z\s]+$/.test(name);
    }
    
    // ============================================
    // 6. LOGIN FUNCTION
    // ============================================
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mobile = loginMobile.value.trim();
            const password = loginPassword.value;
            
            // Validation
            if (!isValidMobile(mobile)) {
                showNotification('Please enter a valid 10-digit mobile number', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Convert mobile to email format
            const email = mobile + '@rudrakshmatka.com';
            
            try {
                showNotification('Logging in...', 'success');
                
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                
                showNotification('Welcome back! Redirecting...', 'success');
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                
            } catch (error) {
                console.error('Login error:', error);
                
                if (error.code === 'auth/user-not-found') {
                    showNotification('Account not found. Please register first.', 'error');
                } else if (error.code === 'auth/wrong-password') {
                    showNotification('Incorrect password.', 'error');
                } else if (error.code === 'auth/invalid-credential') {
                    showNotification('Invalid login credentials.', 'error');
                } else {
                    showNotification('Login failed. Please try again.', 'error');
                }
            }
        });
    }
    
    // ============================================
    // 7. REGISTRATION FUNCTION (FIXED - SAVES NAME)
    // ============================================
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = regName.value.trim();
            const mobile = regMobile.value.trim();
            const password = regPassword.value;
            const confirmPassword = regConfirmPassword.value;
            
            // Validation
            if (!isValidName(name)) {
                showNotification('Please enter a valid name (minimum 3 letters, no numbers)', 'error');
                return;
            }
            
            if (!isValidMobile(mobile)) {
                showNotification('Please enter a valid 10-digit mobile number', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!agreeTerms.checked) {
                showNotification('Please agree to the Terms & Conditions', 'error');
                return;
            }
            
            // Convert mobile to email format
            const email = mobile + '@rudrakshmatka.com';
            
            try {
                showNotification('Creating your account...', 'success');
                
                // 1. CREATE USER WITH EMAIL/PASSWORD
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // 2. UPDATE USER PROFILE WITH NAME
                await user.updateProfile({
                    displayName: name
                });
                
                // 3. SAVE USER DATA TO FIRESTORE DATABASE
                await db.collection('users').doc(user.uid).set({
                    fullName: name,
                    mobileNumber: mobile,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    accountType: 'premium',
                    status: 'active'
                });
                
                showNotification(`Welcome ${name} to Rudraksh Family! 🎉`, 'success');
                
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
                
            } catch (error) {
                console.error('Registration error:', error);
                
                if (error.code === 'auth/email-already-in-use') {
                    showNotification('This mobile number is already registered. Please login.', 'error');
                } else if (error.code === 'auth/weak-password') {
                    showNotification('Password is too weak. Use a stronger password.', 'error');
                } else if (error.code === 'auth/network-request-failed') {
                    showNotification('Network error. Check your internet connection.', 'error');
                } else {
                    showNotification('Registration failed: ' + error.message, 'error');
                }
            }
        });
    }
    
    // ============================================
    // 8. FORGOT PASSWORD FUNCTION
    // ============================================
    
    function forgotPassword() {
        const mobile = prompt('Enter your registered mobile number:');
        
        if (mobile && isValidMobile(mobile)) {
            const email = mobile + '@rudrakshmatka.com';
            
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    showNotification('Password reset link sent! Check your email.', 'success');
                })
                .catch((error) => {
                    showNotification('Error: ' + error.message, 'error');
                });
        } else if (mobile) {
            showNotification('Please enter a valid 10-digit number', 'error');
        }
    }
    
    // Add forgot password link to login form
    if (document.querySelector('.help-text')) {
        const forgotLink = document.createElement('p');
        forgotLink.innerHTML = `<a href="#" onclick="forgotPassword()" style="color: #2196F3; cursor: pointer;">Forgot Password?</a>`;
        forgotLink.style.marginTop = '10px';
        forgotLink.style.textAlign = 'center';
        document.querySelector('.help-text').appendChild(forgotLink);
    }
    
    // ============================================
    // 9. CHECK IF USER IS ALREADY LOGGED IN
    // ============================================
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });
    
    // ============================================
    // 10. ADD PASSWORD VISIBILITY TOGGLE
    // ============================================
    
    // Add eye icon to password fields
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const parent = input.parentElement;
        const toggleBtn = document.createElement('span');
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.style.cssText = 'cursor: pointer; color: #666; margin-left: 10px; font-size: 0.9rem;';
        
        toggleBtn.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
        
        parent.appendChild(toggleBtn);
    });
    
    // ============================================
    // 11. INPUT VALIDATION HELPERS
    // ============================================
    
    // Mobile number input validation (only numbers, max 10)
    const mobileInputs = document.querySelectorAll('input[type="text"]');
    mobileInputs.forEach(input => {
        if (input.id.includes('Mobile')) {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });
        }
    });
    
    // Name input validation (only letters and spaces)
    if (regName) {
        regName.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }
    
    // ============================================
    // 12. INITIAL FOCUS ON FIRST INPUT
    // ============================================
    
    setTimeout(() => {
        const firstInput = document.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 500);
    
    console.log("Rudraksh Matka app initialized successfully!");
});
