const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
var bodyParser = require('body-parser');



/* var userRouter = require('./app/routes/user.routes'); */


var corsOptions = {
  origin: "http://localhost:8081"


};
var bodyParser = require('body-parser')

app.use(cors());


// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);
var ownersRouter = require('./app/routes/owners');
app.use('/owners', ownersRouter);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});






// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


//app.use(...);
const db = require("./app/models");
const User = require("./app/models/user.model");
const Role = db.role;
db.mongoose
  .connect(`mongodb+srv://dbuser:Password@fomo-cluster.trpep.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "owner"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'owner' to roles collection");
      });
    }
  });
}


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);