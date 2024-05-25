import { test, expect } from '@playwright/test'

test('should navigate to the login page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/')
  // Find an element with the text 'About' and click on it
  await page.click('text=Log in')

  await page.waitForURL('**/login');
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('/login')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h3')).toContainText('Login')
})

test('should navigate to the sign up page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/')
  // Find an element with the text 'About' and click on it
  await page.click('text=Sign Up')

  await page.waitForURL('**/signup');
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('/signup')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h3')).toContainText('Sign Up')
})