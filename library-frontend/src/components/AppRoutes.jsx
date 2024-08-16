import { Navigate, Route, Routes } from 'react-router'
import Authors from './Authors'
import Books from './Books'
import NewBook from './NewBook'
import Recommendations from './Recommendations'
import Login from './Login'

const AppRoutes = ({ user, setUser, setError }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" replace />} />

      <Route
        path="/authors"
        element={<Authors user={user} setError={setError} />}
      />
      <Route path="/books" element={<Books setError={setError} />} />
      <Route path="/newBook" element={<NewBook setError={setError} />} />
      <Route
        path="/recommendations"
        element={<Recommendations user={user} />}
      />
      <Route
        path="login"
        element={<Login setUser={setUser} setError={setError} />}
      />
    </Routes>
  )
}

export default AppRoutes
