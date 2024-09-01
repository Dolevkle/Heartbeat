import { expect, type Page, test } from "@playwright/test";

let page: Page;

test.beforeEach(async ({ browser }) => {
  // Create a new browser context
  const context = await browser.newContext();
  // Create a new page
  page = await context.newPage();
  // Navigate to the base URL
  await page.goto("/");
  // Find an element with the text 'About' and click on it
  const signUpButton = page.getByRole("button").filter({ hasText: "Sign Up" });
  await signUpButton.waitFor({ state: "visible" });
  await signUpButton.click();

  await page.waitForURL("**/signup");
});

// After each test, clean up the page and context
test.afterEach(async () => {
  // Close the page
  await page.close();
});

test("should contain spotify user info", async ({ page }) => {
  // Replace the selector with the appropriate selector for your image
  await expect(page.getByAltText("no profile image")).toBeVisible();
  const text = await page.getByTestId("user name").innerText();
  expect(text.trim().length).toBeGreaterThan(0);

  // Check if the image is visible
  // expect(await page.isVisible(imageSelector);
});

test("should sign up user", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  // Find an element with the text 'About' and click on it
  const ageInput = page.locator("input[placeholder='18']");
  await ageInput.fill("23");

  // Replace the selector with the appropriate selector for your Shadcn Select component using data-testId
  const selectTestId = "sexual-preference-select";
  const selectSelector = `[data-testid="${selectTestId}"]`;

  // Open the select dropdown to make options visible
  await page.locator(selectSelector).click();

  // Wait for options to be visible
  await page.waitForSelector(`${selectSelector} option`);

  // Count the number of options
  const optionsSelector = `${selectSelector} option`;
  const optionsCount = await page.locator(optionsSelector).count();

  if (optionsCount > 0) {
    // Select the first option by index
    await page.locator(selectSelector).selectOption({ index: 0 });

    // Optionally, you can verify the selected option
    const selectedValue = await page.locator(selectSelector).inputValue();
    console.log(`The selected value is: ${selectedValue}`);
  } else {
    console.log("No options available to select.");
  }

  // Wait for options to be visible
  await page.waitForSelector(`${selectSelector} option`);
});
