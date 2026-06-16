// Listen for your login message from popup.js or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "login") {
    const AUTH0_DOMAIN = "dev-t0zgk43t61c80h7q.us.auth0.com";
    const CLIENT_ID = "amkFoQPZtek3eDKm1zsPiW034R2Cjn4I";
    const REDIRECT_URI = "https://bubby81fox-star.github.io/IAM";
    
    // Construct the standard Auth0 PKCE Authorization URL
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?` + 
                    `client_id=${CLIENT_ID}&` +
                    `response_type=code&` +
                    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
                    `scope=openid%20profile%20email`;

    // Launch a secure browser tab or identity window
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("Auth failed or window closed:", chrome.runtime.lastError);
        return;
      }
      
      // Parse the return token code from your redirectUrl here
      console.log("Success! Secure Auth Callback URI received:", redirectUrl);
    });
  }
});