(function () {
  if (!('serviceWorker' in navigator)) {
    console.info('CyberWise offline support is unavailable in this browser.');
    return;
  }

  if (!window.isSecureContext) {
    console.info('CyberWise offline support requires HTTPS or localhost.');
    return;
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function (error) {
      console.error('CyberWise offline support could not be enabled:', error);
    });
  });
})();
