//imports
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

//set env for API key
require('dotenv').config()

//run express app
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})); //ask app to get data from html using body-parser

//implement get request for signup page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//implement post request for signup page to receive data entered by user
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merged_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  //convert JS object to JSON string for sending data to mailchimp
  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID; //API url

  const options = {
    method: "POST",
    auth: "rahil:"+process.env.API_KEY
  }

  //send request with data to api
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

//implement failure route
app.post("/failure", function(req, res) {
  res.redirect("/")
});

//set local port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up!!");
});
