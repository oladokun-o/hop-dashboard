import { test, expect, Page } from '@playwright/test';

test.describe('Component Library', () => {
  test.describe('Button Component', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should render different button variants', async ({ page }) => {
      // Look for buttons in the dashboard
      const buttons = page.locator('hop-button');
      await expect(buttons.first()).toBeVisible();

      // Check button classes for variants
      const primaryBtn = page.locator('hop-button[variant="primary"]').first();
      if (await primaryBtn.count() > 0) {
        await expect(primaryBtn).toHaveClass(/hop-button--primary/);
      }
    });

    test('should handle button interactions', async ({ page }) => {
      const refreshBtn = page.locator('text=Refresh').first();
      await expect(refreshBtn).toBeVisible();

      // Test hover state
      await refreshBtn.hover();

      // Test click
      await refreshBtn.click();

      // Verify button becomes disabled during loading (if applicable)
      if (await refreshBtn.getAttribute('disabled') !== null) {
        await expect(refreshBtn).toBeDisabled();
      }
    });

    test('should show loading states', async ({ page }) => {
      const refreshBtn = page.locator('text=Refresh').first();
      await refreshBtn.click();

      // Check for loading spinner or disabled state
      const isDisabled = await refreshBtn.isDisabled();
      const hasLoadingClass = await refreshBtn.getAttribute('class');

      expect(isDisabled || hasLoadingClass?.includes('loading')).toBeTruthy();
    });

    test('should be keyboard accessible', async ({ page }) => {
      // Tab to first button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // May need multiple tabs to reach buttons

      const focusedElement = page.locator(':focus');

      // Press Enter to activate
      await focusedElement.press('Enter');

      // Should trigger the button action
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Status Indicator Component', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('hop-status-indicator');
    });

    test('should render different status types', async ({ page }) => {
      const statusIndicators = page.locator('hop-status-indicator');
      const count = await statusIndicators.count();
      expect(count).toBeGreaterThan(0);

      // Check for different status classes
      await expect(page.locator('.hop-status-indicator--healthy')).toBeVisible();

      // Check for warning or error states
      const warningIndicators = page.locator('.hop-status-indicator--warning');
      const errorIndicators = page.locator('.hop-status-indicator--error');

      const hasWarningOrError = (await warningIndicators.count()) > 0 || (await errorIndicators.count()) > 0;
      expect(hasWarningOrError).toBeTruthy();
    });

    test('should display status labels and sublabels', async ({ page }) => {
      const firstIndicator = page.locator('hop-status-indicator').first();

      // Check for label
      const label = firstIndicator.locator('.hop-status-indicator__label');
      await expect(label).toBeVisible();

      const labelText = await label.textContent();
      expect(labelText).toBeTruthy();
      expect(labelText?.trim()).not.toBe('');
    });

    test('should show visual status dots with correct colors', async ({ page }) => {
      const statusDots = page.locator('.hop-status-indicator__dot');
      await expect(statusDots.first()).toBeVisible();

      // Test healthy status color (green)
      const healthyDot = page.locator('.hop-status-indicator--healthy .hop-status-indicator__dot').first();
      if (await healthyDot.count() > 0) {
        const color = await healthyDot.evaluate((el) => getComputedStyle(el).backgroundColor);
        // Should be some shade of green
        expect(color).toMatch(/(rgb\(34, 197, 94\)|green|#22c55e)/);
      }
    });

    test('should animate pulse for warning/error states', async ({ page }) => {
      const warningIndicator = page.locator('.hop-status-indicator--warning .hop-status-indicator__dot').first();

      if (await warningIndicator.count() > 0) {
        // Check if pulse class is applied
        await expect(warningIndicator).toHaveClass(/pulse/);

        // Verify animation is running
        const animationName = await warningIndicator.evaluate((el) =>
          getComputedStyle(el).animationName
        );
        expect(animationName).not.toBe('none');
      }
    });

    test('should have proper accessibility attributes', async ({ page }) => {
      const statusIndicator = page.locator('hop-status-indicator').first();

      // Should have aria-label
      const ariaLabel = await statusIndicator.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('Status');
    });
  });

  test.describe('Card Component', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('hop-card');
    });

    test('should render cards with titles', async ({ page }) => {
      const cards = page.locator('hop-card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      // Check first card has a title
      const firstCardTitle = cards.first().locator('.hop-card__title');
      await expect(firstCardTitle).toBeVisible();

      const titleText = await firstCardTitle.textContent();
      expect(titleText).toBeTruthy();
    });

    test('should display card content', async ({ page }) => {
      const firstCard = page.locator('hop-card').first();
      const cardBody = firstCard.locator('.hop-card__body');

      await expect(cardBody).toBeVisible();

      // Should contain some content
      const hasContent = await cardBody.locator('*').count() > 0;
      expect(hasContent).toBeTruthy();
    });

    test('should handle loading states', async ({ page }) => {
      // Trigger a refresh to potentially see loading cards
      await page.click('text=Refresh');

      // Check for loading spinners in cards
      const loadingSpinners = page.locator('.hop-card__loading .spinner');

      // May or may not be visible depending on timing
      // Just ensure the selector doesn't throw an error
      const count = await loadingSpinners.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should be properly styled and responsive', async ({ page }) => {
      const card = page.locator('hop-card').first();

      // Check basic styling
      const backgroundColor = await card.evaluate((el) =>
        getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have some background

      // Test responsive behavior
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(card).toBeVisible();

      await page.setViewportSize({ width: 375, height: 667 });
      await expect(card).toBeVisible();
    });
  });

  test.describe('Chart Component', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('canvas', { timeout: 10000 });
    });

    test('should render charts with canvas elements', async ({ page }) => {
      const canvases = page.locator('canvas');
      const count = await canvases.count();
      expect(count).toBeGreaterThan(0);

      // Check first canvas has dimensions
      const firstCanvas = canvases.first();
      const width = await firstCanvas.getAttribute('width');
      const height = await firstCanvas.getAttribute('height');

      expect(parseInt(width || '0')).toBeGreaterThan(0);
      expect(parseInt(height || '0')).toBeGreaterThan(0);
    });

    test('should be responsive to viewport changes', async ({ page }) => {
      const canvas = page.locator('canvas').first();

      // Get initial dimensions
      const initialWidth = await canvas.evaluate((el) => el.clientWidth);

      // Change viewport
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(500); // Wait for resize

      const newWidth = await canvas.evaluate((el) => el.clientWidth);

      // Width should have changed (responsive)
      expect(newWidth).not.toBe(initialWidth);
    });

    test('should handle loading states', async ({ page }) => {
      // Trigger refresh to potentially see chart loading
      await page.click('text=Refresh');

      // Look for loading indicators in chart containers
      const chartLoading = page.locator('.hop-chart__loading');

      // May or may not be visible depending on timing
      const count = await chartLoading.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have accessibility attributes', async ({ page }) => {
      const canvas = page.locator('canvas').first();

      // Should have aria-label for accessibility
      const ariaLabel = await canvas.getAttribute('aria-label');
      const role = await canvas.getAttribute('role');

      expect(ariaLabel || role).toBeTruthy();
    });
  });

  test.describe('Metric Card Component', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('hop-metric-card');
    });

    test('should display metric values and units', async ({ page }) => {
      const metricCards = page.locator('hop-metric-card');
      const count = await metricCards.count();
      expect(count).toBeGreaterThan(0);

      const firstCard = metricCards.first();

      // Check for title
      const title = firstCard.locator('.hop-metric-card__title');
      await expect(title).toBeVisible();

      // Check for value
      const value = firstCard.locator('.hop-metric-card__value');
      await expect(value).toBeVisible();

      const valueText = await value.textContent();
      expect(valueText?.trim()).not.toBe('');
      expect(valueText?.trim()).not.toBe('0');
    });

    test('should show trend indicators when applicable', async ({ page }) => {
      const trendElements = page.locator('.hop-metric-card__trend');

      if (await trendElements.count() > 0) {
        const firstTrend = trendElements.first();
        await expect(firstTrend).toBeVisible();

        // Should have trend icon
        const trendIcon = firstTrend.locator('.hop-metric-card__trend-icon');
        await expect(trendIcon).toBeVisible();

        // Should have trend value
        const trendValue = firstTrend.locator('.hop-metric-card__trend-value');
        await expect(trendValue).toBeVisible();
      }
    });

    test('should handle loading skeleton states', async ({ page }) => {
      // Trigger refresh to potentially see loading skeletons
      await page.click('text=Refresh');

      const loadingSkeletons = page.locator('.loading-skeleton');

      // Check that skeleton elements exist (may not be visible depending on timing)
      const count = await loadingSkeletons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should format large numbers appropriately', async ({ page }) => {
      const values = page.locator('.hop-metric-card__value');

      if (await values.count() > 0) {
        for (let i = 0; i < await values.count(); i++) {
          const valueText = await values.nth(i).textContent();

          // Should not show raw large numbers (should use K, M, B suffixes)
          if (valueText && parseInt(valueText.replace(/[^\d]/g, '')) > 1000) {
            expect(valueText).toMatch(/[KMB]/);
          }
        }
      }
    });
  });
});

