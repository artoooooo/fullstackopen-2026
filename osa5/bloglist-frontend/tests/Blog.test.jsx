
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'

const user = {
  username: 'root',
  name: 'Etunimi Sukunimi',
  id: '6a872798531448f3f3945813',
}

const blog = {
  title: 'title',
  author: 'author',
  url: 'www.url.fi',
  likes: 2,
  user,
  createdAt: '2026-08-20T19:28:53.194Z',
  updatedAt: '2026-08-20T20:40:01.517Z',
  id: '6a875575595edf2fb0b69c85',
}

describe('<Blog />', () => {
  test('[5.13] renders blog title and author, but does not initially show other information', () => {
    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined()

    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()
    expect(screen.queryByText(user.name)).toBeNull()
  })

  test('[5.14] shows blog information when show button is clicked', async () => {
    const userEventInstance = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    const showButton = screen.getByRole('button', { name: 'show' })

    await userEventInstance.click(showButton)

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
    expect(screen.getByText(user.name)).toBeDefined()
  })

  test('[5.15] calls updateBlog twice when like button is clicked twice', async () => {
  const userEventInstance = userEvent.setup()
  const updateBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={updateBlog}
      deleteBlog={vi.fn()}
    />
  )

  await userEventInstance.click(
    screen.getByRole('button', { name: 'show' })
  )

  const likeButton = screen.getByRole('button', { name: 'like' })

  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  expect(updateBlog).toHaveBeenCalledTimes(2)
})
  test('hides blog information when hide button is clicked', async () => {
    const userEventInstance = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'show' })
    )

    expect(screen.getByText(blog.url)).toBeDefined()

    await userEventInstance.click(
      screen.getByRole('button', { name: 'hide' })
    )

    expect(screen.queryByText(blog.url)).toBeNull()
  })

  test('calls updateBlog when like button is clicked', async () => {
    const userEventInstance = userEvent.setup()
    const updateBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={updateBlog}
        deleteBlog={vi.fn()}
      />
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'show' })
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'like' })
    )

    expect(updateBlog).toHaveBeenCalledTimes(1)
    expect(updateBlog).toHaveBeenCalledWith({
      ...blog,
      likes: blog.likes + 1,
    })
  })

  test('shows delete button when current user owns the blog', async () => {
    const userEventInstance = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'show' })
    )

    expect(
      screen.getByRole('button', { name: 'delete' })
    ).toBeDefined()
  })

  test('does not show delete button when current user does not own the blog', async () => {
    const userEventInstance = userEvent.setup()

    const anotherUser = {
      username: 'another',
      name: 'Another User',
      id: 'different-id',
    }

    render(
      <Blog
        blog={blog}
        user={anotherUser}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'show' })
    )

    expect(
      screen.queryByRole('button', { name: 'delete' })
    ).toBeNull()
  })

  test('calls deleteBlog when delete is clicked and confirmed', async () => {
    const userEventInstance = userEvent.setup()
    const deleteBlog = vi.fn()

    window.confirm = vi.fn(() => true)

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={vi.fn()}
        deleteBlog={deleteBlog}
      />
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'show' })
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'delete' })
    )

    expect(window.confirm).toHaveBeenCalledWith(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    expect(deleteBlog).toHaveBeenCalledTimes(1)
    expect(deleteBlog).toHaveBeenCalledWith(blog)
  })

  test('does not call deleteBlog when deletion is cancelled', async () => {
    const userEventInstance = userEvent.setup()
    const deleteBlog = vi.fn()

    window.confirm = vi.fn(() => false)

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={vi.fn()}
        deleteBlog={deleteBlog}
      />
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'show' })
    )

    await userEventInstance.click(
      screen.getByRole('button', { name: 'delete' })
    )

    expect(deleteBlog).not.toHaveBeenCalled()
  })
})