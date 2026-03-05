const Notification = ({ message }) => {
  if (message) {
    return (
      <p>
        Notification! (sorry no css):
        {message}
      </p>
    )
  }

  return (<></>)
}

export default Notification