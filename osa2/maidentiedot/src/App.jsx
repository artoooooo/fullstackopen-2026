import { useState, useEffect } from 'react'
import Countries from './Components/Countries'
import { getAll } from './service/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filterValue, setFilterValue] = useState("")

  const handleFilterChange = ({ target: { value } }) => {
    setFilterValue(value)
  }

  const handleExpand = (cca3) => {
    const {rest, found} = countries.reduce((acc, country) => {
      if(country.cca3 == cca3) {
        country._expand = !(country._expand??false)
        acc.found.push(country)
      } else {
        acc.rest.push(country)
      }
      return acc
    }, {rest:[], found:[]})
  
    if(found.length > 0) {
      setCountries([...rest, ...found])
    }

  }

  useEffect(() => {
    getAll().then((json) => setCountries(json.toSorted((a,b) => a.name.common.localeCompare(b.name.common))))
  },[])
  
  const filtered = countries.filter(country => country.name.common.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())).toSorted((a,b) => a.name.common.localeCompare(b.name.common))

  return (
    <div style={{width:"30em"}}>
     <>
      <label htmlFor="filter">find countries: </label>
      <input
        id="filter"
        type="text"
        value={filterValue}
        onChange={handleFilterChange}
      />
     </>
     <>
      <Countries countries={filtered} handleExpand={handleExpand}/>
     </>
    </div>
  )
}

export default App
