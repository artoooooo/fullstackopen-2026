const { test, expect, beforeEach, describe } = require('@playwright/test')
import {
  loginWith,
  createBlog,
  showBlog,
  likeBlog,
  randomBlog,
  toTitleText
} from './helper'


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post(
        'http://localhost:3003/api/testing/reset'
    )

    expect(resetResponse.status()).toBe(204)
    await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
      }
    })

    const blogsLoaded = page.waitForResponse(response =>
        response.url().includes('/api/blogs') &&
        response.request().method() === 'GET' &&
        response.ok()
    )

    await page.goto('http://localhost:5173')

    await blogsLoaded
  })
  test('Login form is not shown', {tag: '@5.17',}, async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toHaveCount(0)
        await expect(
      page.getByRole('heading', { name: 'blogs' })
    ).toBeVisible()
  })
 test('Login form is shown', {tag: '@5.17',}, async ({ page }) => {
    await page.getByRole('link', { name: 'login', exact: true }).click()
    
    await expect(
      page.getByRole('heading', { name: 'Log in to application' })
    ).toBeVisible()
    
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })
 describe('Login', () => {
    beforeEach(async ({ page }) => {
      const loginLink = page.getByRole('link', { name: 'login', exact: true })
      await expect(loginLink).toBeVisible()
      await loginLink.click()
    })
    test(
      '5.18 login succeeds with correct credentials', {tag: '@5.18'}, async ({ page }) => {
        await loginWith(
          page,
          'mluukkai',
          'salainen'
        )

        await expect(
          page.getByText('Login successful! Welcome back!')
        ).toBeVisible()
      }
    )

    test('5.18 login fails with wrong credentials', {tag: '@5.18'}, async ({ page }) => {
        await loginWith(
          page,
          'mluukkai',
          'wrong-password'
        )

        await expect(
          page.getByText(
            /invalid username or password|wrong username or password/i
          )
        ).toBeVisible()

        await expect(
          page.getByText('Login successful! Welcome back!')
        ).toHaveCount(0)
      }
    )
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByRole('link', { name: 'login', exact: true }).click()
        await loginWith(page, 'mluukkai', 'salainen')

        await expect(
            page.getByRole('button', { name: 'logout' })
        ).toBeVisible()
    })

    test('5.19 a new blog can be created', {tag: '@5.19'}, async ({ page }) => {
        const blog = randomBlog()
        await createBlog(page, blog)  
      }
    )

    test('5.20 a blog can be liked', { tag: '@5.20' }, async ({ page }) => {
      const blog1 = randomBlog()

      await createBlog(page, blog1)
      await showBlog(page, blog1)

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(
        page.getByText('likes 1')
      ).toBeVisible()
    })

    test('5.21 a blog can be deleted', {tag: '@5.21'}, async ({ page }) => {
        const blog1 = randomBlog()

        await createBlog(page, blog1)
        await expect(page.getByRole('link', { name: toTitleText(blog1), exact: true })).toBeVisible()
        await showBlog(page, blog1)

        page.once('dialog', async dialog => {
            await dialog.accept()
        })

        await page
          .getByRole('button', { name: 'delete' })
          .click()
        await expect(page).toHaveURL('http://localhost:5173/')
        await expect(page.getByRole('link', { name: toTitleText(blog1), exact: true })).toHaveCount(0)
      }
    )

    test('5.22 only the creator can see the delete button', {tag: '@5.22'}, async ({ page, request }) => {
        const blog1 = randomBlog()

        await createBlog(page, blog1)
        await showBlog(page, blog1)

        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

        await request.post(
          'http://localhost:3003/api/users',
          {
            data: {
              name: 'Pekka Mikkola',
              username: 'pmikkola',
              password: 'toinensalasana'
            }
          }
        )

        await page
          .getByRole('button', { name: 'logout' })
          .click()
        await expect(page).toHaveURL('http://localhost:5173/')
        await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
        await loginWith(
          page,
          'pmikkola',
          'toinensalasana'
        )

        await showBlog(page, blog1)
        await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
      }
    )

    test('5.23 blogs are ordered by likes', {tag: '@5.23'}, async ({ page }) => {
        const mostLiked = randomBlog()
        const middleLiked = randomBlog()
        const leastLiked = randomBlog()

        await createBlog(page, leastLiked)
        await likeBlog(page, leastLiked, 1)
        await page.goto('http://localhost:5173')
        await createBlog(page, mostLiked)
        await likeBlog(page, mostLiked, 3)
        await page.goto('http://localhost:5173')
        await createBlog(page, middleLiked)
        await likeBlog(page, middleLiked, 2)
        await page.goto('http://localhost:5173')

        
        const blogs = page
          .getByRole('list')
          .getByRole('listitem')

        await expect(blogs).toHaveCount(3)
        
        await expect(blogs.nth(0)).toContainText(toTitleText(mostLiked))
        await expect(blogs.nth(1)).toContainText(toTitleText(middleLiked))
        await expect(blogs.nth(2)).toContainText(toTitleText(leastLiked))
      }
    )
  })
})