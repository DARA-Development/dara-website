# dara-website

Website for DARA Telecom (Drone Assisted Radio Analytics), live at [daratelecom.com](https://daratelecom.com).

It's a static site: plain HTML, CSS and JavaScript, with no framework.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `solutions.html` | Solutions |
| `products.html` | Products |
| `story.html` | Our story |
| `about_us.html` | About us and team profiles |
| `newsroom.html` | Newsroom |
| `careers.html` | Careers |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |

`home2.html` and `newsroom2.html` are backups of earlier versions and aren't linked from the site.

## Project layout

- `style.css`: styles for every page.
- `site-nav.js`, `site-search.js`, `contact-forms.js`: navigation, site search and the contact/demo forms (sent through FormSubmit).
- `footer.html`: the shared footer. The build copies it into every page, replacing each page's own `<footer>`, so edit the footer here only.
- `images/`, `videos/`, `fonts/`: media and fonts.
- `CNAME`: the custom domain.
- `scripts/build.mjs`: builds the site into `dist/`.
- `tests/site.spec.js`: Playwright tests.

## Working on the site

You need [Node.js](https://nodejs.org) 22 or later.

```sh
npm install                       # first time only
npx playwright install chromium   # first time only, for the tests
npm start                         # build and open the site with live reload
npm test                          # build and run the tests
```

Always run the tests with `npm test`. It rebuilds `dist/` first. Running `npx playwright test` on its own tests whatever is already in `dist/`, which may be out of date.

If you change text on a page that the tests check, update the matching test in `tests/site.spec.js` too.

## Deploying

Pushing to `main` deploys the site. The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs the tests, and if they pass, builds the site and publishes it to GitHub Pages. Deployments run one at a time.

Pull requests to `main` run the tests but don't deploy.
