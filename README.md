# NEXUS//2050 — GitHub Pages

A React + TypeScript + Vite landing page.

## Run locally

```bash
npm ci
npm run dev
```

## Build locally

```bash
npm ci
npm run build
npm run preview
```

The production build is written to `dist/`.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main`, or run the **Deploy to GitHub Pages** workflow manually from the Actions tab.
5. When the workflow succeeds, open the Pages URL shown in the repository's Pages settings or deployment environment.

The Vite `base: "./"` setting keeps built asset paths relative, so the project can be hosted under a GitHub Pages repository path without hardcoding the repository name.

## Notes

- The contact form is currently a front-end demo; it does not deliver or store submissions.
- External Google Fonts require an internet connection.
- The `public/images` directory is copied to the production output and referenced using Vite's base URL.
