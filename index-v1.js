const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to:', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.log('error connecting to MongoDB', err.message)
  })

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
//     born: 1963,
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
//     born: 1821,
//   },
//   {
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
//   },
//   {
//     name: 'Sandi Metz', // birthyear not known
//     id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
//   },
// ]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring'],
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
//     genres: ['agile', 'patterns', 'design'],
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring'],
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring', 'patterns'],
//   },
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring', 'design'],
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
//     genres: ['classic', 'crime'],
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
//     genres: ['classic', 'revolution'],
//   },
// ]

// const typeDefs = `
//   type User {
//     username: String!
//     favoriteGenre: String!
//     id: ID!
//   }

//   type Token {
//     value: String!
//   }

//   type Book {
//     title: String!
//     published: Int!
//     author: Author!
//     genres: [String!]!
//     id: ID!
//   }

//   type Author {
//     name: String!
//     id: ID!
//     born: Int
//     bookCount: Int!
//   }

//   type Query {
//     bookCount: Int!
//     authorCount: Int!
//     allBooks(
//       author: String
//       genre: String
//     ): [Book!]!
//     allAuthors: [Author!]!
//     me: User
//   }

//   type Mutation {
//     addBook(
//       title: String!
//       author: String!
//       published: Int!
//       genres: [String!]!
//     ): Book

//     editAuthor(
//       name: String!
//       setBornTo: Int!
//     ): Author

//     createUser(
//       username: String!
//       favoriteGenre: String!
//     ): User

//     login(
//       username: String!
//       password: String!
//     ): Token
//   }
// `

// const resolvers = {
//   Query: {
//     bookCount: async () => Book.collection.countDocuments(),
//     authorCount: async () => Author.collection.countDocuments(),
//     allBooks: async (root, { author, genre }) => {
//       let query = {}

//       if (author) {
//         const bookAuthor = await Author.findOne({ name: author })
//         if (!bookAuthor) {
//           throw new GraphQLError(`Author ${author} not found!`, {
//             extensions: {
//               code: 'NOT_FOUND',
//               invalidArgs: author,
//             },
//           })
//         }
//         query.author = bookAuthor._id
//       }

//       if (genre) {
//         query.genres = { $in: [genre] }
//       }

//       const books = await Book.find(query).populate('author')
//       return books
//     },
//     allAuthors: async () => await Author.find({}),
//     me: async (root, args, { currentUser }) => {
//       const me = await User.findById(currentUser._id)
//       console.log(me)
//       return me
//     },
//   },
//   Author: {
//     bookCount: async (root) => await Book.countDocuments({ author: root._id }),
//   },
//   Mutation: {
//     addBook: async (root, args, { currentUser }) => {
//       if (!currentUser) {
//         throw new GraphQLError('Invalid token', {
//           extensions: {
//             code: 'UNAUTHENTICATED',
//           },
//         })
//       }

//       let author = await Author.findOne({ name: args.author })
//       try {
//         if (!author) {
//           author = new Author({ name: args.author, born: null })
//           await author.save()
//         }
//       } catch (err) {
//         throw new GraphQLError('Creating new book failed', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.author,
//             err,
//           },
//         })
//       }

//       try {
//         const book = new Book({ ...args, author: author._id })
//         await book.save()
//         const newBook = await Book.findById(book._id).populate('author')
//         return newBook
//       } catch (err) {
//         throw new GraphQLError('Creating new book failed', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.title,
//             err,
//           },
//         })
//       }
//     },

//     editAuthor: async (root, args, { currentUser }) => {
//       if (!currentUser) {
//         throw new GraphQLError('Invalid token', {
//           extensions: {
//             code: 'UNAUTHENTICATED',
//           },
//         })
//       }
//       let author = await Author.findOneAndUpdate(
//         { name: args.name },
//         { born: args.setBornTo }
//       )

//       return author
//     },

//     createUser: async (root, { username, favoriteGenre }) => {
//       const user = new User({ username, favoriteGenre })

//       try {
//         const newUser = user.save()
//         return newUser
//       } catch (err) {
//         throw new GraphQLError('Creating new user failed', {
//           extenstions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.username,
//             err,
//           },
//         })
//       }
//     },

//     login: async (root, args) => {
//       const user = await User.findOne({ username: args.username })

//       if (!user || args.password !== 'secret') {
//         throw new GraphQLError('Wrong credentials', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//           },
//         })
//       }
//       const userForToken = {
//         username: user.username,
//         id: user._id,
//       }
//       return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
//     },
//   },
// }

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
