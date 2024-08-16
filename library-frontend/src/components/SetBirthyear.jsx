import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const SetBirthyear = ({ authors, user, setError }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (err) => {
      const messages = err.graphQLErrors.map((err) => err.message).join('\n')
      setError(messages)
    },
  })

  const submit = (e) => {
    e.preventDefault()
    editAuthor({
      variables: {
        name: name.value,
        born,
      },
    })
    setName('')
    setBorn('')
  }

  let options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  if (!user) return null

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Name:
          <Select
            options={options}
            onChange={(option) => setName(option)}
            placeholder="Choose an author"
            value={name}
          />
        </div>
        <div>
          Born:
          <input
            type="text"
            value={born}
            onChange={(e) => setBorn(+e.target.value)}
          />
        </div>

        <button>Set birthyear</button>
      </form>
    </div>
  )
}

export default SetBirthyear
