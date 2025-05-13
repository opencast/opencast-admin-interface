import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});
test.describe("Header", () => {
    test('check existence of header items', async ({ page }) => {
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.locator('#lang-dd')).toBeVisible();
        await expect(page.locator('div:nth-child(2)').first()).toBeVisible();
        await expect(page.locator('#nav-dd-container > div:nth-child(3)')).toBeVisible();
        await expect(page.locator('#info-dd')).toBeVisible();
        await expect(page.locator('#help-dd')).toBeVisible();
    });

    test('check language change dropdown', async ({ page }) => {
        test.setTimeout(120_000);
        await page.goto("/#/recordings/recordings");
        await page.locator('#lang-dd').click();
        await page.getByRole('button', { name: 'English (US)' }).click();
        await expect(page.locator('h1')).toContainText('Locations', {timeout: 120_000}); // the full page reload after changing the color takes much longer on the firefox browser
        await page.locator('#lang-dd').click();
        await page.getByRole('button', { name: 'Deutsch' }).click();
        await expect(page.locator('h1')).toContainText('Standorte', {timeout: 120_000});
    });
});
