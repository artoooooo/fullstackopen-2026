import { useState } from 'react'

const Button = ({children, onClick}) =>  <button key={children} onClick={onClick}>{children}</button>

const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({good, bad, neutral}) => {
  const total = good + neutral + bad

  return total == 0 ? <p>No feedback given</p> : (
  <>
    <h2>statistics</h2>
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="total" value={total} />
        <StatisticLine text="average" value={(good-bad)/total} />
        <StatisticLine text="positive" value={(good/total)*100} />
      </tbody>
    </table>
  </>
)
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
      <>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={ () => setBad(bad + 1)}>bad</button>
      </>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App