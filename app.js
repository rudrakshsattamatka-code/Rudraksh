// WhatsApp Support Function
function openWhatsApp() {
    const message = encodeURIComponent("Hello Rudraksh Matka, I need help with registration/login");
    window.open(`https://wa.me/919328435505?text=${message}`, '_blank');
}

// Call Support Function
function callSupport() {
    window.location.href = 'tel:9328435505';
}

// Add WhatsApp buttons dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Add WhatsApp button to login form
    const loginForm = document.getElementById('loginForm');
    const whatsappBtn = document.createElement('button');
    whatsappBtn.type = 'button';
    whatsappBtn.className = 'btn-whatsapp';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Need Help? WhatsApp Now';
    whatsappBtn.onclick = openWhatsApp;
    
    loginForm.appendChild(whatsappBtn);
    
    // Add WhatsApp button to register form
    const registerForm = document.getElementById('registerForm');
    const whatsappBtn2 = document.createElement('button');
    whatsappBtn2.type = 'button';
    whatsappBtn2.className = 'btn-whatsapp';
    whatsappBtn2.innerHTML = '<i class="fab fa-whatsapp"></i> Registration Help on WhatsApp';
    whatsappBtn2.onclick = openWhatsApp;
    
    registerForm.appendChild(whatsappBtn2);
});

// Add this CSS for WhatsApp button
const whatsappBtnCSS = `
.btn-whatsapp {
    width: 100%;
    padding: 15px;
    background: #25D366;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.btn-whatsapp:hover {
    background: #128C7E;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
}

.btn-whatsapp i {
    font-size: 1.3rem;
}
`;

// Add the CSS to page
const style = document.createElement('style');
style.textContent = whatsappBtnCSS;
document.head.appendChild(style);
