chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "login") {
    
    const AUTH0_DOMAIN = "dev-t0zgk43t61c80h7q.us.auth0.com";
    const CLIENT_ID = "amkFoQPZtek3eDKm1zsPiW034R2Cjn4I";
    
    // Dynamically gets your exact extension URL: https://<id>.chromiumapp.org/
    const redirectUri = chrome.identity.getRedirectURL(); 
    console.log("Your Extension Redirect URI is:", redirectUri);
    
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?` + 
                    `client_id=${CLIENT_ID}&` +
                    `response_type=token&` + 
                    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                    `scope=openid%20profile%20email&` +
                    `prompt=login`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("Auth failed:", chrome.runtime.lastError);
        return;
      }

      const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
      const accessToken = urlParams.get("access_token");
      const idToken = urlParams.get("id_token");

      if (accessToken) {
        chrome.storage.local.set({ accessToken, idToken }, () => {
          chrome.runtime.sendMessage({ action: "auth_success" });
        });
      }
    });
  }
  return true;
});