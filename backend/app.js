const express = require("express")
const cors =  require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require("./routes/user.route")

var app = express();
app.use(cors());

var port = process.env.PORT || 3000;

//connect mongo db
const options ={
    autoIndex: true,
    useUnifiedTopology: true,
}

const connectWithRetry = () => {
      mongoose.connect("mongodb://localhost:27017/vakaira", options).then(() => {
        console.log("Database connected")
    }).catch(err => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err)
      setTimeout(connectWithRetry, 3000)
    })
  };

connectWithRetry();

//read the request Body value
app.use(express.json());
// app.use(express.bodyParser());

//allow all object and array values in request
app.use(express.urlencoded({
  extended: true
}));


app.use(function(_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');

   /*  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); */
    next();
});

app.use('/', user);

app.listen(port, function(){
    console.log('Server started on port '+port);
})