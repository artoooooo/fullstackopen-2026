import { expect } from '@playwright/test'

export const toTitleText = ({title, author}) => `${title} by ${author}`

export const randomBlog = () => ({
    title: `blog-${Math.random().toString(36).substring(2, 10)}`,
    author: `author-${Math.random().toString(36).substring(2, 10)}`,
    url: `http://${Math.random().toString(36).substring(2, 10)}.com`
})

export const loginWith = async (page, username, password) => {
  await page
    .getByRole('link', { name: 'login', exact: true })
    .click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const  createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'new note' }).click()
  
  const {title, author, url} = blog

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)

  await page.getByRole('button', {
    name: 'create',
    exact: true
  }).click()

  return await expect(blogByTitle(page, blog)).toBeVisible()
}

export const blogByTitle = (page, blog) => {
  return page.getByRole('link', {
    name: toTitleText(blog),
    exact: true
  })
}
  
export const showBlog = async (page, blog) => {
  await page.getByRole('link', {
    name: 'blogs',
    exact: true
  }).click()

  return await blogByTitle(page, blog).click()
}

export const likeBlog = async (page, blog, times) => {
  await showBlog(page, blog)

  for (let i = 1; i <= times; i++) {
    await page.getByRole('button', { name: 'like' }).click()

    await expect(
      page.getByText(`likes ${i}`)
    ).toBeVisible()
  }
}