import { test, expect } from '@playwright/test';

test('edita controles e regenera CSS', async ({ page }) => {
  await page.goto('/');

  const opacity = page.locator('#opacityRange');
  await opacity.fill('0.45');

  const blur = page.locator('#blurRange');
  await blur.fill('26');

  const output = page.getByTestId('css-output');
  await expect(output).toHaveValue(/blur\(26px\)/);
  await expect(output).toHaveValue(/background: rgba\(255, 255, 255, 0\.28\)/);
});

test('copia css com feedback visual', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('copy-button').click();
  await expect(page.locator('#copyButtonLabel')).toHaveText('Copiado!');
});

test('baixa css', async ({ page }) => {
  await page.goto('/');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('download-button').click(),
  ]);
  await expect(download.suggestedFilename()).toBe('glass-effect.css');
});

test('limpa e restaura defaults', async ({ page }) => {
  await page.goto('/');
  await page.locator('#opacityRange').fill('0.5');
  await page.locator('#blurRange').fill('30');
  await page.getByTestId('reset-button').click();

  await expect(page.locator('#opacityValue')).toHaveText('0.28');
  await expect(page.locator('#blurValue')).toHaveText('18px');
});

test('alterna tipo de fundo', async ({ page }) => {
  await page.goto('/');

  await page.selectOption('#backgroundType', 'solid');
  await expect(page.locator('#solidControls')).not.toHaveClass(/hidden/);

  await page.selectOption('#backgroundType', 'image');
  await expect(page.locator('#imageControls')).not.toHaveClass(/hidden/);

  await page.selectOption('#backgroundType', 'gradient');
  await expect(page.locator('#gradientControls')).not.toHaveClass(/hidden/);
});
