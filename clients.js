// Client management

let clients = JSON.parse(localStorage.getItem('clients')) || [];

// Load sample clients if empty
if (clients.length === 0) {
    clients = [
        { code: 'TEC001', name: 'TechStart Solutions', email: 'contact@techstart.com', status: 'active' },
        { code: 'CAF002', name: 'Cafe Rwanda', email: 'info@caferwanda.com', status: 'active' },
        { code: 'EDU003', name: 'Smart Tutors', email: 'admin@smarttutors.com', status: 'active' }
    ];
    localStorage.setItem('clients', JSON.stringify(clients));
}

// Load clients into table
function loadClients() {
    clients = JSON.parse(localStorage.getItem('clients')) || [];
    const tbody = document.getElementById('clientsTableBody');
    const emptyState = document.getElementById('emptyClients');
    
    if (clients.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td><strong>${client.code}</strong></td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td><span class="status-badge ${client.status || 'active'}">${client.status || 'active'}</span></td>
            <td>
                <button class="action-btn edit" onclick="editClient('${client.code}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteClient('${client.code}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Show add client modal
function showAddClientModal() {
    document.getElementById('clientModalTitle').textContent = 'Add New Client';
    document.getElementById('clientCode').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientModal').classList.add('active');
}

// Edit client
function editClient(code) {
    const client = clients.find(c => c.code === code);
    if (!client) return;
    
    document.getElementById('clientModalTitle').textContent = 'Edit Client';
    document.getElementById('clientCode').value = client.code;
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientModal').classList.add('active');
}

// Save client (add or update)
function saveClient() {
    const code = document.getElementById('clientCode').value.trim();
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    
    if (!code || !name || !email) {
        alert('Please fill all fields');
        return;
    }
    
    clients = JSON.parse(localStorage.getItem('clients')) || [];
    
    const existingIndex = clients.findIndex(c => c.code === code);
    if (existingIndex !== -1) {
        // Update
        clients[existingIndex] = { ...clients[existingIndex], name, email };
    } else {
        // Add new
        clients.push({ code, name, email, status: 'active' });
    }
    
    localStorage.setItem('clients', JSON.stringify(clients));
    closeModal('clientModal');
    loadClients();
}

// Delete client
function deleteClient(code) {
    if (confirm(`Are you sure you want to delete client ${code}?`)) {
        clients = clients.filter(c => c.code !== code);
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    }
}

// Load on page ready
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
});
