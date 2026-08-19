const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    border: '2px solid green',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
 const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    border: '2px solid red',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={message.style == "error" ? errorStyle : notificationStyle}>
      {message.message}
    </div>
  )
}

export default Notification