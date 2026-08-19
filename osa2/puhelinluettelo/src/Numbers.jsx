const Numbers = ({ persons, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>

      {persons.map(({ id, name, number }) => (
        <p key={id}>
          {name} {number} <button onClick={(event => handleDelete(id))}>delete</button>
        </p>
      ))}
    </>
  )
}

export default Numbers