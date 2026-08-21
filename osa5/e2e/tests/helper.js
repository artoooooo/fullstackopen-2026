import { expect } from '@playwright/test'


export const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const  createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)

  await page.getByRole('button', {
    name: 'create',
    exact: true
  }).click()

  await expect(blogByTitle(page, title)).toBeVisible()
}

export const  blogByTitle = (page, title) =>
  page
    .locator('div')
    .filter({ hasText: title })
    .filter({
      has: page.getByRole('button', { name: /show|hide/ })
    })
    .last()

export const  showBlog = async (page, title) => {
  const blog = blogByTitle(page, title)

  const showButton = blog.getByRole('button', {
    name: 'show'
  })

  if (await showButton.isVisible()) {
    await showButton.click()
  }

  return blog
}

export const likeBlog = async (page, title, times) => {
  const blog = await showBlog(page, title)

  for (let i = 1; i <= times; i++) {
    await blog.getByRole('button', { name: 'like' }).click()

    await expect(
      blog.getByText(`likes ${i}`)
    ).toBeVisible()
  }
}

export const randomBlog = () => {
  const randomString = () =>
    Math.random().toString(36).substring(2, 10)

  return {
    title: `blog-${randomString()}`,
    author: `author-${randomString()}`,
    url: `http://${randomString()}.com`
  }
}