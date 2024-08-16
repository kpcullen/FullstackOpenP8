import { useQuery } from '@apollo/client'
import { ALL_BOOKS, FIND_BOOKS_BY_GENRE } from '../queries'
import { useState } from 'react'
import GenreButtons from './GenreButtons'
import Book from './Book'

const Books = () => {
  const [genre, setGenre] = useState('')

  const { loading, error, data } = useQuery(
    genre ? FIND_BOOKS_BY_GENRE : ALL_BOOKS,
    { fetchPolicy: 'cache-first' },
    { variables: genre ? { genre } : {} }
  )

  if (loading) return <div>Books loading...</div>

  if (error) return <div>Error loading books...</div>

  return (
    <div>
      <h2>Books in library</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </tbody>
      </table>
      <GenreButtons setGenre={setGenre} />
    </div>
  )
}

export default Books
