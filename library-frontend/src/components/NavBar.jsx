import { Link } from 'react-router-dom'

const NavBar = ({ user, logout }) => {
  return (
    <div className="nav">
      <div className="nav-links">
        <Link className="nav-link" to="/authors">
          Authors
        </Link>
        <Link className="nav-link" to="/books">
          Books
        </Link>
        {user && (
          <Link className="nav-link" to="/newBook">
            Add book
          </Link>
        )}
        {user && (
          <Link className="nav-link" to="/recommendations">
            Recommendations
          </Link>
        )}
        {user ? (
          <a href="#" onClick={logout}>
            Logout
          </a>
        ) : (
          <Link className="nav-link" to="/login">
            Login
          </Link>
        )}
      </div>
      <div className="status">
        {user ? `${user.username} is logged in` : ''}
      </div>
    </div>
  )
}

export default NavBar
