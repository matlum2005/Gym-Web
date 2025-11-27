// Dashboard JavaScript for loading data and handling interactions

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('goalSelect').addEventListener('change', updateGoal);
}

function logout() {
    localStorage.removeItem('vg_token');
    window.location.href = '/index.html';
}

function authFetch(url, opts = {}) {
    opts.headers = opts.headers || {};
    const token = localStorage.getItem('vg_token');
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, opts);
}

let currentMember = null;

function loadDashboardData() {
    const token = localStorage.getItem('vg_token');
    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    // Load member profile
    authFetch('/api/members/me')
        .then(response => response.json())
        .then(member => {
            currentMember = member;
            document.getElementById('profileName').textContent = member.name || member.username;
            document.getElementById('profileEmail').textContent = member.email;
            document.getElementById('membershipType').textContent = member.membershipType || 'Basic';
            document.getElementById('statusBadge').textContent = 'Active';
        })
        .catch(error => console.error('Error loading member:', error));

    // Load bookings
    authFetch('/api/bookings')
        .then(response => response.json())
        .then(bookings => {
            const userBookings = bookings.filter(b => b.member && b.member.id == currentMember?.id);
            const bookingsDiv = document.getElementById('bookings');
            if (userBookings.length === 0) {
                bookingsDiv.innerHTML = 'No bookings yet.';
            } else {
                bookingsDiv.innerHTML = userBookings.map(booking => `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <strong>${booking.classEntity.title}</strong>
                            <div class="small text-muted">${new Date(booking.bookingDate).toLocaleDateString()}</div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking(${booking.id})">Cancel</button>
                    </div>
                `).join('');
            }
            document.getElementById('totalBookings').textContent = userBookings.length;
        })
        .catch(error => console.error('Error loading bookings:', error));

    // Load available classes
    authFetch('/api/classes')
        .then(response => response.json())
        .then(classes => {
            const classesDiv = document.getElementById('availableClasses');
            if (classes.length === 0) {
                classesDiv.innerHTML = 'No classes available.';
            } else {
                classesDiv.innerHTML = classes.map(cls => `
                    <div class="class-card mb-3 p-3 border rounded">
                        <h6>${cls.title}</h6>
                        <p class="small text-muted">${cls.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span>${cls.schedule}</span>
                            <button class="btn btn-sm btn-primary" onclick="bookClass(${cls.id})">Book</button>
                        </div>
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error('Error loading classes:', error));

    // Mock data for other stats
    document.getElementById('workoutsCompleted').textContent = '15';
    document.getElementById('progressScore').textContent = '85%';
    document.getElementById('loyaltyPoints').textContent = '250';
}

function bookClass(classId) {
    if (!currentMember) {
        alert('Unable to get member information');
        return;
    }

    authFetch(`/api/classes/${classId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: currentMember.id })
    })
    .then(response => {
        if (response.ok) {
            alert('Class booked successfully!');
            loadDashboardData();
        } else {
            alert('Failed to book class');
        }
    })
    .catch(error => console.error('Error booking class:', error));
}

function cancelBooking(bookingId) {
    authFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    .then(() => {
        alert('Booking canceled');
        loadDashboardData();
    })
    .catch(error => console.error('Error canceling booking:', error));
}

function upgradeFeature(feature) {
    alert(`Upgrade to ${feature} - payment processing`);
}

function updateGoal() {
    const goal = document.getElementById('goalSelect').value;
    // Save goal preference - mock
    console.log('Goal updated to:', goal);
}
