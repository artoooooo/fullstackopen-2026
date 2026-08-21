
const Notification  = ({ message, color='green' }) => (
  <div style={{ backgroundColor: '#ddd', border: `2px solid ${color}`, padding: '10px' }}>
    <p>{message}</p>
  </div>
)

export default Notification