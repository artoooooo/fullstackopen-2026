import mongoose from 'mongoose'
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number:  {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{5,}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
},
{
  timestamps: true,
})

const Person = mongoose.model('Person', personSchema)

export default Person
export { personSchema, Person }