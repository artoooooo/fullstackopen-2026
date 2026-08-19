
const baseUrl="https://studies.cs.helsinki.fi/restcountries/api"
const getAll = async() => {
  try {
    const response = await fetch(`${baseUrl}/all`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error(error.message);
  }
}

export default {
    getAll: getAll
}
export {getAll}