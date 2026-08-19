const Filter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      <label htmlFor="filter">filter shown with: </label>
      <input
        id="filter"
        type="text"
        value={filterValue}
        onChange={handleFilterChange}
      />
    </div>
  )
}

export default Filter