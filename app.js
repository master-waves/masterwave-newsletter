//Imprting Package
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");

const app = express();

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Logging Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Setting static file
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

//Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phone,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const options = {
    url: "https://us14.api.mailchimp.com/3.0/lists/abc447db13",
    method: "POST",
    headers: {
      Authorization: "Master1 e09501ef278e8d1996efeff68bd1a183-us14",
    },
    body: jsonData,
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }

    if (response.statusCode === 200) {
      // res.send("Succesfully subscribed!");
      res.sendFile(__dirname + "/" + "success.html");
    } else {
      //res.send("There was an error with signing up, please try again!");
      res.sendFile(__dirname + "/" + "failure.html");
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// Setting the PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    ` The server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
