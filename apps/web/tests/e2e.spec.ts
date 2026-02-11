import { test, expect } from '@playwright/test'

test('login and publish bot', async ({ page }) => {
  await page.goto('/sign-in')
  await page.getByPlaceholder('Email').fill('owner@example.com')
  await page.getByPlaceholder('Password').fill('ChangeMe123!')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await page.goto('/bots')
  await page.getByRole('button', { name: 'Create bot' }).click()

  await page.goto('/bots/1/editor')
  await page.getByRole('button', { name: 'Publish' }).click()

  await expect(page.getByText('Bot Editor')).toBeVisible()
})
