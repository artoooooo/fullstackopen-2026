import { useState } from 'react'


const emptyNewForm = () => ({ title: '', author: '', url: '' })

const NewForm = ({  createBlog }) => {
  const [form, setForm] = useState(emptyNewForm())

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await createBlog(form)
      setForm(emptyNewForm())
    } catch {
      
    }
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="author">author:</label>
          <input
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="url">url:</label>
          <input
            id="url"
            name="url"
            value={form.url}
            onChange={handleChange}
          />
        </div>

        <button type="submit">create</button>
      </form>
    </>
  )
}

export default NewForm