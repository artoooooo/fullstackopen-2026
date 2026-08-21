const { test, expect, beforeEach, describe } = require('@playwright/test')
import {
  loginWith,
  createBlog,
  showBlog,
  likeBlog,
  randomBlog
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

 test('Login form is shown', {tag: '@5.17',}, async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Login' })
    ).toBeVisible()

    
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })
 describe('Login', () => {
    test(
      '5.18 login succeeds with correct credentials', {tag: '@5.18'}, async ({ page }) => {
        await loginWith(
          page,
          'mluukkai',
          'salainen'
        )

        await expect(
          page.getByText('Matti Luukkainen logged in')
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
          page.getByText('Matti Luukkainen logged in')
        ).toHaveCount(0)
      }
    )
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
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

    test('5.20 a blog can be liked', {tag: '@5.20'}, async ({ page }) => {
        const blog1 = randomBlog()
        await createBlog(page, blog1)
        const {title} = blog1
        const blog = await showBlog(
          page,
          title
        )

        await expect(blog.getByText('likes 0')).toBeVisible()

        await blog.getByRole('button', { name: 'like' }).click()

        await expect(blog.getByText('likes 1')).toBeVisible()
      }
    )

    test('5.21 a blog can be deleted', {tag: '@5.21'}, async ({ page }) => {
        const blog1 = randomBlog()

        await createBlog(page, blog1)

        const blog = await showBlog(page, blog1.title)

        page.once(
          'dialog',
          dialog => dialog.accept()
        )

        await blog
          .getByRole('button', { name: 'delete' })
          .click()

        await expect(
          page.getByText(`${blog1.title} ${blog1.author}`)
        ).toHaveCount(0)
      }
    )

    test('5.22 only the creator can see the delete button', {tag: '@5.22'}, async ({ page, request }) => {
        const blot = randomBlog()

        await createBlog(page, blot)

        let blog = await showBlog(
          page,
          blot.title
        )

        await expect(
          blog.getByRole('button', {
            name: 'delete'
          })
        ).toBeVisible()


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

        await loginWith(
          page,
          'pmikkola',
          'toinensalasana'
        )

        blog = await showBlog(
          page,
          blot.title
        )

        await expect(
          blog.getByRole('button', {
            name: 'delete'
          })
        ).toHaveCount(0)
      }
    )

    test('5.23 blogs are ordered by likes', {tag: '@5.23'}, async ({ page }) => {
        const mostLiked = randomBlog()
        const middleLiked = randomBlog()
        const leastLiked = randomBlog()

        await createBlog(page, leastLiked)
        await createBlog(page, mostLiked)
        await createBlog(page, middleLiked)

        await likeBlog(page, leastLiked.title, 1)
        await likeBlog(page, mostLiked.title, 3)
        await likeBlog(page, middleLiked.title, 2)
        
        const blogs = page
        .getByRole('button', { name: /show|hide/ })
        .locator('..')

        await expect(blogs).toHaveCount(3)

        await expect(blogs.nth(0)).toContainText(mostLiked.title)
        await expect(blogs.nth(1)).toContainText(middleLiked.title)
        await expect(blogs.nth(2)).toContainText(leastLiked.title)
      }
    )
  })
})
