const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
require('dotenv').config()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      let query = {}

      if (author) {
        const bookAuthor = await Author.findOne({ name: author })
        if (!bookAuthor) {
          throw new GraphQLError(`Author ${author} not found!`, {
            extensions: {
              code: 'NOT_FOUND',
              invalidArgs: author,
            },
          })
        }
        query.author = bookAuthor._id
      }

      if (genre) {
        query.genres = { $in: [genre] }
      }

      const books = await Book.find(query).populate('author')
      return books
    },
    allAuthors: async () => await Author.find({}).populate('books').exec(),
    me: async (root, args, { currentUser }) => {
      const me = await User.findById(currentUser._id)
      console.log(me)
      return me
    },
  },
  Author: {
    bookCount: (root) => root.books.length,
    // bookCount: async (root) => await Book.countDocuments({ author: root._id }),
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      console.log(currentUser)
      if (!currentUser) {
        throw new GraphQLError('Invalid token', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = new Author({ name: args.author, born: null })

          await author.save()
        } catch (err) {
          throw new GraphQLError('Creating new book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              err,
            },
          })
        }
      }

      try {
        const book = new Book({ ...args, author: author._id })

        await book.save()

        author.books = [...author.books, book._id]

        await author.save()

        const newBook = await Book.findById(book._id).populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

        return newBook
      } catch (err) {
        throw new GraphQLError('Creating new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            err,
          },
        })
      }
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Invalid token', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      let author = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo }
      )

      return author
    },

    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })

      try {
        const newUser = user.save()
        return newUser
      } catch (err) {
        throw new GraphQLError('Creating new user failed', {
          extenstions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            err,
          },
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return {
        username: user.username,
        id: user._id,
        favoriteGenre: user.favoriteGenre,
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
