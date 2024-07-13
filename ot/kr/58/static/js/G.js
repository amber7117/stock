// Function to asynchronously load Google Tag Manager scripts
function loadGTM(gtmId) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtmId;
    document.head.appendChild(script);
}

// Main function to initialize all scripts
function initializeTracking() {
    // Load GTM scripts
    loadGTM('G-Q02E1J4Y3P');
    loadGTM('AW-332574294');

    // Initialize data layer
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-Q02E1J4Y3P');
    gtag('config', 'AW-332574294');

    // Event tracking function
    window.gtag_report_conversion = function(url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-332574294/dDDsCISqtf4YENbcyp4B',
            'transaction_id': '',
            'event_callback': callback
        });
        return false;
    };
}

// Call the function to initialize everything
initializeTracking();
