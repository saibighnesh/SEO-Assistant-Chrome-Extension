// Function to extract SEO data from the webpage
function extractSeoData() {
    const seoData = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || 'No description meta tag',
        h1: document.querySelector('h1')?.innerText || 'No H1 tag found',
        imagesWithoutAlt: Array.from(document.images).filter(img => !img.alt).length
    };
    return seoData;
}

  // Send the extracted data to the background script
function sendDataToBackground(seoData) {
    chrome.runtime.sendMessage({
        action: "logPageDetails",
        data: seoData
    });
}

  // Extract SEO data when the script loads
const seoData = extractSeoData();
sendDataToBackground(seoData);
