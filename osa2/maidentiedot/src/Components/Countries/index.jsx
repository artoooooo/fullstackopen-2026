import Country from "./Country";

const Countries = (props) => {
    const {countries} = props
    if(!countries || countries.length > 10) {
        return <p>Too much matches, specify another filter</p>
    }
    const expand = countries.length == 1
    return (<>
        {countries.map(country => <Country key={country.cca3} country={country} expand={country._expand || expand} handleExpand={props.handleExpand} />)}
        </>
    )
}

export default Countries 