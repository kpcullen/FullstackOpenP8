import { useEffect, useState } from 'react'
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

import { useApolloClient, useSubscription } from '@apollo/client'
import Notification from './components/Notification'
import NavBar from './components/NavBar'
import AppRoutes from './components/AppRoutes'
import Footer from './components/Footer'

export const updateCache = (cache, query, addedBook) => {
  const uniqById = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.id
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqById([...allBooks, addedBook]),
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
    // await client.stop()
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

      <AppRoutes user={user} setUser={setUser} setError={handleSetError} />

      <Footer />
    </div>
  )
}

export default App
