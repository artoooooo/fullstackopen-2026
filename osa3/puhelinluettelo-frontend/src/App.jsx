import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Numbers from './Numbers'
import personsService from './services/persons'
import Notification from './Notification'

const App = () => {
  const [message, setMessage] = useState(null)
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [filterValue, setNewFilter] = useState('')
  const [newNumber, setNewNumber] = useState('')

    useEffect(() => {
      personsService.getAll().then(({data}) => setPersons(data))
  }, [])
  const handleDelete = (id) => {
    personsService
      .delete(id)
      .then(response => setPersons(persons.filter(x => x.id != id)))
      .catch(e => {
        const f = persons.find(p => p.id == id)
        console.log("yoloo", f)
          setMessage({message: `Information of ${f.name} has already been removed from server `, style:"error"})
            setTimeout(() => {
            setMessage(null)
            }, 5000)
        setPersons(persons.filter(x => x.id != id))
      })
    
  }
  const addNote = (event) => {
      event.preventDefault()
      const found = persons.find(({name}) => name.toLocaleLowerCase() == newName.toLocaleLowerCase() )
      if (found) {

        personsService.update(found.id, {name: newName, number: newNumber})
          .then(({data}) => {
            setPersons([...persons.filter(x => x.id !== data.id), data])
            setNewName("")
            setNewNumber("")
            setMessage({message: `Updated ${data.name}`})
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      } else {
      personsService
        .create({name: newName, number: newNumber})
        .then(({data}) => {
          setPersons([...persons, data ])
          setNewName("")
          setNewNumber("")
          setMessage({message: `Added ${data.name}`})
            setTimeout(() => {
            setMessage(null)
            }, 5000)
        }).catch(error => {
          setMessage({message: error.response.data.error, style:"error"})
          setTimeout(() => {setMessage(null)}, 5000)
      })
      }

     
      
  }
  const handleNameChange = ({ target: { value } }) => {
    setNewName(value)
  }
  const handleNumberChange = ({ target: { value } }) => {
    setNewNumber(value)
  }
  const handleFilterChange = ({ target: { value } }) => {
    setNewFilter(value)
  }
  console.log("Message", message)
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter
        filterValue={filterValue}
        handleFilterChange={handleFilterChange}
      />

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNote={addNote}
      />

      <Numbers persons={persons.filter(({name}) => name.toLocaleLowerCase().includes(filterValue))} handleDelete={handleDelete} />
    </div>
  )

}

export default App