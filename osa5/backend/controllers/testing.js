import User from "../models/user.js"
import Blog from "../models/blog.js"

export const reset = async (request, response) => {
    await Promise.all([
        Blog.deleteMany({}),
        User.deleteMany({})
    ])

    return response.status(204).end()
}