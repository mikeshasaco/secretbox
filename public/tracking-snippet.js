/**
 * Micro Tracker - JavaScript Tracking Snippet
 * 
 * This snippet captures comprehensive visitor, session, and event data
 * and sends it to the Micro Tracker ingest endpoint.
 */

(function() {
    'use strict';

    // Get configuration from script tag
    const script = document.currentScript;
    const apiUrl = script.dataset.api + '/v1/ingest/event';
    const projectId = script.dataset.projectId;
    const publicKey = script.dataset.publicKey;

    if (!apiUrl || !projectId || !publicKey) {
        console.error('Micro Tracker: Missing required data attributes');
        return;
    }

    // Generate or retrieve persistent visitor key
    const VISITOR_KEY = 'mt_visitor_key';
    const SESSION_KEY = 'mt_session_key';
    
    let visitorKey = localStorage.getItem(VISITOR_KEY);
    if (!visitorKey) {
        visitorKey = 'vis_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem(VISITOR_KEY, visitorKey);
    }

    // Generate or retrieve session key (per tab/window)
    let sessionKey = sessionStorage.getItem(SESSION_KEY);
    if (!sessionKey) {
        sessionKey = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        sessionStorage.setItem(SESSION_KEY, sessionKey);
    }

    // Track scroll percentage
    let maxScrollPct = 0;
    let scrollThresholds = [25, 50, 75, 100];
    let sentScrollThresholds = new Set();

    // Utility functions
    function getViewportSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        };
    }

    function getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
    }

    function extractUtmParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign_id: urlParams.get('utm_campaign_id'),
            utm_campaign_name: urlParams.get('utm_campaign_name'),
            utm_adset_id: urlParams.get('utm_adset_id'),
            utm_adset_name: urlParams.get('utm_adset_name'),
            utm_ad_id: urlParams.get('utm_ad_id'),
            utm_ad_name: urlParams.get('utm_ad_name'),
            utm_placement: urlParams.get('utm_placement')
        };
    }

    function extractClickIds() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            fbclid: urlParams.get('fbclid'),
            gclid: urlParams.get('gclid'),
            msclkid: urlParams.get('msclkid'),
            ttclid: urlParams.get('ttclid'),
            clid: urlParams.get('clid')
        };
    }

    function getPageData() {
        const viewport = getViewportSize();
        const utmParams = extractUtmParams();
        const clickIds = extractClickIds();
        
        return {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            language: navigator.language || navigator.userLanguage,
            viewport_w: viewport.width,
            viewport_h: viewport.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ...utmParams,
            ...clickIds
        };
    }

    function sendEvent(eventType, name, additionalData = {}) {
        const pageData = getPageData();
        const scrollPct = getScrollPercentage();
        
        // Update max scroll percentage
        maxScrollPct = Math.max(maxScrollPct, scrollPct);

        const payload = {
            session_key: sessionKey,
            event_type: eventType,
            name: name,
            url: pageData.url,
            path: pageData.path,
            title: pageData.title,
            referrer: pageData.referrer,
            user_agent: pageData.user_agent,
            language: pageData.language,
            viewport_w: pageData.viewport_w,
            viewport_h: pageData.viewport_h,
            timezone: pageData.timezone,
            scroll_pct: maxScrollPct,
            ...pageData, // Include UTM params and click IDs
            ...additionalData
        };

        // Send to backend
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': publicKey,
                'X-Project-Id': projectId,
                'X-Visitor-Key': visitorKey,
                'X-Timezone': pageData.timezone,
                'X-Viewport-Width': pageData.viewport_w.toString(),
                'X-Viewport-Height': pageData.viewport_h.toString()
            },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.warn('Micro Tracker: Failed to send event', error);
        });
    }

    // Track scroll events
    function handleScroll() {
        const scrollPct = getScrollPercentage();
        
        // Send scroll events at thresholds
        scrollThresholds.forEach(threshold => {
            if (scrollPct >= threshold && !sentScrollThresholds.has(threshold)) {
                sentScrollThresholds.add(threshold);
                sendEvent('scroll', `Scroll ${threshold}%`, {
                    scroll_pct: threshold
                });
            }
        });
    }

    // Track click events
    function handleClick(event) {
        const target = event.target;
        const selector = getSelector(target);
        
        // Only track clicks on elements with data-mt attribute or specific selectors
        if (target.hasAttribute('data-mt') || 
            target.tagName === 'A' || 
            target.tagName === 'BUTTON' ||
            target.type === 'submit') {
            
            sendEvent('click', 'Click', {
                selector: selector,
                x: event.clientX,
                y: event.clientY,
                element_text: target.textContent?.trim().substring(0, 100),
                element_tag: target.tagName.toLowerCase(),
                element_id: target.id || null,
                element_class: target.className || null
            });
        }
    }

    // Generate CSS selector for element
    function getSelector(element) {
        if (element.id) {
            return '#' + element.id;
        }
        
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.length > 0);
            if (classes.length > 0) {
                return element.tagName.toLowerCase() + '.' + classes.join('.');
            }
        }
        
        return element.tagName.toLowerCase();
    }

    // Handle SPA route changes
    function handleRouteChange() {
        // Reset scroll tracking for new page
        maxScrollPct = 0;
        sentScrollThresholds.clear();
        
        // Track new page view
        sendEvent('page_view', 'Page View');
    }

    // Initialize tracking
    function init() {
        // Track initial page view
        sendEvent('page_view', 'Page View');

        // Set up event listeners
        window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
        document.addEventListener('click', handleClick, true);
        
        // Handle SPA route changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                handleRouteChange();
            }
        }).observe(document, { subtree: true, childList: true });

        // Handle browser back/forward
        window.addEventListener('popstate', handleRouteChange);

        // Handle beforeunload to send final scroll percentage
        window.addEventListener('beforeunload', () => {
            const finalScrollPct = getScrollPercentage();
            if (finalScrollPct > maxScrollPct) {
                sendEvent('scroll', `Scroll ${finalScrollPct}%`, {
                    scroll_pct: finalScrollPct
                });
            }
        });
    }

    // Throttle function for scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Global API for custom events
    window.MT = {
        track: function(name, props = {}) {
            sendEvent('custom', name, {
                meta: props
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