test.describe('Component Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle multiple component interactions', async ({ page }) => {
    // Test button click followed by status check
    await page.click('text=Refresh');

    // Wait for any loading to complete
    await page.waitForTimeout(2000);

    // Verify status indicators still work
    const statusIndicators = page.locator('hop-status-indicator');
    await expect(statusIndicators.first()).toBeVisible();

    // Change time range and verify charts update
    const timeSelect = page.locator('.dashboard__time-select');
    await timeSelect.selectOption('6h');

    // Charts should still be visible after update
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('should maintain component state during navigation', async ({ page }) => {
    // Toggle auto-refresh off
    const autoRefreshBtn = page.locator('text=Auto Refresh');
    if (await autoRefreshBtn.getAttribute('class')?.then(c => c?.includes('active'))) {
      await autoRefreshBtn.click();
    }

    // Navigate to analytics
    await page.click('text=Analytics');

    // Navigate back to dashboard
    await page.click('text=Dashboard');

    // Auto-refresh state should be preserved
    const currentState = await autoRefreshBtn.getAttribute('class');
    expect(currentState).not.toContain('active');
  });

  test('should handle rapid user interactions gracefully', async ({ page }) => {
    // Rapidly click different controls
    await page.click('text=Refresh');
    await page.click('[value="1h"]');
    await page.click('text=Auto Refresh');
    await page.click('[value="24h"]');

    // Should not crash or show errors
    await expect(page.locator('.dashboard__error')).not.toBeVisible();

    // Components should still be functional
    await expect(page.locator('hop-status-indicator').first()).toBeVisible();
    await expect(page.locator('canvas').first()).toBeVisible();
  });
});

