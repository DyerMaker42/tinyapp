const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//sets template engine
app.set("view engine", "ejs");

//where matched pairs will be stored
const urlDatabase = {
  "b6UTxQ": { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  "i3BoGr": { longURL: "https://www.google.ca", userID: "userRandomID" }
};

//user object
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
//said needs to come before routes
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
//said outer scope, I think will replace Ok section in post later
// helper function that generates the short URL
function generateRandomString() {
  const sixtyTwo = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  results = [];
  for (let i = 0; i <= 6; i++) {
    let randomPos = Math.floor(Math.random() * (sixtyTwo.length + 1));
    results.push(sixtyTwo[randomPos])
  }
  return results.join('');
}
//helper function that retrieves user id bu email, 
function getUserbyEmail(userEmail, users) {
  for (let key in users) {
    //console.log(key,"key")
    if (users[key].email === userEmail) {
      return users[key].id
    }

  }

};
//helperfunction that outputs values based in which input and desired output
function getUserby(inputValue, users, inputParameter, desiredOutput) {
  for (let key in users) {
    //console.log(key,"key")
    if (users[key][inputParameter] === inputValue) {
      return users[key][desiredOutput]
    }

  }

}
// example getUserby("user@example.com", users, "email", "id") userRandomID;
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//Add the following route definition to express_server.js. Make sure to place this code above the app.get("/urls/:id", ...) route definition
//putting at top as not sure what ^^ is referring to
app.get("/urls/new", (req, res) => {
  const userOb = (req.cookies["user_id"])
  // const userOb = users[req.cookies("user_id")]
  // old let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  
  let templateVars = { urls: urlDatabase, user: users[userOb], userID: userOb }
  if(userOb){
  //old let templateVars = { username: req.cookies["username"] }
  // newerold let templateVars = { users }
  res.render("urls_new", templateVars);
  } else { 
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//route handler for /urls
app.get("/urls", (req, res) => {
  const userOb = (req.cookies["user_id"])
  // const userOb = users[req.cookies("user_id")]
  // old let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  let templateVars = { urls: urlDatabase, user: users[userOb], userID: req.cookies["user_id"] }
  console.log(users[userOb], "userOb")
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userOb = (req.cookies["user_id"])
  // let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[userOb] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body.longURL);
  
  let helperShortUrl = generateRandomString();
  urlDatabase[helperShortUrl] = {longURL: req.body.longURL, userID: req.cookies["user_id"]}
  console.log(urlDatabase)
 
  //console.log(urlDatabase)  // Log the POST request body to the console
  res.redirect(`/urls/${helperShortUrl}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL]
  if (longURL) {
  console.log(longURL,"longURL",urlDatabase[req.params.shortURL].longURL, "longURL 1212");
  res.redirect(longURL.longURL);
  } else {
    res.status(404).send("could not find URL you requested")
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params.shortURL)
  delete urlDatabase[req.params.shortURL].longURL
  res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {
   
  urlDatabase[req.params.id] ={longURL:req.body.updated_URL, userID: req.cookies["user_id"] } ;
  res.redirect("/urls")
});
//login request
app.get("/login", (req, res) => {
  const userOb = (req.cookies["user_id"])
  templateVars = { user: users[userOb] }
  res.render("login", templateVars)

});
//logs cookie

app.post("/login", (req, res) => {
  //old let username = req.body["username"];
  //console.log("req.body.email in post", req.body.email, "req.body.password", req.body.password, "req body id", req.body.id)
  // for (let user in users) {
  //   console.log(users[user])
  // }
  //console.log("BODY",req.body.username)
  let postUserID = getUserbyEmail(req.body.email, users)
  if (getUserby(req.body.email, users, "email", "id") === getUserby(req.body.password, users, "password", "id")) {
    //console.log("if works")
    res.cookie('user_id', postUserID)
    res.redirect("/urls")
  } else if (getUserby(req.body.email, users, "email", "email") === req.body.email || getUserby(req.body.password, users, "password", "password") === req.body.password) {
    //console.log("no login for you");
    res.status(403).send('<p href=/login> Username and/or password combination does not match our records, please check and try again. </p>')


    //return error 
  }
  //console.log("req body username", req.body["username"])
  //receive login button press

});
//logout request
app.get("/logout", (req, res) => {
  console.log("!!!req", req.body)
  res.redirect("/urls")
});
// removes cookie
app.post("/logout", (req, res) => {
  // old let username = req.body["username"];
  res.clearCookie('user_id')
  //receive login button press
  //console.log(username )
  res.redirect("/urls")
});

app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls")
  }
  else {
    const userOb = (req.cookies["user_id"])
    templateVars = { user: users[userOb] }
    res.render("register", templateVars)
  }
});

app.post("/register", (req, res) => {

  //console.log('user body', req.body)
  const generateUserID = generateRandomString()
  if (!users[generateUserID]&& !getUserby(req.body.email, users,"email","id")) {
    users[generateUserID] = {
      id: generateUserID,
      email: req.body.email,
      password: req.body.password
    }
    console.log(users)
    res.cookie('user_id', generateUserID)
    res.redirect("/urls");

  } else {
    res.status(403).send('<p href=/register> Username already exists please try again. </p>')
  }
  //console.log('helo', users)

});