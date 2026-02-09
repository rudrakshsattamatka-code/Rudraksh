// SIMPLE app.js - Just saves name to user profile
document.addEventListener('DOMContentLoaded', function() {
    
    // Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyDVxg4EZHm4D2zMrz_ndLzcqx3wkhdPdVc",
        authDomain: "rudraksh-d74c3.firebaseapp.com",
        projectId: "rudraksh-d74c3",
        storageBucket: "rudraksh-d74c3.firebasestorage.app",
        messagingSenderId: "270620722307",
        appId: "1:270620722307:web:5a6454b69e12c201f6c7b6"
    };
    
    // Initialize
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    
    // Tab switching
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
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
    
    // Notification
    const notification = document.getElementById('notification');
    function showNotification(msg, type = 'success') {
        if (notification) {
            notification.textContent = msg;
            notification.style.background = type === 'error' ? '#f44336' : '#4CAF50';
            notification.style.display = 'block';
            setTimeout(() => { notification.style.display = 'none'; }, 4000);
        } else {
            alert(msg); // Fallback if notification element doesn't exist
        }
    }
    
    // Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName').value.trim();
            const mobile = document.getElementById('regMobile').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validation
            if (name.length < 3) {
                showNotification('Name must be 3+ letters', 'error');
                return;
            }
            
            if (!/^[0-9]{10}$/.test(mobile)) {
                showNotification('Enter 10-digit mobile', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password 6+ characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords not match', 'error');
                return;
            }
            
            if (!document.getElementById('agreeTerms').checked) {
                showNotification('Agree to terms', 'error');
                return;
            }
            
            const email = mobile + '@rudrakshmatka.com';
            
            try {
                showNotification('Creating account...', 'success');
                
                // 1. CREATE USER
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // 2. SAVE NAME TO PROFILE
                await user.updateProfile({
                    displayName: name
                });
                
                showNotification(`Welcome ${name}! Name saved.`, 'success');
                
                // 3. REDIRECT
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
                
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    showNotification('Mobile already registered', 'error');
                } else {
                    showNotification('Error: ' + error.message, 'error');
                }
            }
        });
    }
    
    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mobile = document.getElementById('loginMobile').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!/^[0-9]{10}$/.test(mobile)) {
                showNotification('Enter 10-digit mobile', 'error');
                return;
            }
            
            const email = mobile + '@rudrakshmatka.com';
            
            try {
                showNotification('Logging in...', 'success');
                await auth.signInWithEmailAndPassword(email, password);
                showNotification('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } catch (error) {
                showNotification('Login failed: ' + error.message, 'error');
            }
        });
    }
    
    // Check if already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("User logged in:", user.displayName);
            window.location.href = 'dashboard.html';
        }
    });
});
