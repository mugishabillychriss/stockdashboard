// Shared functions and authentication check

// Check if user is logged in (protect pages)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Update pending badge in sidebar
    const pendingBadge = document.getElementById('pendingBadge');
    if (pendingBadge) {
        const requests = JSON.parse(localStorage.getItem('subscriptionRequests')) || [];
        const pendingCount = requests.filter(r => r.status === 'pending').length;
        pendingBadge.textContent = pendingCount;
    }
});
