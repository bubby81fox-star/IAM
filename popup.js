import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0 = await createAuth0Client({
  domain: 'dev-t0zgk43t61c80h7q.us.auth0.com',
  client_id: '883327117696-3f1jidokkhg2bili9e3entbgbd8i0ohg.apps.googleusercontent.com',
  authorizationParams: {
    redirect_uri: 'https://bubby81fox-star.github.io/IM'
  }
});

// Trigger the login modal window
await auth0.loginWithRedirect();