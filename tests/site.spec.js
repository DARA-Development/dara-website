import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the core sections and navigation targets', async ({ page }) => {
    await expect(page).toHaveTitle('DARA');
    await expect(page.locator('.hero h1')).toContainText('Ground truth');
    await expect(page.locator('.explore-card')).toHaveCount(4);

    for (const id of ['home', 'svc-field', 'svc-portal', 'svc-analysis', 'svc-marketplace', 'investors']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('opens and closes the products dropdown', async ({ page }) => {
    const dropdown = page.locator('#productsDD');

    await expect(dropdown).not.toHaveClass(/open/);
    await page.locator('[data-dd-toggle]').click();
    await expect(dropdown).toHaveClass(/open/);
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await expect(dropdown).not.toHaveClass(/open/);
  });

  test('toggles dark mode and persists the preference', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('dara-theme'))).toBe('dark');
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

  test('scrolls to a requested section and closes the dropdown', async ({ page }) => {
    await page.locator('[data-dd-toggle]').click();
    await page.locator('#productsDD [data-scroll="svc-analysis"]').click();

    await expect(page.locator('#svc-analysis')).toBeInViewport();
    await expect(page.locator('#productsDD')).not.toHaveClass(/open/);
  });
});

test.describe('about page', () => {
  test('renders founder content and links back to the homepage', async ({ page }) => {
    await page.goto('/about_us.html');

    await expect(page).toHaveTitle('About us | DARA+');
    await expect(page.locator('h1')).toContainText('Built by people');
    await expect(page.locator('.founder-card')).toHaveCount(3);
    await expect(page.locator('.li-link')).toHaveCount(3);
    await expect(page.locator('.brand a')).toHaveAttribute('href', 'index.html');
  });
});
