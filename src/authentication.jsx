const clientId = '39a581824af14566bbe139e66c337f55';
const redirectUri = 'https://127.0.0.1:5173';

const Authentication = {

   

       initiateAuthentication: async () => {

        const codeVerifier= () => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(64));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
          };
          
        const sha256=async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return window.crypto.subtle.digest('SHA-256', data)
          };

        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
              .replace(/=/g, '')
              .replace(/\+/g, '-')
              .replace(/\//g, '_');
          };

          const codeVerifierNoHash = codeVerifier();
        const hashed = await sha256(codeVerifierNoHash)
        const codeChallenge = base64encode(hashed);

        const scope = 'user-read-private user-read-email playlist-modify-private';
        const authUrl = new URL("https://accounts.spotify.com/authorize")
        
        // generated in the previous step
        window.localStorage.setItem('code_verifier', codeVerifierNoHash);
        
        const params =  {
          response_type: 'code',
          client_id: clientId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: redirectUri,
        }
        
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
      },

       getToken: async () => {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');

        if (code === undefined || code === null || code === '') {
            return;
        }
        // stored in the previous step
        const codeVerifierLocal = localStorage.getItem('code_verifier');
        
        const url = "https://accounts.spotify.com/api/token";
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifierLocal,
            }),
        }
        
        const body = await fetch(url, payload);
        const response = await body.json();
        
        localStorage.setItem('access_token', response.access_token);

        const userIdRequest = await fetch("https://api.spotify.com/v1/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${response.access_token}`
            }
          }
        )
        const userIdResponse = await userIdRequest.json()
        localStorage.setItem('user_id', userIdResponse.id);
       
        window.location = '/';

        }
      
}

export default Authentication;