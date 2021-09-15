const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

class Database {
  constructor() {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@wegroove-master-project.3omjc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useFindAndModify: false })
      .then(res => {
        console.log("CONNECTED TO DB")
      })
      .catch(err => {
        console.log("ERROR WHILE CONNECTING")
        console.log(err)
      })
  }
}

module.exports = new Database()