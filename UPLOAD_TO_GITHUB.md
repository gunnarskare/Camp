# Upload Files Directly to GitHub (Web Interface)

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `vaeret-agder` (or any name you prefer)
3. Choose **Public**
4. **DO NOT** check "Add a README file" or any other options
5. Click **"Create repository"**

## Step 2: Upload Files Directly

After creating the repository, you'll see a page with options. Choose **"uploading an existing file"** or click the **"upload files"** button.

Then:

1. **Drag and drop** all these files and folders into the upload area:
   - `index.html`
   - `css/` folder (with `style.css` inside)
   - `js/` folder (with all .js files inside)
   - `mve-mobil-color.svg`
   - `package.json`
   - `README.md`
   - `DEPLOY.md`
   - `.gitignore`
   - `.nojekyll`

2. Scroll down and click **"Commit changes"**

## Step 3: Enable GitHub Pages

1. Go to **Settings** → **Pages** (in your repository)
2. Under "Source", select **Deploy from a branch**
3. Choose **main** branch and **/ (root)** folder
4. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

## Alternative: Using Git Commands (If you prefer)

If you want to use git commands instead, after creating the repository on GitHub, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

