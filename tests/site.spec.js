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
    await expect(page.getByText('ABOUT DARA', { exact: true })).toHaveCount(0);
    await expect(page.getByText('THE PEOPLE BEHIND DARA', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'What we offer and nobody else can' })).toHaveCount(0);
    await expect(page.locator('.hero-offerings .solutions-card')).toHaveCount(3);
    await expect(page.locator('.hero-offerings .solutions-card:first-child .solutions-photo')).toHaveAttribute(
      'src',
      'images/dara-drone-satellite-rf-validation.webp'
    );
    await expect.poll(() =>
      page.locator('.hero-offerings .solutions-card:first-child .solutions-photo').evaluate((image) => image.naturalWidth)
    ).toBeGreaterThan(0);
    await expect(page.locator('.hero-offerings .solutions-card:first-child .solutions-photo')).toHaveCSS('object-fit', 'contain');
    await expect(page.locator('.hero-offerings .solutions-card:first-child')).toContainText('Drone + satellite RF validation');
    await expect(page.locator('.hero-offerings .solutions-card:nth-child(2) .solutions-photo')).toHaveAttribute(
      'src',
      'images/dara-secure-audit-ready-data-portal.webp'
    );
    await expect.poll(() =>
      page.locator('.hero-offerings .solutions-card:nth-child(2) .solutions-photo').evaluate((image) => image.naturalWidth)
    ).toBeGreaterThan(0);
    await expect(page.locator('.hero-offerings .solutions-card:nth-child(2)')).toContainText('Secure, audit-ready data portal');
    await expect(page.locator('.hero-offerings .solutions-card:nth-child(3) .solutions-photo')).toHaveAttribute(
      'src',
      'images/dara-analysis-action-automation.webp'
    );
    await expect.poll(() =>
      page.locator('.hero-offerings .solutions-card:nth-child(3) .solutions-photo').evaluate((image) => image.naturalWidth)
    ).toBeGreaterThan(0);
    await expect(page.locator('.hero-offerings .solutions-card:nth-child(3)')).toContainText('Analysis that turns into action');
    const bannerVideo = page.locator('.hero-banner video');
    await expect(page.locator('.hero-banner img')).toHaveCount(0);
    await expect(bannerVideo).toHaveAttribute('autoplay', '');
    await expect(bannerVideo).toHaveAttribute('muted', '');
    await expect(bannerVideo).toHaveAttribute('loop', '');
    await expect.poll(() => bannerVideo.evaluate((video) => video.playbackRate)).toBe(0.5);
    await expect(bannerVideo.locator('source')).toHaveAttribute('src', 'videos/2026.10-PiRealFlightShort.mp4');
    await expect.poll(() => bannerVideo.evaluate((video) => video.videoWidth)).toBeGreaterThan(0);
    expect(await bannerVideo.evaluate((video) => video.getBoundingClientRect().width))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
    const bannerOverlay = page.locator('.hero-banner-blue-overlay');
    const videoBounds = await bannerVideo.evaluate((video) => video.getBoundingClientRect().toJSON());
    const overlayBounds = await bannerOverlay.evaluate((overlay) => overlay.getBoundingClientRect().toJSON());
    const bannerTagline = page.locator('.hero-banner-tagline');
    await expect(bannerTagline).toHaveText('Dare to Reach');
    await expect(bannerTagline).toHaveCSS('position', 'absolute');
    await expect(bannerTagline).toHaveCSS('z-index', '2');
    await expect(bannerTagline).toHaveCSS('opacity', '0');
    await bannerVideo.evaluate((video) => {
      Object.defineProperty(video, 'duration', { configurable: true, get: () => 6.5 });
      Object.defineProperty(video, 'currentTime', { configurable: true, get: () => 5.2 });
      video.dispatchEvent(new Event('timeupdate'));
    });
    await expect(bannerTagline).not.toHaveClass(/is-visible/);
    await bannerVideo.evaluate((video) => {
      Object.defineProperty(video, 'currentTime', { configurable: true, get: () => 5.35 });
      video.dispatchEvent(new Event('timeupdate'));
    });
    await expect(bannerTagline).toHaveClass(/is-visible/);
    await expect(bannerTagline).toHaveCSS('animation-name', 'tagline-sequence');
    await expect(bannerTagline).toHaveCSS('animation-duration', '2.3s');
    const scrollYBeforeTaglineFade = await page.evaluate(() => window.scrollY);
    await bannerTagline.evaluate((tagline) => tagline.getAnimations()[0].finish());
    await expect(bannerTagline).toHaveCSS('opacity', '0');
    await expect(page.locator('.hero')).toHaveClass(/is-presented/);
    await expect(page.locator('.hero')).toHaveCSS('position', 'sticky');
    await expect(page.locator('.hero')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollYBeforeTaglineFade);
    const mastheadHeight = await page.locator('.masthead').evaluate((masthead) =>
      masthead.getBoundingClientRect().height
    );
    await expect.poll(() =>
      page.locator('.hero').evaluate((hero) => hero.getBoundingClientRect().top)
    ).toBeCloseTo(mastheadHeight, 0);
    expect(overlayBounds).toMatchObject({
      x: videoBounds.x,
      y: videoBounds.y,
      width: videoBounds.width,
      height: videoBounds.height
    });
    await expect(bannerOverlay).toHaveCSS('background-color', 'rgba(11, 61, 145, 0.4)');
    const partnerCta = page.locator('.hero-ctas [data-modal="partner"]');
    await expect(partnerCta).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(partnerCta).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-banner')).toHaveCSS('position', 'sticky');
    const scrollYBeforeDownwardScroll = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollYBeforeDownwardScroll);
    await expect.poll(() =>
      page.locator('.hero').evaluate((hero) => hero.getBoundingClientRect().top)
    ).toBeCloseTo(mastheadHeight, 0);
    await expect(page.locator('.explore-card')).toHaveCount(0);
    await expect(page.locator('.cta-band h2')).toHaveText('See how DARA Telecom fits a specific network or site');
    await expect(page.locator('main > section')).toHaveCount(2);
    await expect(page.locator('.footer-brand .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.footer-brand .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.footer-brand .brand-logo-light')).toHaveCSS('height', '42px');
    await expect(page.locator('.footer-brand .brand-logo-dark')).toHaveCSS('height', '42px');
    await expect(page.locator('.site-footer')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
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

  test('keeps the full-width video banner and offer CTAs accessible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 768 });

    const video = page.locator('.hero-banner video');
    await expect.poll(() => video.evaluate((element) => element.videoWidth)).toBeGreaterThan(0);
    expect(await video.evaluate((element) => element.getBoundingClientRect().width))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
    const hero = page.locator('.hero');
    await page.locator('.hero-banner-tagline').evaluate((tagline) => {
      tagline.classList.add('is-visible');
      tagline.getAnimations()[0].finish();
    });
    await expect(hero).toHaveClass(/is-presented/);
    const videoHeight = await video.evaluate((element) => element.getBoundingClientRect().height);
    await expect.poll(() =>
      hero.evaluate((element) => parseFloat(getComputedStyle(element).marginTop))
    ).toBeCloseTo(-videoHeight, 0);
    await expect(page.locator('.hero-ctas')).toBeInViewport({ ratio: 1 });
  });

  test('uses the full content width for offer cards on desktop and mobile', async ({ page }) => {
    const grid = page.locator('.hero-offerings .solutions-grid');
    const getGridWidthRatio = () => page.locator('.hero-offerings').evaluate((container) => {
      const style = getComputedStyle(container);
      const contentWidth = container.clientWidth
        - parseFloat(style.paddingLeft)
        - parseFloat(style.paddingRight);
      return container.querySelector('.solutions-grid').getBoundingClientRect().width / contentWidth;
    });

    await page.setViewportSize({ width: 1365, height: 768 });
    expect(await getGridWidthRatio()).toBeCloseTo(1, 2);

    await page.setViewportSize({ width: 390, height: 844 });
    expect(await grid.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').length
    )).toBe(1);
    expect(await getGridWidthRatio()).toBeCloseTo(1, 2);
  });

  test('sizes homepage card images to their natural proportions', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });

    const cards = page.locator('.hero-offerings .solutions-card');
    for (const card of await cards.all()) {
      const image = card.locator('.solutions-photo');
      await expect(image).toHaveCSS('object-fit', 'contain');
      const dimensions = await image.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          renderedWidth: bounds.width,
          renderedHeight: bounds.height,
          renderedRatio: bounds.width / bounds.height,
          naturalRatio: element.naturalWidth / element.naturalHeight
        };
      });
      expect(dimensions.renderedRatio).toBeCloseTo(dimensions.naturalRatio, 2);
      expect(dimensions.renderedWidth).toBe(dimensions.renderedHeight);
      expect(dimensions.renderedWidth).toBeLessThanOrEqual(180);
      await expect(card).toHaveCSS('border-radius', '18px');
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
    await expect(page.locator('.solutions-header')).toHaveCount(0);
    await expect(page.locator('#solutions-intro, .solution-card, .process-grid, .use-case-list')).toHaveCount(0);
    await expect(page.locator('.solutions-card')).toHaveCount(3);
    await expect(page.locator('.solutions-card h2')).toHaveText([
      'Antenna Field Testing',
      'Off-road drive testing',
      'Non Terrestrial Networks'
    ]);
    const antennaImage = page.locator('.solutions-card:first-child .solutions-photo');
    await expect(antennaImage).toHaveAttribute('src', 'images/solutions-antenna-field-testing.jpg');
    await expect.poll(() => antennaImage.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.solutions-photo')).toHaveCount(3);
    await expect(page.locator('.site-footer .footer-grid > *')).toHaveCount(5);
    await expect(page.locator('.site-footer .footer-col h4')).toHaveText([
      'Product',
      'Company',
      'Resources',
      'Legal'
    ]);
    await expect(page.locator('.site-footer .footer-brand img.brand-logo-light')).toHaveAttribute(
      'src',
      'images/BlueOnWhite.png'
    );
    await expect(page.locator('.site-footer .footer-social-link')).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/dara-telecom/'
    );
    for (const image of await page.locator('.solutions-photo').all()) {
      await expect(image).toHaveCSS('aspect-ratio', '1 / 1');
      await expect(image).toHaveCSS('object-fit', 'contain');
      const { width, height } = await image.evaluate((element) => {
        const { width, height } = element.getBoundingClientRect();
        return { width, height };
      });
      expect(width).toBeCloseTo(height, 0);
    }
    await expect(page.locator('#contact')).toHaveCount(0);
    await page.goto('/');
    const homeMenu = page.locator('.primary-nav .nav-link');
    await homeMenu.filter({ hasText: 'Products' }).click();
    await expect(page).toHaveTitle('Products | DARA Telecom');
    await expect(page).toHaveURL(/\/products\.html$/);
    await expect(page.locator('.solutions-card')).toHaveCount(3);
    await expect(page.locator('.solutions-card h2')).toHaveText([
      'UAV measurements',
      'rApps',
      'Analytics'
    ]);
    await expect(page.locator('.solutions-card').nth(0).locator('li')).toHaveText([
      'Light and compact measurements equipment payloads.',
      'Customized long-range drones.',
      'Predefined routes and automatic navigation.'
    ]);
    await expect(page.locator('.solutions-card').nth(1).locator('li')).toHaveText([
      'ORAN based, vendors neutral network interfaces.',
      'Collection of network recorded events and measurements'
    ]);
    await expect(page.locator('.solutions-card').nth(2).locator('li')).toHaveText([
      'Easy to navigate browser-based portal.',
      'Measurements databases, geographical maps and statistical charts analytics.',
      'Intelligent problems discovery and diagnostics.',
      'Uplink (rApps) and Downlink (UAV) recordings correlation.'
    ]);
    await expect(page.locator('.site-footer .footer-grid > *')).toHaveCount(5);
    await expect(homeMenu.filter({ hasText: 'Services' })).toHaveCount(0);
    await expect(homeMenu.filter({ hasText: 'Resources' })).toHaveCount(0);
    await expect(homeMenu.filter({ hasText: 'Partners' })).toHaveCount(0);
  });

  test('uses the same footer and three-column layout as the Solutions page', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await page.goto('/solutions.html');
    const solutionsFooter = await page.locator('.site-footer').innerHTML();

    await page.goto('/products.html');
    const desktopCardPositions = await page.locator('.solutions-card').evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().x)
    );
    expect(desktopCardPositions[0]).toBeLessThan(desktopCardPositions[1]);
    expect(desktopCardPositions[1]).toBeLessThan(desktopCardPositions[2]);
    expect(await page.locator('.site-footer').innerHTML()).toBe(solutionsFooter);

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileCardPositions = await page.locator('.solutions-card').evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y } = card.getBoundingClientRect();
        return { x, y };
      })
    );
    expect(mobileCardPositions[0].x).toBe(mobileCardPositions[1].x);
    expect(mobileCardPositions[1].y).toBeLessThan(mobileCardPositions[2].y);
  });

  test('shows the matching document image in each Products section', async ({ page }) => {
    await page.goto('/products.html');

    const images = page.locator('.solutions-card .solutions-photo');
    expect(await images.evaluateAll((elements) => elements.map((image) => image.getAttribute('src')))).toEqual([
      'images/products-uav-measurements.png',
      'images/products-rapps.jpeg',
      'images/products-analytics.jpeg'
    ]);
    expect(await images.evaluateAll((elements) => elements.map((image) => image.getAttribute('alt')))).toEqual([
      'DARA UAV carrying its measurement equipment payload',
      'Robotic hand representing network applications',
      'Telecom analysts viewing network measurement data'
    ]);

    for (const image of await images.all()) {
      await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    }
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

test.describe('home2 page', () => {
  test('retains the original image banner instead of showing the video', async ({ page }) => {
    await page.goto('/home2.html');

    const banner = page.locator('.hero-banner');
    const image = banner.locator('img');
    await expect(image).toHaveAttribute('src', 'images/dara-telecom-our-vision-banner-muted.webp');
    await expect(image).toBeVisible();
    await expect(banner.locator('video')).toHaveCount(0);
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    expect(await image.evaluate((element) => element.getBoundingClientRect().width))
      .toBe(await page.evaluate(() => window.innerWidth));
    await expect(banner.locator('.hero-banner-fx')).toBeVisible();
  });
});

test.describe('about page', () => {
  test('shows goal, mission, vision, and founding team photo slots', async ({ page }) => {
    await page.goto('/about_us.html');

    await expect(page).toHaveTitle('About us | DARA Telecom');
    await expect(page.locator('.masthead .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.masthead .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.site-search input')).toHaveAttribute('placeholder', 'Search site');
    await expect(page.locator('.site-search-submit')).toHaveAccessibleName('Search');
    await expect(page.locator('.site-search-submit svg')).toBeVisible();
    await expect(page.locator('.site-search + .btn')).toHaveText('Portal login');
    await expect(page.locator('.masthead-top .nav-actions .btn-brand')).toHaveText('Contact us');
    await expect(page.locator('main h1')).toHaveText('Building what’s next in telecom.');
    await expect(page.locator('.about-purpose-card')).toHaveCount(3);
    await expect(page.locator('.about-purpose-card').nth(0)).toContainText('Help network operators make faster, more confident decisions');
    await expect(page.locator('.about-purpose-card').nth(1)).toContainText('Give network operators a faster, clearer picture');
    await expect(page.locator('.about-purpose-card').nth(2)).toContainText('To redefine what’s possible in telecom');
    await expect(page.locator('.about-purpose-card .about-eyebrow')).toHaveText([
      'OUR GOAL', 'OUR MISSION', 'OUR VISION'
    ]);
    await expect(page.locator('.about-purpose-image')).toHaveCount(3);
    await expect(page.locator('.about-purpose-image').nth(0)).toHaveAttribute('src', 'images/about-goal-scene.svg');
    await expect(page.locator('.about-purpose-image').nth(0)).toHaveAttribute('alt', /drone sending measurements to an analytics dashboard/);
    await expect(page.locator('.about-purpose-image').nth(1)).toHaveAttribute('src', 'images/about-mission-scene.svg');
    await expect(page.locator('.about-purpose-image').nth(1)).toHaveAttribute('alt', /network-inspection drone/);
    await expect(page.locator('.about-purpose-image').nth(2)).toHaveAttribute('src', 'images/about-vision-scene.svg');
    await expect(page.locator('.about-purpose-image').nth(2)).toHaveAttribute('alt', /connected cities and a high-speed train/);
    await expect.poll(() => page.locator('.about-purpose-image').evaluateAll((images) =>
      images.every((image) => image.complete && image.naturalWidth > 0)
    )).toBe(true);
    await expect(page.locator('.brand a')).toHaveAttribute('href', 'index.html');
    await expect(page.locator('.primary-nav .nav-link')).toHaveText([
      'Home', 'Solutions', 'Products', 'About us'
    ]);
    await expect(page.locator('.primary-nav .nav-link').nth(1)).toHaveAttribute('href', 'solutions.html');
    await expect(page.locator('.primary-nav .nav-link').nth(2)).toHaveAttribute('href', 'products.html');
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('#about-team-title')).toHaveText('Team');
    await expect(page.locator('.about-team-heading > p:last-child')).toHaveText('Meet the team building what’s next in telecom.');
    await expect(page.locator('.about-team-photo')).toHaveCount(3);
    await expect(page.locator('.about-team-photo[role="img"]').nth(0)).toHaveAttribute('aria-label', 'Photo placeholder for founding team member 1');
    await expect(page.locator('.about-team-slot h3')).toHaveText([
      'Mo Nadder', 'Ahmed Nadder', 'Mo Abdelaziz'
    ]);
    await expect(page.locator('.about-team-slot > p')).toHaveText(['CTO', 'CIO', 'CIO']);

    const search = page.locator('.site-search');
    await search.locator('input').fill('mission');
    await search.locator('input').press('Enter');
    await expect(search.locator('.site-search-results a', { hasText: 'Building what’s next in telecom.' })).toBeVisible();

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
