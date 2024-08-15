import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom'

import { useApolloClient, useSubscription } from '@apollo/client'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED } from './queries'
import Notification from './components/Notification'
import NavBar from './components/NavBar'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle([...allBooks, addedBook]),
    }
  })
}

const App = () => {
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const client = useApolloClient()
  const navigate = useNavigate()

  useEffect(() => {
    const libraryUser = localStorage.getItem('library-user-obj')

    if (libraryUser) {
      const userObj = JSON.parse(libraryUser)
      setUser(userObj)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onComplete: () => {
      console.log('Subscribed!')
    },
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(
        `New book: ${data.data.bookAdded.title} by ${data.data.bookAdded.author.name} added`
      )
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const logout = async () => {
    await client.resetStore()
    localStorage.clear()
    setUser('')
    navigate('/login')
  }

  const handleSetError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 3000)
  }

  return (
    <div>
      <NavBar user={user} logout={logout} />

      <Notification errorMessage={errorMessage} />

      <Routes>
        <Route path="/" element={<Authors user={user} />} />
        <Route path="/authors" element={<Authors user={user} />} />
        <Route path="/books" element={<Books setError={handleSetError} />} />
        <Route
          path="/newBook"
          element={<NewBook setError={handleSetError} />}
        />
        <Route
          path="/recommendations"
          element={<Recommendations user={user} />}
        />
        <Route
          path="login"
          element={<Login setUser={setUser} setError={handleSetError} />}
        />
      </Routes>
    </div>
  )
}

export default App
