const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addNote
}) => {
  return (
    <form onSubmit={addNote}>
      <h2>add a new</h2>

      <div>
        <label htmlFor="name">name: </label>
        <input
          id="name"
          type="text"
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        <label htmlFor="number">number: </label>
        <input
          id="number"
          type="text"
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <button type="submit">add</button>
    </form>
  )
}

export default PersonForm