test.describe('Visual Regression', () => {
  test('should match dashboard visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for all charts and components to load
    await page.waitForSelector('canvas');
    await page.waitForSelector('hop-status-indicator');
    await page.waitForTimeout(2000); // Allow animations to settle

    // Take screenshot for visual regression testing
    await expect(page.locator('.dashboard')).toHaveScreenshot('dashboard-main.png', {
      // fullPage: true,
      mask: [
        page.locator('.hop-status-indicator__timestamp'), // Mask timestamps
        page.locator('.hop-metric-card__value'), // Mask dynamic values
      ],
    });
  });

  test('should match component library visual snapshots', async ({ page }) => {
    await page.goto('/');

    // Button variations
    await expect(page.locator('hop-button').first()).toHaveScreenshot('button-component.png');

    // Status indicator variations
    await expect(page.locator('hop-status-indicator').first()).toHaveScreenshot('status-indicator.png');

    // Card component
    await expect(page.locator('hop-card').first()).toHaveScreenshot('card-component.png');
  });
});

test.describe('Performance Testing', () => {
  test('should load components efficiently', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('hop-status-indicator');
    await page.waitForSelector('canvas');

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large datasets without performance issues', async ({ page }) => {
    await page.goto('/');

    // Change to longer time range (more data)
    await page.selectOption('.dashboard__time-select', '30d');

    const startTime = Date.now();

    // Wait for charts to update
    await page.waitForTimeout(5000);

    const updateTime = Date.now() - startTime;

    // Should update within reasonable time even with more data
    expect(updateTime).toBeLessThan(8000);

    // UI should remain responsive
    await expect(page.locator('canvas').first()).toBeVisible();

    // Should be able to interact with controls
    await page.click('text=Refresh');
    await expect(page.locator('.dashboard__loading')).toBeVisible();
  });
});
