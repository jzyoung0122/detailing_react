module.exports = (app) => {
    const mongoose = require('mongoose');
    // mongoose.connect('mongodb://127.0.0.1:27017/dbecommerce', {

    //   useUnifiedTopology: true,
    // })
    // .then(console.log("Connected to MongoDB!"))
    // .catch((err)=>console.log(err))

    require('dotenv').config()
    process.env.authURI
    mongoose.connect(process.env.authURI, {
      useUnifiedTopology: true,
    })
    .then(console.log("Connected to MongoDB!"))
    .catch((err)=>console.log(err))
  };