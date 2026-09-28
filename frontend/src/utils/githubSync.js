// Utility to format portfolioData and commit it directly to GitHub repository via GitHub REST API

export const serializePortfolioData = (data) => {
  return `// Centralized Portfolio Data - Single Source of Truth
// Edit this file to add, modify, or remove any portfolio content without altering React components.

export const portfolioData = ${JSON.stringify(data, null, 2)};

// Aliases for convenient default import & individual named exports
export default portfolioData;
`;
};

/**
 * Commits updated portfolioData directly to GitHub repository.
 * This triggers automatic static redeployment on Vercel.
 */
export const commitPortfolioDataToGitHub = async ({
  token,
  owner = "EricHOfla",
  repo = "Personal-Web",
  path = "frontend/src/data/index.js",
  branch = "main",
  data,
  commitMessage = "Admin: Update portfolio data",
}) => {
  const fileApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

  // 1. Fetch current file to get its SHA (required for GitHub update)
  let sha = null;
  try {
    const getRes = await fetch(fileApiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    } else if (getRes.status === 401 || getRes.status === 403) {
      throw new Error("Invalid GitHub Token or insufficient permissions. Make sure your token has 'repo' scope.");
    } else if (getRes.status === 404) {
      // File might be at root or different path, attempt creation without sha
      sha = null;
    }
  } catch (err) {
    if (err.message.includes("GitHub Token")) throw err;
    console.warn("Could not fetch existing file SHA, proceeding with creation attempt", err);
  }

  // 2. Generate new file content
  const newContentStr = serializePortfolioData(data);
  // UTF-8 base64 encoding (browser compatible)
  const encodedContent = btoa(unescape(encodeURIComponent(newContentStr)));

  // 3. Send PUT request to commit to repository
  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const payload = {
    message: commitMessage,
    content: encodedContent,
    branch: branch,
  };
  if (sha) {
    payload.sha = sha;
  }

  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to commit to GitHub (Status: ${putRes.status})`);
  }

  const result = await putRes.json();
  return result;
};
