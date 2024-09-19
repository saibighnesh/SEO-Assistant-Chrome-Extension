document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the 'Analyze Again' button
    document.getElementById('refresh').addEventListener('click', function() {
        fetchAndDisplaySeoData();
    });

    // Fetch SEO data when the popup loads
    fetchAndDisplaySeoData();
});

// Function to send a message to the content script to perform SEO analysis
function fetchAndDisplaySeoData() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length === 0) {
            console.error('No active tab found');
            return;  // Exit if no active tab found
        }
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: getSeoData
        }, (injectionResults) => {
            if (chrome.runtime.lastError || !injectionResults || injectionResults.length === 0) {
                console.error('Script injection failed: ', chrome.runtime.lastError?.message);
                return;
            }
            for (const frameResult of injectionResults)
                updateDisplay(frameResult.result);
        });
    });
}

// This function will be serialized and run in the context of the webpage
function getSeoData() {
    const seoData = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || 'No description found',
        h1: document.querySelector('h1')?.innerText || 'No H1 tag found',
        imagesWithoutAlt: Array.from(document.images).filter(img => !img.alt).length
    };
    return seoData;
}

// Function to update the display with SEO data
function updateDisplay(seoData) {
    if (!seoData) {
        document.getElementById('summary-content').innerHTML = 'No SEO data found. Please try again.';
        document.getElementById('details-content').innerHTML = '';
    } else {
        document.getElementById('summary-content').innerHTML = `
            <strong>Title:</strong> ${seoData.title}<br>
            <strong>Description:</strong> ${seoData.description}
        `;
        document.getElementById('details-content').innerHTML = `
            <strong>H1 Tag:</strong> ${seoData.h1}<br>
            <strong>Images without Alt tags:</strong> ${seoData.imagesWithoutAlt}
        `;
    }
}
