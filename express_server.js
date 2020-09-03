const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//sets template engine
app.set("view engine", "ejs");

//where matched pairs will be stored
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
app.use(bodyParser.urlencoded({extended: true}));
//said outer scope, I think will replace Ok section in post later
// helper function that generates the short URL
function generateRandomString() {
  const sixtyTwo = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  results = [];
  for(let i=0; i <= 6; i ++) {
    let randomPos = Math.floor(Math.random()*(sixtyTwo.length+1));
    results.push(sixtyTwo[randomPos])
  }
  return results.join('');
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//Add the following route definition to express_server.js. Make sure to place this code above the app.get("/urls/:id", ...) route definition
//putting at top as not sure what ^^ is referring to
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//route handler for /urls
app.get("/urls", (req, res) => {
  console.log(req.cookies["username"])
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let helperShortUrl = generateRandomString();
  urlDatabase[helperShortUrl] = req.body.longURL
  //console.log(req.body);
  //console.log(urlDatabase)  // Log the POST request body to the console
  res.redirect(`/urls/${helperShortUrl}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params.shortURL)
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {
  // console.log(req.params)
   urlDatabase[req.params.id] =req.body.updated_URL;
  res.redirect("/urls")
});
//login request
app.get("/login", (req, res) => {
  console.log("!!!req", req.body)
  res.redirect("/urls")
});
//logs cookie

app.post("/login", (req, res) => {
  let username = req.body["username"];
  //console.log("BODY",req.body.username)
  res.cookie('username', username)
  //receive login button press
  console.log(username )
  res.redirect("/urls")
});
//logout request
app.get("/logout", (req, res) => {
  console.log("!!!req", req.body)
  res.redirect("/urls")
});
// removes cookie
app.post("/logout", (req, res) => {
  let username = req.body["username"];
  res.clearCookie('username', username)
  //receive login button press
  console.log(username )
  res.redirect("/urls")
});

app.get("/register", (req,res)=>{
  console.log("eat shit")
  res.redirect("/registration")
});