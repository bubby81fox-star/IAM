// Listen for login actions sent from your extension's popup window
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "login") {
    
    const AUTH0_DOMAIN = "dev-t0zgk43t61c80h7q.us.auth0.com";
    const CLIENT_ID = "amkFoQPZtek3eDKm1zsPiW034R2Cjn4I";
    
    // Step A: Let Chrome generate its internal unique callback URL
    const redirectUri = chrome.identity.getRedirectURL(); 
    // This outputs: https://<YOUR-EXTENSION-ID>.chromiumapp.org/
    
    // Step B: Build the standard Auth0 PKCE Authorization String
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?` + 
                    `client_id=${CLIENT_ID}&` +
                    `response_type=token&` + // Implicit token flow for extensions
                    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                    `scope=openid%20profile%20email&` +
                    `prompt=login`;

    // Step C: Launch the secure window layer
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("Auth window closed or aborted:", chrome.runtime.lastError);
        return;
      }

      // Step D: Parse out the user token from the successful callback hash
      const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
      const accessToken = urlParams.get("access_token");
      const idToken = urlParams.get("id_token");

      if (accessToken) {
        // Securely lock the user session data into the extension environment
        chrome.storage.local.set({ accessToken, idToken }, () => {
          console.log("Success! Xtensible Auth Session Locked.");
          // Notify the UI that authentication succeeded
          chrome.runtime.sendMessage({ action: "auth_success" });
        });
      }
    });
  }
  return true; // Keeps message channel open for asynchronous callbacks
});