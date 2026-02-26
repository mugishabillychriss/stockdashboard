// Initialize requests if none
let requests = JSON.parse(localStorage.getItem('subscriptionRequests')) || [];

// Load sample data if empty
if (requests.length === 0) {
    requests = [
        {
            id: 'REQ001',
            companyCode: 'TEC001',
            companyName: 'TechStart Solutions',
            email: 'contact@techstart.com',
            plan: 'Professional - $49/month',
            transactionId: 'TXN123456',
            amount: 49.00,
            timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
            status: 'pending'
        },
        {
            id: 'REQ002',
            companyCode: 'CAF002',
            companyName: 'Cafe Rwanda',
            email: 'info@caferwanda.com',
            plan: 'Basic - $29/month',
            transactionId: 'AM789012',
            amount: 29.00,
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            status: 'pending'
        },
        {
            id: 'REQ003',
            companyCode: 'EDU003',
            companyName: 'Smart Tutors',
            email: 'admin@smarttutors.com',
            plan: 'Enterprise - $99/month',
            transactionId: 'BT987654',
            amount: 99.00,
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            status: 'pending'
        }
    ];
    localStorage.setItem('subscriptionRequests', JSON.stringify(requests));
}

// Load requests into grid
function loadRequests(filter = 'pending') {
    requests = JSON.parse(localStorage.getItem('subscriptionRequests')) || [];
    const grid = document.getElementById('requestsGrid');
    const emptyState = document.getElementById('emptyState');
    
    let filtered = requests;
    if (filter !== 'all') {
        filtered = requests.filter(r => r.status === filter);
    }
    
    // Update stats
    updateStats();
    
    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    grid.innerHTML = filtered.map(req => `
        <div class="request-card ${req.status}" data-id="${req.id}">
            <div class="request-header">
                <span class="company-code">${req.companyCode}</span>
                <span class="request-time">${timeAgo(req.timestamp)}</span>
            </div>
            <div class="company-info">
                <h4>${req.companyName}</h4>
                <p><i class="fas fa-envelope"></i> ${req.email}</p>
            </div>
            <div class="subscription-details">
                <div class="detail-item">
                    <span class="label">Plan:</span>
                    <span class="value">${req.plan}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Txn ID:</span>
                    <span class="value">${req.transactionId}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Amount:</span>
                    <span class="value amount">${formatCurrency(req.amount)}</span>
                </div>
            </div>
            ${req.status === 'pending' ? `
            <div class="request-actions">
                <button class="btn-approve" onclick="approveRequest('${req.id}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="rejectRequest('${req.id}')">
                    <i class="fas fa-times"></i> Reject
                </button>
                <button class="btn-view" onclick="viewDetails('${req.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            ` : `
            <div style="margin-top: 12px; text-align: center; color: var(--gray); font-size: 13px;">
                <i class="fas ${req.status === 'approved' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${req.status.charAt(0).toUpperCase() + req.status.slice(1)} on ${formatDate(req.processedAt || req.timestamp)}
            </div>
            `}
        </div>
    `).join('');
    
    // Update pending badge in sidebar
    const pendingBadge = document.getElementById('pendingBadge');
    if (pendingBadge) {
        const pendingCount = requests.filter(r => r.status === 'pending').length;
        pendingBadge.textContent = pendingCount;
    }
}

// Update stats
function updateStats() {
    requests = JSON.parse(localStorage.getItem('subscriptionRequests')) || [];
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const revenue = requests
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0);
    
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statRejected').textContent = rejected;
    document.getElementById('statRevenue').textContent = formatCurrency(revenue);
}

// Approve request
function approveRequest(id) {
    requests = JSON.parse(localStorage.getItem('subscriptionRequests')) || [];
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index].status = 'approved';
        requests[index].processedAt = new Date().toISOString();
        localStorage.setItem('subscriptionRequests', JSON.stringify(requests));
        loadRequests(getCurrentFilter());
        updateStats();
    }
}

// Reject request
function rejectRequest(id) {
    requests = JSON.parse(localStorage.getItem('subscriptionRequests')) || [];
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index].status = 'rejected';
        requests[index].processedAt = new Date().toISOString();
        localStorage.setItem('subscriptionRequests', JSON.stringify(requests));
        loadRequests(getCurrentFilter());
        updateStats();
    }
}

// View details modal
function viewDetails(id) {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const modal = document.getElementById('detailsModal');
    const body = document.getElementById('detailsBody');
    const footer = document.getElementById('detailsFooter');
    
    body.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>${req.companyName} (${req.companyCode})</h3>
            <p><i class="fas fa-envelope"></i> ${req.email}</p>
        </div>
        <div style="background: var(--light); padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Request ID:</span>
                <span>${req.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Submitted:</span>
                <span>${formatDate(req.timestamp)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Plan:</span>
                <span>${req.plan}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Transaction ID:</span>
                <span>${req.transactionId}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Amount:</span>
                <span style="font-weight: 700; color: var(--primary);">${formatCurrency(req.amount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Status:</span>
                <span class="status-badge" style="background: ${req.status === 'pending' ? '#fed7aa' : req.status === 'approved' ? '#d1fae5' : '#fee2e2'}; color: ${req.status === 'pending' ? '#92400e' : req.status === 'approved' ? '#065f46' : '#991b1b'}">
                    ${req.status.toUpperCase()}
                </span>
            </div>
        </div>
    `;
    
    footer.innerHTML = req.status === 'pending' ? `
        <button class="btn-secondary" onclick="closeModal('detailsModal')">Close</button>
        <button class="btn-approve" onclick="approveRequest('${req.id}'); closeModal('detailsModal');">Approve</button>
        <button class="btn-reject" onclick="rejectRequest('${req.id}'); closeModal('detailsModal');">Reject</button>
    ` : `
        <button class="btn-secondary" onclick="closeModal('detailsModal')">Close</button>
    `;
    
    modal.classList.add('active');
}

// Helper: time ago
function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    return 'just now';
}

// Get current filter from active tab
function getCurrentFilter() {
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.dataset.filter : 'pending';
}

// Search requests
function searchRequests() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.request-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? 'block' : 'none';
    });
}

// Refresh
function refreshRequests() {
    loadRequests(getCurrentFilter());
}

// Simulate new request (from client)
function showSimulateModal() {
    document.getElementById('simulateModal').classList.add('active');
}

function simulateRequest() {
    const code = document.getElementById('simCode').value;
    const name = document.getElementById('simName').value;
    const email = document.getElementById('simEmail').value;
    const plan = document.getElementById('simPlan').value;
    const txn = document.getElementById('simTxn').value;
    const amount = parseFloat(document.getElementById('simAmount').value);
    
    if (!code || !name || !email || !txn || !amount) {
        alert('Please fill all fields');
        return;
    }
    
    const newRequest = {
        id: 'REQ' + String(requests.length + 1).padStart(3, '0'),
        companyCode: code,
        companyName: name,
        email: email,
        plan: plan,
        transactionId: txn,
        amount: amount,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    requests.push(newRequest);
    localStorage.setItem('subscriptionRequests', JSON.stringify(requests));
    
    closeModal('simulateModal');
    loadRequests('pending');
    
    // Reset form
    document.getElementById('simulateForm').reset();
}

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadRequests(this.dataset.filter);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchRequests);
    }
    
    // Initial load
    loadRequests('pending');
});
