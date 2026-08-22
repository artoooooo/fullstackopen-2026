
import { expect, vi, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import NewForm from '../src/components/NewForm'

describe('<NewForm />', () => {
  test('calls createBlog with correct data', { tags: ['5.16'] }, async () => {
    const createBlog = vi.fn().mockResolvedValue({})
    const blog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'www.test.fi',
    }
    const loggedUser = {
      id: '123',
      username: 'tester',
      name: 'Test User'
    }
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/create']}>
        <NewForm
          createBlog={createBlog}
          user={loggedUser}
        />
      </MemoryRouter>
    )

    await user.type(screen.getByRole('textbox', { name: 'title' }), blog.title)
    await user.type(screen.getByRole('textbox', { name: 'author' }), blog.author)
    await user.type(screen.getByRole('textbox', { name: 'url' }), blog.url)
    await user.click(screen.getByRole('button', { name: 'create' }))

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith(blog)
  })
})