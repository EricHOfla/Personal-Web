export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing OAuth code parameter.");
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.REACT_APP_GITHUB_CLIENT_ID || "Ov23libr3bYt8U1NwM9j";
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const authorizedOwner = (process.env.GITHUB_OWNER || "EricHOfla").toLowerCase();

  if (!clientId || !clientSecret) {
    return res.status(500).send("GitHub OAuth environment variables (GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET) are missing on Vercel.");
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).send(`GitHub OAuth Error: ${tokenData.error_description || "Could not retrieve access token."}`);
    }

    // 2. Fetch authenticated GitHub user details
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userRes.json();

    // 3. Verify user is @EricHOfla
    if (userData.login?.toLowerCase() !== authorizedOwner) {
      return res.status(403).send(`Access Denied: You are signed in as @${userData.login}. Only @${authorizedOwner} is authorized to manage this portfolio.`);
    }

    // 4. Redirect back to frontend admin with token in hash
    const host = req.headers["x-forwarded-host"] || req.headers.host || "oflah.vercel.app";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const redirectUrl = `${protocol}://${host}/#admin?token=${encodeURIComponent(accessToken)}&user=${encodeURIComponent(userData.login)}`;

    return res.redirect(302, redirectUrl);
  } catch (err) {
    return res.status(500).send(`OAuth Server Error: ${err.message}`);
  }
}
