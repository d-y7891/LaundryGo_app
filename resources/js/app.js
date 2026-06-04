// LaundryGo - Client JS
// Socket connection for real-time updates
let socket = io();

// Join rooms based on page
const hiddenInput = document.querySelector('#hiddenInput');
if (hiddenInput) {
    const order = JSON.parse(hiddenInput.value);
    if (order && order._id) {
        socket.emit('join', `order_${order._id}`);
    }
}

// Remove alert messages
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => { alertMsg.remove(); }, 3000);
}
