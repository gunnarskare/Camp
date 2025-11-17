# Deploying to GitHub Pages

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `vaeret-agder` or `weather-agder`)
5. Choose **Public** (required for free GitHub Pages)
6. **Do NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Or if you prefer SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under "Source", select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

## Step 4: Access Your Website

After a few minutes, your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Important Notes

- The `.nojekyll` file is included to ensure GitHub Pages serves your ES6 modules correctly
- Changes pushed to the `main` branch will automatically update the website
- It may take a few minutes for changes to appear after pushing

## Updating the Site

To update your site after making changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

- **404 Error**: Wait a few minutes after enabling Pages, or check that the branch is set to `main`
- **Module errors**: Make sure `.nojekyll` file is in the root directory
- **CORS errors**: GitHub Pages serves over HTTPS, which should work fine with the APIs used

