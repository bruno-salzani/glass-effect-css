import { test, expect } from '@playwright/test';

test('carrega app e componentes principais', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /Gerador de Glassmorphism CSS/i })).toBeVisible();
  await expect(page.locator('#previewStage')).toBeVisible();
  await expect(page.getByTestId('css-output')).toBeVisible();
  await expect(page.getByTestId('copy-button')).toBeVisible();
  await expect(page.getByTestId('download-button')).toBeVisible();
  await expect(page.getByTestId('reset-button')).toBeVisible();
});
