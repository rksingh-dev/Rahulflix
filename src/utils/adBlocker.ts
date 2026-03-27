// Ad blocking utility for streaming players
export const AD_BLOCKER_CSS = `
  /* Hide common ad containers */
  .ad, .ads, .advertisement, .advertising,
  .advert, .ad-banner, .ad-wrapper,
  .ad-container, .adcontainer,
  .ad-space, .ad-slot, .adslot,
  .ad-unit, .ad-link,
  div[id*="ad-"], div[id*="ads-"],
  div[id*="advertisement"],
  div[class*="ad-"], div[class*="ads-"],
  div[class*="advertisement"],
  div[class*="advert"],
  iframe[src*="ad"], iframe[src*="ads"],
  script[src*="ad"], script[src*="ads"],
  .banner-ad, .sidebar-ad, .footer-ad,
  [data-ad-unit], [data-ad-slot],
  .sticky-ad, .floating-ad,
  .modal-ad, .popup-ad,
  .rollover, .overlay-ad {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
  }

  /* Remove ad-related styles that might show blank spaces */
  body, html {
    background-color: #000 !important;
  }
`;

export const injectAdBlocker = (frameElement: HTMLIFrameElement) => {
  try {
    const frameDoc = frameElement.contentDocument || frameElement.contentWindow?.document;
    if (!frameDoc) return;

    // Create and inject style element
    const style = frameDoc.createElement('style');
    style.textContent = AD_BLOCKER_CSS;
    frameDoc.head.appendChild(style);

    // Monitor for dynamically added ads
    const observer = new MutationObserver(() => {
      const adElements = frameDoc.querySelectorAll(
        '.ad, .ads, .advertisement, [id*="ad-"], [class*="ad-"]'
      );
      adElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });

    observer.observe(frameDoc.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style'],
    });
  } catch (error) {
    console.warn('Ad blocker injection failed (expected for cross-origin iframes):', error);
  }
};

export const addAdBlockerNotification = () => {
  return `
    For the best ad-free experience, we recommend:
    • Installing uBlock Origin browser extension
    • Enabling your browser's ad blocker
  `;
};
