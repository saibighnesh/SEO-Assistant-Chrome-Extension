
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "logPageDetails") {
        console.log("Page Title: ", request.data.title);
        console.log("Page Description: ", request.data.description);     
    }
      // You can add more conditions here for different messages
    }
); 