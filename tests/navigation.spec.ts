import { test, expect } from '@playwright/test'

test('should navigate to the login page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  // Find an element with the text 'About' and click on it
  await page.click('text=Log in')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:3000/login')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h3')).toContainText('Login')
})

test('should navigate to the sign up page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  // Find an element with the text 'About' and click on it
  await page.click('text=Sign Up')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:3000/signup')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h3')).toContainText('Sign Up')
})