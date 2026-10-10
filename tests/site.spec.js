import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the core sections and navigation targets', async ({ page }) => {
    await expect(page).toHaveTitle('DARA Telecom');
    await expect(page.locator('.masthead .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.masthead .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.masthead .brand a')).toHaveAttribute('href', 'index.html');
    await expect(page.locator('.site-search input')).toHaveAttribute('placeholder', 'Search site');
    await expect(page.locator('.site-search-submit')).toHaveAccessibleName('Search');
    await expect(page.locator('.site-search + .btn')).toHaveText('Portal login');
    await expect(page.locator('.masthead-top .nav-actions .btn-brand')).toHaveText('Contact us');

    const bannerVideo = page.locator('.hero-banner-video');
    await expect(bannerVideo).toHaveAttribute('autoplay', '');
    await expect(bannerVideo).toHaveAttribute('muted', '');
    await expect(bannerVideo).toHaveAttribute('loop', '');
    await expect(bannerVideo.locator('source')).toHaveAttribute('src', 'videos/dara-drone-flight.mp4');
    await expect.poll(() => bannerVideo.evaluate((video) => video.playbackRate)).toBe(0.5);
    await expect(page.locator('.hero-nav-links a')).toHaveText(['Solutions', 'Products', 'About us']);
    await expect(page.locator('.hero-ctas [data-modal="demo"]')).toHaveCount(1);
    await expect(page.locator('.hero-ctas [data-modal="partner"]')).toHaveCount(1);
    await expect(page.locator('.hero-sequence-logo')).toHaveAttribute('src', 'images/dara-logo.png');

    const tagline = page.locator('.hero-banner-tagline');
    await bannerVideo.evaluate((video) => {
      Object.defineProperty(video, 'duration', { configurable: true, get: () => 6.5 });
      Object.defineProperty(video, 'currentTime', { configurable: true, get: () => 3 });
      video.dispatchEvent(new Event('timeupdate'));
    });
    await expect(tagline).toHaveClass(/is-active/);
    await expect(page.locator('.hero-sequence-count')).toHaveText('01 / 05');
    await expect(page.locator('.hero-sequence-copy h1')).toHaveText('Reach');

    const footer = page.locator('.site-footer');
    await expect(footer.locator('.footer-brand .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(footer.locator('.footer-social-link')).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/dara-telecom/'
    );
    await expect(footer.locator('.footer-home-links a')).toHaveText([
      'About DARA', 'About us', 'Newsroom', 'Careers', 'Investors Relations', 'Contact'
    ]);
    await expect(footer.locator('.footer-home-legal a')).toHaveText(['Privacy Policy', 'Terms of Use']);
  });

  test('returns to the top of the homepage when the logo is clicked', async ({ page }) => {
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.locator('.masthead .brand a').click();
    await expect(page).toHaveURL(/\/(?:index\.html)?$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('starts the five-stage animation with Reach', async ({ page }) => {
    expect(await page.evaluate(() => heroMessages.map(({ heading }) => heading))).toEqual([
      'Reach',
      'Measure',
      'Analyze',
      'Ready',
      'Achieve Boundless Connectivity'
    ]);

    const video = page.locator('.hero-banner-video');
    await video.evaluate((element) => {
      Object.defineProperty(element, 'duration', { configurable: true, get: () => 6.5 });
      Object.defineProperty(element, 'currentTime', { configurable: true, get: () => 3 });
      element.dispatchEvent(new Event('timeupdate'));
    });

    await expect(page.locator('.hero-sequence-count')).toHaveText('01 / 05');
    await expect(page.locator('.hero-sequence-copy h1')).toHaveText('Reach');
    await expect(page.locator('.hero-sequence-logo')).toHaveAttribute('alt', 'DARA Telecom');
    await expect(page.locator('.hero-nav-links a')).toHaveText(['Solutions', 'Products', 'About us']);
  });

  test('uses the requested navigation links on secondary pages without a Home item', async ({ page }) => {
    for (const [path, expectedTitle, activeLabel] of [
      ['/solutions.html', 'Solutions | DARA Telecom', 'Solutions'],
      ['/products.html', 'Products | DARA Telecom', 'Products'],
      ['/about_us.html', 'About us | DARA Telecom', 'About us']
    ]) {
      await page.goto(path);
      await expect(page).toHaveTitle(expectedTitle);
      await expect(page.locator('.primary-nav .nav-link')).toHaveText([
        'Solutions', 'Products', 'About us'
      ]);
      await expect(page.locator('.primary-nav .nav-link[aria-current="page"]')).toHaveText(activeLabel);
      await expect(page.locator('.primary-nav .nav-link', { hasText: /^Home$/ })).toHaveCount(0);
      await expect(page.locator('.site-footer .footer-home-links a')).toHaveText([
        'About DARA', 'About us', 'Newsroom', 'Careers', 'Investors Relations', 'Contact'
      ]);
    }
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
    await page.goto('/solutions.html');
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
    await expect(nav.locator('.nav-link')).toHaveText(['Solutions', 'Products', 'About us']);
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
  test('shows concise DARA purpose statements and headshot slots for the team', async ({ page }) => {
    await page.goto('/about_us.html');

    await expect(page).toHaveTitle('About us | DARA Telecom');
    await expect(page.locator('.masthead .brand-logo-light')).toHaveAttribute('src', /BlueOnWhite\.png$/);
    await expect(page.locator('.masthead .brand-logo-dark')).toHaveAttribute('src', /WhiteBlueOnBlack\.png$/);
    await expect(page.locator('.site-search input')).toHaveAttribute('placeholder', 'Search site');
    await expect(page.locator('.site-search-submit')).toHaveAccessibleName('Search');
    await expect(page.locator('.site-search-submit svg')).toBeVisible();
    await expect(page.locator('.site-search + .btn')).toHaveText('Portal login');
    await expect(page.locator('.masthead-top .nav-actions .btn-brand')).toHaveText('Contact us');
    await expect(page.locator('main h1')).toHaveText('Building readiness for what’s next in telecom.');
    await expect(page.locator('.about-purpose-card')).toHaveCount(3);
    await expect(page.locator('.about-purpose-card').nth(0)).toContainText('Reach the hard-to-reach. Turn real-world coverage into insight operators can act on.');
    await expect(page.locator('.about-purpose-card').nth(1)).toContainText('Close coverage gaps. Get networks ready for what’s next.');
    await expect(page.locator('.about-purpose-card').nth(2)).toContainText('A world with no edge, no gap, and no ceiling—Networks Without Bounds.');
    await expect(page.locator('.about-purpose-card .about-eyebrow')).toHaveText([
      'OUR MISSION', 'OUR GOAL', 'OUR VISION'
    ]);
    await expect(page.locator('.about-purpose-card img')).toHaveCount(0);
    await expect(page.locator('.about-team-headshot')).toHaveCount(3);
    await expect(page.locator('.about-team-headshot-label')).toHaveText([
      'ADD HEADSHOT', 'ADD HEADSHOT', 'ADD HEADSHOT'
    ]);
    await expect(page.locator('.about-journey-steps li')).toHaveCount(5);
    await expect(page.locator('.about-journey-steps .about-step-name')).toHaveText([
      'Reach', 'Measure', 'Analyse', 'Ready', 'Boundless Connectivity'
    ]);
    await expect(page.locator('.brand a')).toHaveAttribute('href', 'index.html');
    await expect(page.locator('.primary-nav .nav-link')).toHaveText([
      'Solutions', 'Products', 'About us'
    ]);
    await expect(page.locator('.primary-nav .nav-link').nth(0)).toHaveAttribute('href', 'solutions.html');
    await expect(page.locator('.primary-nav .nav-link').nth(1)).toHaveAttribute('href', 'products.html');
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('#about-team-title')).toHaveText('Built by people who think ahead.');
    await expect(page.locator('.about-team-heading > p:last-child')).toHaveText('Meet the team working to make telecom ready for what’s next.');
    await expect(page.locator('.about-team-member h3')).toHaveText([
      'Mo Nadder', 'Ahmed Nadder', 'Mo Abdelaziz'
    ]);
    await expect(page.locator('.about-team-member .about-team-details > p')).toHaveText(['CTO', 'CIO', 'CIO']);
    await expect(page.locator('.about-intro')).toHaveText(
      'DARA uses drone-led analytics to reveal coverage gaps and prepare networks for Boundless Connectivity.'
    );
    await expect(page.locator('.about-tagline')).toHaveCount(0);

    const search = page.locator('.site-search');
    await search.locator('input').fill('mission');
    await search.locator('input').press('Enter');
    await expect(search.locator('.site-search-results a', { hasText: 'Building readiness for what’s next in telecom.' })).toBeVisible();

  });
});

test('keeps the shared pages free of horizontal overflow at responsive widths', async ({ page }) => {
  const paths = ['/', '/solutions.html', '/products.html', '/about_us.html'];

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });

    for (const path of paths) {
      await page.goto(path);
      expect(
        await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth
        ),
        `${path} should not overflow horizontally at ${width}px`
      ).toBe(0);

      const footerLinks = page.locator('.footer-home-links a');
      await expect(footerLinks).toHaveCount(6);
      expect(
        await footerLinks.evaluateAll((links) =>
          links.every((link) =>
            Math.abs(link.getBoundingClientRect().top - links[0].getBoundingClientRect().top) < 1
          )
        ),
        `${path} footer links should stay on one line at ${width}px`
      ).toBe(true);

      if (path === '/about_us.html') {
        expect(
          await page.locator('.about-team-photo').evaluateAll((photos) =>
            photos.every((photo) =>
              photo.getBoundingClientRect().right <= document.documentElement.clientWidth
            )
          ),
          `About us team photos should fit at ${width}px`
        ).toBe(true);
      }

      if (path === '/' && width <= 390) {
        const mobileHeroLayout = await page.evaluate(() => {
          const banner = document.querySelector('.hero-banner');
          const tagline = document.querySelector('.hero-banner-tagline');
          const copy = document.querySelector('.hero-sequence-copy');
          const logo = document.querySelector('.hero-sequence-logo');
          const nav = document.querySelector('.hero-nav-links');
          const ctas = document.querySelector('.hero-ctas');
          const bounds = (element) => {
            const { top, right, bottom, left } = element.getBoundingClientRect();
            return { top, right, bottom, left };
          };
          const overlaps = (first, second) =>
            first.left < second.right && first.right > second.left &&
            first.top < second.bottom && first.bottom > second.top;

          tagline.classList.add('is-active');
          copy.classList.add('is-current');
          banner.classList.add('is-presented');
          copy.querySelector('h1').textContent = 'Achieve Boundless Connectivity';
          copy.querySelector('p').textContent =
            'Close coverage gaps. Prepare for what is next. Capture real-world terrestrial and satellite coverage.';

          const navBounds = bounds(nav);
          const copyBounds = bounds(copy);
          const ctaBounds = bounds(ctas);
          logo.classList.add('is-visible');
          const logoBounds = bounds(logo);

          return {
            navAndCopyOverlap: overlaps(navBounds, copyBounds),
            copyAndCtasOverlap: overlaps(copyBounds, ctaBounds),
            navAndLogoOverlap: overlaps(navBounds, logoBounds),
            logoAndCtasOverlap: overlaps(logoBounds, ctaBounds)
          };
        });

        expect(mobileHeroLayout).toEqual({
          navAndCopyOverlap: false,
          copyAndCtasOverlap: false,
          navAndLogoOverlap: false,
          logoAndCtasOverlap: false
        });
      }
    }
  }
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
