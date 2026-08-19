const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => parts.map((part) => <Part key={part.id} part={part} />)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = ({parts}) => <p><strong>total of {parts.reduce((total, x) => total + x.exercises, 0)} exercises</strong></p>
const Course = ({course}) => (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        parts={course.parts}
      />
    </div>
)

export default Course