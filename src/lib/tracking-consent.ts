// The shared GTM container includes statistics and marketing tags; both require consent.
export const trackingConsentScript = `(() => {
  let loaded = false;
  function updateConsent() {
    const consent = window.Cookiebot?.consent;
    const allowed = consent?.statistics === true && consent?.marketing === true;
    if (!allowed) {
      // Reload to stop already-running third-party tags after consent is withdrawn.
      if (loaded) window.location.reload();
      return;
    }
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.id = 'consented-gtm';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-54TNTKLF';
    document.head.appendChild(script);
  }
  for (const event of ['CookiebotOnConsentReady', 'CookiebotOnAccept', 'CookiebotOnDecline']) {
    window.addEventListener(event, updateConsent);
  }
  updateConsent();
})();`;
