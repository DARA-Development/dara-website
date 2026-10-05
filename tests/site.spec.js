import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the core sections and navigation targets', async ({ page }) => {
    await expect(page).toHaveTitle('DARA Telecom');
    await expect(page.locator('.masthead .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.masthead .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.masthead .brand-logo-light')).toHaveCSS('height', '68px');
    await expect(page.locator('.masthead .brand-logo-dark')).toHaveCSS('height', '68px');
    await expect(page.locator('.masthead .brand a')).toHaveAttribute('href', 'index.html');
    await expect(page.locator('.site-search input')).toHaveAttribute('placeholder', 'Search site');
    await expect(page.locator('.site-search-submit')).toHaveAccessibleName('Search');
    await expect(page.locator('.site-search-submit svg')).toBeVisible();
    await expect(page.locator('.site-search + .btn')).toHaveText('Portal login');
    await expect(page.locator('.masthead-top .nav-actions .btn-brand')).toHaveText('Contact us');
    await expect(page.locator('.hero h1')).toHaveText('What we offer and nobody else can');
    await page.locator('html').evaluate((element) => element.setAttribute('data-theme', 'light'));
    await expect(page.locator('.hero h1')).toHaveCSS('color', 'rgb(0, 0, 0)');
    await page.locator('html').evaluate((element) => element.setAttribute('data-theme', 'dark'));
    await expect(page.locator('.hero h1')).toHaveCSS('color', 'rgb(255, 255, 255)');
    await page.locator('html').evaluate((element) => element.setAttribute('data-theme', 'light'));
    await expect(page.locator('.offer-card')).toHaveCount(3);
    await expect(page.locator('.offer-card:first-child .offer-card-image')).toHaveAttribute(
      'src',
      'images/dara-drone-satellite-rf-validation.webp'
    );
    await expect.poll(() =>
      page.locator('.offer-card:first-child .offer-card-image').evaluate((image) => image.naturalWidth)
    ).toBeGreaterThan(0);
    await expect(page.locator('.offer-card:first-child .offer-card-image')).toHaveCSS('object-fit', 'contain');
    expect(Math.abs(
      await page.locator('.offer-card:first-child .offer-card-image').evaluate((image) =>
        image.getBoundingClientRect().width
      ) - await page.locator('.offer-card:first-child').evaluate((card) =>
        card.clientWidth
      )
    )).toBeLessThan(1);
    await expect(page.locator('.offer-card:first-child .offer-card-content')).toContainText('Drone + satellite RF validation');
    await expect(page.locator('.offer-card:nth-child(2) .offer-card-image')).toHaveAttribute(
      'src',
      'images/dara-secure-audit-ready-data-portal.webp'
    );
    await expect.poll(() =>
      page.locator('.offer-card:nth-child(2) .offer-card-image').evaluate((image) => image.naturalWidth)
    ).toBeGreaterThan(0);
    await expect(page.locator('.offer-card:nth-child(2) .offer-card-content')).toContainText('Secure, audit-ready data portal');
    await expect(page.locator('.offer-card:nth-child(3) .offer-card-image')).toHaveAttribute(
      'src',
      'images/dara-analysis-action-automation.webp'
    );
    await expect.poll(() =>
      page.locator('.offer-card:nth-child(3) .offer-card-image').evaluate((image) => image.naturalWidth)
    ).toBeGreaterThan(0);
    await expect(page.locator('.offer-card:nth-child(3) .offer-card-content')).toContainText('Analysis that turns into action');
    await expect(page.locator('.hero-banner img')).toHaveAttribute('src', 'images/dara-telecom-our-vision-banner-muted.webp');
    await expect(page.locator('.hero-banner img')).toBeVisible();
    await expect.poll(() => page.locator('.hero-banner img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    expect(await page.locator('.hero-banner img').evaluate((image) => image.getBoundingClientRect().width))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
    await expect(page.locator('.explore-card')).toHaveCount(0);
    await expect(page.locator('.cta-band h2')).toHaveText('See how DARA Telecom fits a specific network or site');
    await expect(page.locator('main > section')).toHaveCount(2);
    await expect(page.locator('.footer-brand .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.footer-brand .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.footer-brand .brand-logo-light')).toHaveCSS('height', '42px');
    await expect(page.locator('.footer-brand .brand-logo-dark')).toHaveCSS('height', '42px');
    await expect(page.locator('.footer-brand .brand-logo-light')).toHaveAttribute('alt', 'DARA Telecom');
    const linkedInLink = page.locator('.footer-social-link');
    await expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/company/dara-telecom/');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');
    await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(linkedInLink).toHaveAccessibleName('DARA Telecom on LinkedIn');
    await expect(linkedInLink.locator('svg')).toBeVisible();
    await page.locator('#themeToggle').click();
    await expect(page.locator('.masthead .brand-logo-dark')).toBeVisible();
    await expect(page.locator('.footer-brand .brand-logo-dark')).toBeVisible();
    await page.locator('#themeToggle').click();

    for (const id of ['home', 'solutions', 'products', 'svc-field', 'svc-portal', 'svc-analysis', 'investors']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    for (const id of ['svc-marketplace']) {
      await expect(page.locator(`#${id}`)).toHaveCount(0);
    }
  });

  test('returns to the top of the homepage when the logo is clicked', async ({ page }) => {
    await page.locator('.cta-band').scrollIntoViewIfNeeded();
    await page.locator('.masthead .brand a').click();
    await expect(page).toHaveURL(/\/(?:index\.html)?$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('returns to the top of the homepage when Home is clicked', async ({ page }) => {
    await page.locator('.cta-band').scrollIntoViewIfNeeded();
    await page.locator('.primary-nav .nav-link').filter({ hasText: /^Home$/ }).click();
    await expect(page).toHaveURL(/\/(?:index\.html)?$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('keeps the full offer section and its CTAs visible on a standard desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 768 });

    await expect(page.locator('.hero-banner')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.hero h1')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.offer-grid')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.hero-ctas')).toBeInViewport({ ratio: 1 });
  });

  test('uses the full content width for offer cards on desktop and mobile', async ({ page }) => {
    const grid = page.locator('.offer-grid');
    const getGridWidthRatio = () => page.locator('.hero-offerings').evaluate((container) => {
      const style = getComputedStyle(container);
      const contentWidth = container.clientWidth
        - parseFloat(style.paddingLeft)
        - parseFloat(style.paddingRight);
      return container.querySelector('.offer-grid').getBoundingClientRect().width / contentWidth;
    });

    await page.setViewportSize({ width: 1365, height: 768 });
    expect(await getGridWidthRatio()).toBeCloseTo(1, 2);

    await page.setViewportSize({ width: 390, height: 844 });
    expect(await grid.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').length
    )).toBe(1);
    expect(await getGridWidthRatio()).toBeCloseTo(1, 2);
  });

  test('keeps desktop offer cards compact in height without cropping their images', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });

    const cards = page.locator('.offer-card');
    for (const card of await cards.all()) {
      const image = card.locator('.offer-card-image');
      await expect(image).toHaveCSS('object-fit', 'contain');
      expect(await image.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThanOrEqual(144);
      expect(await card.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan(300);
    }
  });

  test('shows the requested navigation and links to its destinations', async ({ page }) => {
    const menu = page.locator('.primary-nav .nav-link');
    await expect(menu).toHaveText(['Home', 'Solutions', 'Products', 'About us']);

    await expect(menu.filter({ hasText: 'Solutions' })).toHaveAttribute('href', 'solutions.html');
    await expect(menu.filter({ hasText: 'Products' })).toHaveAttribute('href', 'products.html');
    await menu.filter({ hasText: 'Solutions' }).click();
    await expect(page).toHaveTitle('Solutions | DARA Telecom');
    await expect(page).toHaveURL(/\/solutions\.html$/);
    await expect(page.locator('main > section')).toHaveCount(1);
    await expect(page.locator('#solutions-intro, .solution-card, .process-grid, .use-case-list')).toHaveCount(0);
    await expect(page.locator('.solutions-card')).toHaveCount(3);
    await expect(page.locator('.solutions-card h2')).toHaveText([
      'Antenna Field Testing',
      'Off-road drive testing',
      'Non Terrestrial Networks'
    ]);
    await expect(page.locator('.solutions-photo')).toHaveCount(3);
    await expect(page.locator('#contact')).toHaveCount(0);
    await page.goto('/');
    const homeMenu = page.locator('.primary-nav .nav-link');
    await homeMenu.filter({ hasText: 'Products' }).click();
    await expect(page).toHaveTitle('Products | DARA Telecom');
    await expect(page).toHaveURL(/\/products\.html$/);
    expect(await page.locator('.solutions-content-space').evaluate((element) =>
      element.getBoundingClientRect().height
    )).toBeGreaterThanOrEqual(await page.evaluate(() => window.innerHeight));
    await expect(page.locator('#contact h2')).toHaveText('Start with your product needs');
    await expect(homeMenu.filter({ hasText: 'Services' })).toHaveCount(0);
    await expect(homeMenu.filter({ hasText: 'Resources' })).toHaveCount(0);
    await expect(homeMenu.filter({ hasText: 'Partners' })).toHaveCount(0);
  });

  test('searches only existing site sections across both pages', async ({ page }) => {
    const search = page.locator('.site-search');
    await search.locator('input').fill('founder');
    await search.locator('input').press('Enter');

    await expect(search.locator('.site-search-results a', { hasText: 'Built by people' })).toHaveCount(0);
    await expect(search.locator('.site-search-message')).toContainText('No results found');
  });

  test('shows feedback when search has no matches', async ({ page }) => {
    const search = page.locator('.site-search');
    await search.locator('input').fill('unmatched-query');
    await search.locator('input').press('Enter');

    await expect(search.locator('.site-search-results')).toContainText('No results found');
  });

  test('collapses the header into a menu button on phones', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('.menu-toggle');
    const nav = page.locator('.primary-nav');

    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    )).toBe(0);
    await expect(toggle).toBeVisible();
    await expect(page.locator('.masthead-top .nav-actions .btn-brand')).toBeVisible();
    await expect(nav).toBeHidden();
    await expect(page.locator('.site-search')).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.locator('.nav-link')).toHaveText(['Home', 'Solutions', 'Products', 'About us']);
    await expect(page.locator('.site-search')).toBeVisible();
    await expect(page.locator('#themeToggle')).toBeVisible();

    await page.locator('.masthead [data-modal="partner"]').click();
    await expect(page.locator('#modal-partner')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await page.setViewportSize({ width: 1365, height: 768 });
    await expect(toggle).toBeHidden();
    await expect(nav).toBeVisible();
  });

  test('toggles dark mode and persists the preference', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('dara-theme'))).toBe('dark');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(page.locator('.masthead .brand-logo-dark')).toBeVisible();
  });

  test('opens the demo modal and enforces required form fields', async ({ page }) => {
    const modal = page.locator('#modal-demo');

    await page.locator('[data-modal="demo"]').first().click();
    await expect(modal).toBeVisible();
    await expect(modal.locator('.field input, .field textarea')).toHaveCount(4);

    const form = modal.locator('form');
    await expect(form.locator('[required]')).toHaveCount(4);
    await expect(form).toHaveJSProperty('noValidate', false);
    expect(await form.evaluate((element) => element.checkValidity())).toBe(false);

    await modal.locator('[data-close]').first().click();
    await expect(modal).toBeHidden();
  });

  test('uses DARA Telecom branding in the portal login message', async ({ page }) => {
    await page.locator('[data-modal="login"]').first().click();
    await expect(page.locator('#modal-login .sub-modal')).toContainText('DARA Telecom partner portal');
  });

});

