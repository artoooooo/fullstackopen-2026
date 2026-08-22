import { expect, vi, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'
import { MemoryRouter, Route, Routes } from 'react-router-dom'


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

const renderBlogWithRouter = (user = null) => {
  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={[blog]}
              user={user}
              onLike={vi.fn()}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('<Blog />', () => {
  test.skip('renders blog title and author, but does not initially show other information', { tags: ['5.13'] }, () => {
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

  test.skip('shows blog information when show button is clicked', { tags: ['5.14'] }, async () => {
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

  test.skip('calls updateBlog twice when like button is clicked twice', { tags: ['5.15'] }, async () => {
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

  test('shows blog information and likes but no buttons to a logged-out user', { tags: ['5.27'] }, () => {
    renderBlogWithRouter()

    expect(
      screen.getByRole('heading', {
        name: `${blog.author}: ${blog.title}`,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: blog.url })).toBeInTheDocument()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
    expect(screen.getByText(`Added by ${user.name}.`)).toBeInTheDocument()

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  test('shows both like and delete buttons to the creator of the blog', { tags: ['5.27'] }, () => {
    renderBlogWithRouter(user)

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(2)
  })
  test('shows only the like button to a logged-in user who did not create the blog', { tags: ['5.27'] }, () => {
    const anotherUser = {
      username: 'another',
      name: 'Another User',
      id: 'different-id',
    }

    renderBlogWithRouter(anotherUser)

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(1)
  })
})