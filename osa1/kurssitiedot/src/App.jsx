const Part = ({name, exerciseCount}) => (
<p>
  {name} {exerciseCount}
</p>
)
const Header = ({course}) => (
    <h1>{course}</h1>
)

const Total = ({parts}) => (
    <p>Number of exercises {parts.map(x => x.exercises).reduce((a,b) => a + b , 0)}</p>
)

const Content = ({parts}) => parts.map(({name, exercises}) => <Part key={name} name={name} exerciseCount={exercises} />)

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [{
    name:'Fundamentals of React',
    exercises: 10
  },
  {
    name:'Using props to pass data',
    exercises: 7
  },
  {
    name:'State of a component',
    exercises: 14
  }]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App