test.describe('about page', () => {
  test('keeps the navigation and footer when page content is removed', async ({ page }) => {
    await page.goto('/about_us.html');

    await expect(page).toHaveTitle('About us | DARA Telecom');
    await expect(page.locator('.masthead .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.masthead .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.site-search input')).toHaveAttribute('placeholder', 'Search site');
    await expect(page.locator('.site-search-submit')).toHaveAccessibleName('Search');
    await expect(page.locator('.site-search-submit svg')).toBeVisible();
    await expect(page.locator('.site-search + .btn')).toHaveText('Portal login');
    await expect(page.locator('.masthead-top .nav-actions .btn-brand')).toHaveText('Contact us');
    await expect(page.locator('main')).toHaveCount(0);
    await expect(page.locator('.founder-card, .li-link')).toHaveCount(0);
    await expect(page.locator('.brand a')).toHaveAttribute('href', 'index.html');
    await expect(page.locator('.primary-nav .nav-link')).toHaveText([
      'Home', 'Solutions', 'Products', 'About us'
    ]);
    await expect(page.locator('.primary-nav .nav-link').nth(1)).toHaveAttribute('href', 'solutions.html');
    await expect(page.locator('.primary-nav .nav-link').nth(2)).toHaveAttribute('href', 'products.html');
    await expect(page.locator('.site-footer')).toBeVisible();

    const search = page.locator('.site-search');
    await search.locator('input').fill('What we offer');
    await search.locator('input').press('Enter');
    await expect(search.locator('.site-search-results a', { hasText: 'What we offer and nobody else' })).toBeVisible();

  });
});

