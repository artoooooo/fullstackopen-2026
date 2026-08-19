import mongoose from 'mongoose'
import 'dotenv/config'
import { connectDbWithPassword } from './config/db.js'
import Person from './models/Person.js'

async function run() {
  try {
    if(process.argv.length > 2) {
      await connectDbWithPassword(process.argv[2])
    }

    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')

    if(process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      await person.save()
      console.log('Added', person.name, person.number)
    } else {
      const results = await Person.find({})
      console.log('phonebook:')
      results.forEach(x => console.log(' ', x.name, x.number))
    }

    mongoose.connection.close()
  } finally {
    await mongoose.disconnect()
  }
}
run().catch(console.dir)