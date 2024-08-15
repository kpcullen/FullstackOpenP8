import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (err) => {
      const messages = err.graphQLErrors.map((err) => err.message).join(' ')
      setError(messages)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        }
      })
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    await createBook({ variables: { title, author, published, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres([...genres, genre])
    setGenre('')
  }

  return (
    <div>
      <h2>Add a new book to the library</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Title"
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Author"
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(+target.value)}
            placeholder="Year of publication"
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            placeholder="Add genres"
          />
          <button onClick={addGenre} type="button">
            Add genre
          </button>
        </div>
        <div>Genres selected: {genres.join(' ')}</div>
        <button type="submit">Add new book</button>
      </form>
    </div>
  )
}

export default NewBook
