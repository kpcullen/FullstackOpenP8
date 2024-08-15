const Notification = ({ errorMessage }) => {
  if (!errorMessage) return null
  return <div className="notification">{errorMessage}</div>
}

export default Notification
