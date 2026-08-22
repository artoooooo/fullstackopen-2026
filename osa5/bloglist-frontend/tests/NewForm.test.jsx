
import { expect, vi, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewForm from '../src/components/NewForm'

describe('<NewForm />', () => {
  test.skip('calls createBlog with correct data', { tags: ['5.16'] }, async () => {
    const createBlog = vi.fn().mockResolvedValue({})
    const user = userEvent.setup()

    render(<NewForm createBlog={createBlog} />)

    await user.type(
      screen.getByRole('textbox', { name: 'title:' }),
      'Test blog'
    )

    await user.type(
      screen.getByRole('textbox', { name: 'author:' }),
      'Test author'
    )

    await user.type(
      screen.getByRole('textbox', { name: 'url:' }),
      'www.test.fi'
    )

    await user.click(
      screen.getByRole('button', { name: 'create' })
    )

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Test blog',
      author: 'Test author',
      url: 'www.test.fi',
    })
  })
})