# Deploying to GitHub Pages & Custom Domain

## 1. Deploy to GitHub Pages

### One-time setup

1. **Push this repo to GitHub** (if you haven’t already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
   git push -u origin main
   ```

2. **Turn on GitHub Pages**  
   - Repo → **Settings** → **Pages**  
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.

3. **Trigger a deploy**  
   - Push to `main`, or run the workflow manually: **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

Your site will be at:

- **Project site:** `https://YOUR_USERNAME.github.io/my-portfolio/`  
  (Replace `my-portfolio` with your actual repo name.)

---

## 2. Switch to Your Own Domain

You can point a custom domain (e.g. `cakentan.net` or `www.cakentan.net`) to this GitHub Pages site.

### Step A: Tell GitHub your domain

1. Repo → **Settings** → **Pages**.
2. Under **Custom domain**, enter your domain (e.g. `cakentan.net`) and **Save**.
3. (Optional) Enable **Enforce HTTPS** after DNS is set.

### Step B: Configure DNS at your registrar

At the place where you bought the domain (e.g. Namecheap, GoDaddy, Cloudflare), add one of these:

**Option 1 – Root domain (e.g. `cakentan.net`)**

| Type | Name/Host | Value |
|------|-----------|--------|
| A     | `@`       | `185.199.108.153` |
| A     | `@`       | `185.199.109.153` |
| A     | `@`       | `185.199.110.153` |
| A     | `@`       | `185.199.111.153` |

**Option 2 – Subdomain (e.g. `www.cakentan.net`)**

| Type  | Name/Host | Value                |
|-------|-----------|----------------------|
| CNAME | `www`     | `YOUR_USERNAME.github.io` |

(Use your GitHub username instead of `YOUR_USERNAME`.)

DNS can take from a few minutes up to 48 hours to update.

### Step C: Build the app for the root path

GitHub Pages is serving from your **custom domain root**, so the app must be built with base path `/` (not `/my-portfolio/`).

1. Repo → **Settings** → **Actions** → **General** → **Variables**.
2. **New repository variable**  
   - Name: `VITE_BASE_PATH`  
   - Value: `/`
3. **Save**.
4. **Actions** → **Deploy to GitHub Pages** → **Run workflow** (so the site is rebuilt with base `/`).

After the workflow finishes and DNS has propagated, your site will load at your custom domain (e.g. `https://cakentan.net`).

---

## Summary

| Step | What to do |
|------|------------|
| **GitHub Pages** | Push repo → Settings → Pages → Source: **GitHub Actions** → deploy on push to `main`. |
| **URL** | `https://YOUR_USERNAME.github.io/REPO_NAME/` |
| **Custom domain** | Settings → Pages → Custom domain → set DNS (A or CNAME) → add variable `VITE_BASE_PATH` = `/` → re-run deploy. |