test.describe('contact forms', () => {
  const fillDemoForm = async (modal) => {
    await modal.locator('#demo-name').fill('  Test User ');
    await modal.locator('#demo-email').fill('test@example.com');
    await modal.locator('#demo-organisation').fill('Example Rail');
    await modal.locator('#demo-message').fill('Please validate our network.');
  };

  test('sends the demo request and shows confirmation', async ({ page }) => {
    let payload;
    await page.route('https://formsubmit.co/ajax/**', async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { success: 'true', message: 'The form was submitted successfully.' } });
    });
    await page.goto('/');
    const modal = page.locator('#modal-demo');
    await page.locator('[data-modal="demo"]').first().click();
    await fillDemoForm(modal);
    await modal.locator('button[type="submit"]').click();

    await expect(modal.locator('.modal-success')).toBeVisible();
    await expect(modal.locator('form')).toBeHidden();
    expect(payload).toMatchObject({
      _subject: 'DARA Telecom demo request',
      name: 'Test User',
      email: 'test@example.com',
      organisation: 'Example Rail',
      message: 'Please validate our network.',
    });
    await expect(modal.locator('#demo-name')).toHaveValue('');
  });

  test('keeps the visitor on the page and shows an error when sending fails', async ({ page }) => {
    await page.route('https://formsubmit.co/ajax/**', (route) =>
      route.fulfill({ json: { success: 'false', message: 'This form needs Activation.' } })
    );
    await page.goto('/');
    const modal = page.locator('#modal-demo');
    await page.locator('[data-modal="demo"]').first().click();
    await fillDemoForm(modal);
    await modal.locator('button[type="submit"]').click();

    await expect(modal.locator('.form-error')).toContainText("couldn't send your request");
    await expect(modal.locator('.modal-success')).toBeHidden();
    await expect(modal.locator('button[type="submit"]')).toBeEnabled();
    await expect(modal.locator('button[type="submit"]')).toHaveText('Send request');
    await expect(modal.locator('#demo-message')).toHaveValue('Please validate our network.');
    await expect(page).toHaveURL(/127\.0\.0\.1/);
  });

  test('does not send submissions that fill the honeypot field', async ({ page }) => {
    let requests = 0;
    await page.route('https://formsubmit.co/**', (route) => {
      requests += 1;
      return route.abort();
    });
    await page.goto('/');
    const modal = page.locator('#modal-partner');
    await page.locator('[data-modal="partner"]').first().click();
    await modal.locator('#partner-name').fill('Bot');
    await modal.locator('#partner-email').fill('bot@example.com');
    await modal.locator('#partner-organisation').fill('Spam Ltd');
    await modal.locator('#partner-message').fill('Buy now');
    await modal.locator('input[name="_honey"]').evaluate((input) => { input.value = 'filled'; });
    await modal.locator('button[type="submit"]').click();

    await expect(modal.locator('.modal-success')).toBeVisible();
    expect(requests).toBe(0);
  });

  test('opens the matching form on the page the visitor is on', async ({ page }) => {
    await page.goto('/solutions.html');
    await page.locator('.nav-actions .btn-brand').click();
    await expect(page.locator('#modal-demo')).toBeVisible();
    await expect(page).toHaveURL(/\/solutions\.html$/);

    await page.goto('/about_us.html');
    await page.locator('.nav-actions button', { hasText: 'Become a partner' }).click();
    await expect(page.locator('#modal-partner')).toBeVisible();
    await expect(page).toHaveURL(/\/about_us\.html$/);

    await page.goto('/products.html');
    await page.locator('.site-search + .btn').click();
    await expect(page.locator('#modal-login')).toBeVisible();
    await page.locator('#modal-login [data-modal="partner"]').click();
    await expect(page.locator('#modal-partner')).toBeVisible();
    await expect(page).toHaveURL(/\/products\.html$/);
  });

  test('sends a request from a page other than the homepage', async ({ page }) => {
    let payload;
    await page.route('https://formsubmit.co/ajax/**', async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { success: 'true', message: 'The form was submitted successfully.' } });
    });
    await page.goto('/about_us.html');
    const modal = page.locator('#modal-demo');
    await page.locator('.nav-actions .btn-brand').click();
    await fillDemoForm(modal);
    await modal.locator('button[type="submit"]').click();

    await expect(modal.locator('.modal-success')).toBeVisible();
    expect(payload).toMatchObject({ _subject: 'DARA Telecom demo request', email: 'test@example.com' });
    await expect(page).toHaveURL(/\/about_us\.html$/);
  });
});
