// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates on page load
        registration.update();
        
        // Set up periodic updates check
        setInterval(() => {
          registration.update();
          console.log('Checking for Service Worker updates...');
        }, 60 * 60 * 1000); // Check every hour
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });
  });
  
  // Notify user when new content is available
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    refreshing = true;
    console.log('New content available; refreshing...');
    window.location.reload();
  });

  // Create UI for update notifications
  let newWorker;
  
  function showUpdateNotification() {
    // Create update notification
    const updateBanner = document.createElement('div');
    updateBanner.className = 'update-banner';
    updateBanner.innerHTML = `
      <div class="update-message">Nowa wersja aplikacji jest dostępna!</div>
      <button class="update-button">Odśwież</button>
    `;
    
    // Style the notification
    updateBanner.style.position = 'fixed';
    updateBanner.style.bottom = '0';
    updateBanner.style.left = '0';
    updateBanner.style.right = '0';
    updateBanner.style.backgroundColor = '#ff4dbc';
    updateBanner.style.color = 'white';
    updateBanner.style.padding = '12px';
    updateBanner.style.display = 'flex';
    updateBanner.style.justifyContent = 'space-between';
    updateBanner.style.alignItems = 'center';
    updateBanner.style.zIndex = '9999';
    
    const updateButton = updateBanner.querySelector('.update-button');
    updateButton.style.backgroundColor = 'white';
    updateButton.style.color = '#ff4dbc';
    updateButton.style.border = 'none';
    updateButton.style.padding = '8px 16px';
    updateButton.style.borderRadius = '4px';
    updateButton.style.cursor = 'pointer';
    
    // Add button event listener
    updateButton.addEventListener('click', () => {
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
    
    // Add to document
    document.body.appendChild(updateBanner);
  }
  
  // Listen for new service workers
  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateNotification();
        }
      });
    });
  });
} 