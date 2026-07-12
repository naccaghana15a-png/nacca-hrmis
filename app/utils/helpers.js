// Toast notification
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 text-white ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' :
    'bg-blue-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Confirm dialog
export function confirmAction(message, callback) {
  if (window.confirm(message)) {
    callback();
  }
}

// Alert dialog
export function showAlert(message) {
  alert(message);
}