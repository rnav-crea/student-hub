// Development utility to reset all data
export const resetAppData = () => {
  if (confirm('Are you sure you want to reset all app data? This will clear all posts, users, and profile stats.')) {
    localStorage.clear();
    window.location.reload();
  }
};

// Add to window for easy access in development
if (typeof window !== 'undefined') {
  window.resetAppData = resetAppData;
}

export default resetAppData;
