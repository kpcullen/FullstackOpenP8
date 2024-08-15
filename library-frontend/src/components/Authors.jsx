import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import SetBirthyear from './SetBirthyear'

const Authors = ({ user }) => {
  const { loading, data, error } = useQuery(ALL_AUTHORS)

  if (loading) return <div>Authors loading...</div>

  if (error) return <div> Error loading authors...</div>

  const authors = data.allAuthors

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthyear authors={authors} user={user} />
    </div>
  )
}

export default Authors
