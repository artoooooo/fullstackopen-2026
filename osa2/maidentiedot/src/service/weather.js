const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const getWeatherOf = async (city) => {
    if(!apiKey) {
        throw new Error("Api key is undefined")
    }
    const json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fi`)
        .then(response => response.json())

    return json
}

export default getWeatherOf