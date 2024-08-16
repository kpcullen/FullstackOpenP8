import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router'

const Login = ({ setError, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [login, { data, error, loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const libraryUser = data.login
      const token = data.login.value
      console.log(data.login)
      setUser(libraryUser)

      localStorage.setItem('library-user-token', token)
      localStorage.setItem('library-user-obj', JSON.stringify(libraryUser))
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ variables: { username, password } })
    navigate('/books')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Username{' '}
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          placeholder="username"
        />
      </div>
      <div>
        Password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder="password"
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
