import getWeatherOf from '../../service/weather'
import { useEffect, useState } from 'react'


const Weather = ({city}) => {
    const [weather, setWeather] = useState(null)
    useEffect(() => {
        getWeatherOf(city)
            .then(json => setWeather(json))
    },[])

    if(!weather) {
        return null
    }
    return (
        <>
            <h3>Weather in {weather.name}</h3>
            <p>Temperature celcius {weather.main.temp} celcius</p>
            <img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}></img>
            <p>Wind {weather.wind.speed} m/s</p>
        </>
    )

}

const Languages = ({languages}) => {

    return (
        <>
            <h3>Languages</h3>
            <ul>
            {Object.values(languages).map(language => <li key={language}>{language}</li>)}
            </ul>
        </>
    )
}
const Expanded = ({country: { capital, area, languages, flags }}) => (
    <>
        <p>Capital {capital.join(", ")}</p>
        <p>Area {area}</p>
        <Languages languages={languages} />
        <img style={{maxWidth:"100%", height:"auto"}} src={flags.svg ?? flags.png} alt={flags.alt}/>
        <Weather city={capital[0]} />
    </>
)

const Country = ({country, expand=false, handleExpand}) => {
    const expanded = expand ? <Expanded country={country} />  : undefined
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <h2>{country.name.common}</h2>
                <button onClick={() => handleExpand(country.cca3)} style={{ marginLeft: "auto" }}>{expand ? "hide" : "show"}</button>
            </div>
            {expanded}
        </>
    )
}

export default Country