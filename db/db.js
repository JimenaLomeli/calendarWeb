const mongoose = require('mongoose')
// const connectionURL = 'mongodb+srv://admin:admin@cluster0-crkxo.mongodb.net/clase?retryWrites=true&w=majority'
const connectionURL = 'mongodb+srv://admin:admin19@cluster0-ztqvu.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,     // crear indexes
  useUnifiedTopology: true,
  useFindAndModify: false
})


