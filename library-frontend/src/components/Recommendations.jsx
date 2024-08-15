import { useQuery } from '@apollo/client'
import { FIND_BOOKS_BY_GENRE } from '../queries'
import Book from './Book'

const Recommendations = ({ user }) => {
  const result = useQuery(FIND_BOOKS_BY_GENRE, {
    variables: { genre: user.favoriteGenre },
    skip: !user.favoriteGenre,
  })

  if (result.loading) return <div>Loading books...</div>

  const books = result?.data?.allBooks
  if (!books) return <div>Loading books...</div>

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favourite genre:{' '}
        <strong>
          <em>{user.favoriteGenre}</em>
        </strong>
      </p>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
