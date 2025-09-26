import { test, expect, Page } from '@playwright/test';

test.describe('Hop Dashboard', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');

    // Wait for initial data load
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Header and Navigation', () => {
    test('should display dashboard header with bunny branding', async () => {
      // Check main title
      const title = page.locator('h1');
      await expect(title).toContainText('🐇 Hop Dashboard');

      // Check subtitle
      const subtitle = page.locator('text=Global Edge Network Monitoring & Analytics');
      await expect(subtitle).toBeVisible();

      // Check navigation is present
      const nav = page.locator('.app__nav');
      await expect(nav).toBeVisible();
    });

    test('should have working navigation links', async () => {
      // Test dashboard link
      await page.click('text=Dashboard');
      await expect(page).toHaveURL('/dashboard');

      // Test analytics link
      await page.click('text=Analytics');
      await expect(page).toHaveURL('/analytics');

      // Test monitoring link
      await page.click('text=Monitoring');
      await expect(page).toHaveURL('/monitoring');

      // Return to dashboard
      await page.click('text=Dashboard');
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe('Dashboard Controls', () => {
    test('should have time range selector', async () => {
      const timeSelect = page.locator('.dashboard__time-select');
      await expect(timeSelect).toBeVisible();

      // Check default selection
      await expect(timeSelect).toHaveValue('24h');

      // Test changing time range
      await timeSelect.selectOption('1h');
      await expect(timeSelect).toHaveValue('1h');

      // Verify data refreshes (check for loading state)
      await expect(page.locator('.dashboard__loading')).toBeVisible({ timeout: 1000 });
    });

    test('should toggle auto refresh', async () => {
      const autoRefreshBtn = page.locator('text=Auto Refresh');
      await expect(autoRefreshBtn).toBeVisible();

      // Initial state should be on
      await expect(autoRefreshBtn).toHaveClass(/active/);

      // Click to toggle off
      await autoRefreshBtn.click();
      await expect(autoRefreshBtn).not.toHaveClass(/active/);

      // Click to toggle back on
      await autoRefreshBtn.click();
      await expect(autoRefreshBtn).toHaveClass(/active/);
    });

    test('should refresh data manually', async () => {
      const refreshBtn = page.locator('text=Refresh').first();
      await expect(refreshBtn).toBeVisible();

      await refreshBtn.click();

      // Should show loading state
      await expect(page.locator('.dashboard__loading')).toBeVisible({ timeout: 1000 });

      // Loading should disappear
      await expect(page.locator('.dashboard__loading')).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Metrics Cards', () => {
    test('should display all summary metrics', async () => {
      // Check all 4 metric cards are present
      const metricCards = page.locator('hop-metric-card');
      await expect(metricCards).toHaveCount(4);

      // Check specific metrics
      await expect(page.locator('text=Total Requests')).toBeVisible();
      await expect(page.locator('text=Cache Hit Rate')).toBeVisible();
      await expect(page.locator('text=Avg Response Time')).toBeVisible();
      await expect(page.locator('text=Uptime')).toBeVisible();
    });

    test('should show metric values and units', async () => {
      // Wait for metrics to load
      await page.waitForSelector('hop-metric-card .hop-metric-card__value', { timeout: 10000 });

      const metricValues = page.locator('.hop-metric-card__value');
      const count = await metricValues.count();
      expect(count).toBeGreaterThan(0);

      // Check that values are not empty
      for (let i = 0; i < count; i++) {
        const value = await metricValues.nth(i).textContent();
        expect(value).toBeTruthy();
        expect(value?.trim()).not.toBe('0');
      }
    });
  });

  test.describe('Edge Nodes Status', () => {
    test('should load and display edge node status indicators', async () => {
      const edgeNodesSection = page.locator('[data-testid="edge-nodes"]');
      await expect(edgeNodesSection).toBeVisible();

      // Check that status indicators are rendered
      const statusIndicators = page.locator('hop-status-indicator');
      const count = await statusIndicators.count();
      expect(count).toBeGreaterThan(0);

      // Verify different status types are displayed
      await expect(page.locator('.hop-status-indicator--healthy')).toBeVisible();
      await expect(page.locator('.hop-status-indicator--warning')).toBeVisible();
    });

    test('should show node location and metrics', async () => {
      // Wait for nodes to load
      await page.waitForSelector('.node-item', { timeout: 10000 });

      const nodeItems = page.locator('.node-item');
      const count = await nodeItems.count();
      expect(count).toBeGreaterThanOrEqual(5); // Should have at least 5 nodes

      // Check first node has location and metrics
      const firstNode = nodeItems.first();
      await expect(firstNode.locator('.hop-status-indicator__label')).toBeVisible();
      await expect(firstNode.locator('.node-metrics')).toBeVisible();
    });

    test('should display node status summary counts', async () => {
      const statusCounts = page.locator('.status-counts');
      await expect(statusCounts).toBeVisible();

      // Check all status count types
      await expect(statusCounts.locator('.status-count--healthy')).toBeVisible();
      await expect(statusCounts.locator('.status-count--warning')).toBeVisible();
      await expect(statusCounts.locator('.status-count--error')).toBeVisible();
      await expect(statusCounts.locator('.status-count--offline')).toBeVisible();
    });
  });

  test.describe('Charts and Analytics', () => {
    test('should display traffic overview chart', async () => {
      const chartSection = page.locator('[data-testid="metrics-chart"]');
      await expect(chartSection).toBeVisible();

      // Wait for chart to load
      await page.waitForSelector('canvas', { timeout: 10000 });

      // Verify chart canvas is present
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();
      await expect(canvas).toHaveAttribute('width');
      await expect(canvas).toHaveAttribute('height');
    });

    test('should show geographic distribution', async () => {
      const regionsCard = page.locator('.dashboard__regions');
      await expect(regionsCard).toBeVisible();

      // Check for region items
      const regionItems = page.locator('.region-item');
      await expect(regionItems.first()).toBeVisible({ timeout: 10000 });

      const count = await regionItems.count();
      expect(count).toBeGreaterThan(0);

      // Check first region has name, percentage, and stats
      const firstRegion = regionItems.first();
      await expect(firstRegion.locator('.region-name')).toBeVisible();
      await expect(firstRegion.locator('.region-percentage')).toBeVisible();
      await expect(firstRegion.locator('.region-bar')).toBeVisible();
    });

    test('should display performance trends chart', async () => {
      const performanceCard = page.locator('.dashboard__performance');
      await expect(performanceCard).toBeVisible();

      const canvas = performanceCard.locator('canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt to mobile viewport', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that dashboard grid adapts
      const dashboardGrid = page.locator('.dashboard__grid');
      await expect(dashboardGrid).toBeVisible();

      // Controls should stack vertically or be more compact
      const controls = page.locator('.dashboard__controls');
      await expect(controls).toBeVisible();
    });

    test('should work on tablet viewport', async () => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      const dashboard = page.locator('.dashboard');
      await expect(dashboard).toBeVisible();

      // Charts should still be readable
      await expect(page.locator('canvas')).toBeVisible();
    });

    test('should look good on large desktop', async () => {
      // Set large desktop viewport
      await page.setViewportSize({ width: 1600, height: 1000 });

      const dashboardGrid = page.locator('.dashboard__grid');
      await expect(dashboardGrid).toBeVisible();

      // Should utilize the extra space effectively
      const cards = page.locator('hop-card');
      await expect(cards.first()).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle and display errors gracefully', async () => {
      // Mock a network error (this would need to be implemented based on your service)
      await page.route('**/api/**', (route) => {
        route.abort('failed');
      });

      await page.reload();

      // Check if error message appears
      const errorAlert = page.locator('.dashboard__error');
      await expect(errorAlert).toBeVisible({ timeout: 10000 });
    });

    test('should allow error dismissal', async () => {
      // First trigger an error (you'll need to implement this)
      // Then test dismissal
      const errorClose = page.locator('.alert__close');
      if (await errorClose.isVisible()) {
        await errorClose.click();
        await expect(page.locator('.dashboard__error')).not.toBeVisible();
      }
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should load within reasonable time', async () => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should be keyboard accessible', async () => {
      await page.goto('/');

      // Test tab navigation through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to activate buttons with Enter/Space
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have proper ARIA labels', async () => {
      // Check that status indicators have proper labels
      const statusIndicators = page.locator('hop-status-indicator');
      const first = statusIndicators.first();
      await expect(first).toHaveAttribute('aria-label');

      // Check that charts have labels
      const canvas = page.locator('canvas');
      await expect(canvas.first()).toHaveAttribute('aria-label');
    });
  });

  test.describe('Real-time Updates', () => {
    test('should show loading states during updates', async () => {
      // Trigger a refresh
      await page.click('text=Refresh');

      // Should show loading spinner
      const loading = page.locator('.dashboard__loading');
      await expect(loading).toBeVisible({ timeout: 1000 });

      // Loading should disappear
      await expect(loading).not.toBeVisible({ timeout: 10000 });
    });

    test('should handle auto-refresh when enabled', async () => {
      // Enable auto-refresh if not already enabled
      const autoRefreshBtn = page.locator('text=Auto Refresh');
      if (!(await autoRefreshBtn.getAttribute('class'))?.includes('active')) {
        await autoRefreshBtn.click();
      }

      // Wait and check that data updates happen
      // Note: This test might be flaky depending on your refresh interval
      await page.waitForTimeout(35000); // Wait longer than refresh interval

      // Verify that timestamps have updated or other indicators of refresh
      const timestamps = page.locator('.hop-status-indicator__timestamp');
      if (await timestamps.count() > 0) {
        const firstTimestamp = await timestamps.first().textContent();
        expect(firstTimestamp).toContain('ago');
      }
    });
  });
});
