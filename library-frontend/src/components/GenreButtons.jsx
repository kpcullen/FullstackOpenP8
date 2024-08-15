import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const GenreButtons = ({ setGenre }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (loading) return <div>Loading genres...</div>

  const allBooks = data.allBooks

  const genres = Array.from(
    new Set(
      allBooks.flatMap((book) => {
        return book.genres.map((genre) => genre)
      })
    )
  )

  return (
    <div>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre('')}>All books</button>
    </div>
  )
}

export default GenreButtons
