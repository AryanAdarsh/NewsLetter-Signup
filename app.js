//jshint esversion:6
const express = require("express");
const https = require("https");

require('dotenv').config({path : 'vars/.env'});
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER
const path= require("path");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname ,"/signup.html"));
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
          },
        ],
      };

      const jsonData = JSON.stringify(data);

      const url = "https://"+MAPI_SERVER+".api.mailchimp.com/3.0/lists/"+MLIST_ID;

      const options = {
        method: "POST",
        auth: "aryan20:" + MAPI_KEY
      };

      const request = https.request(url, options, function (response) {
            if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname,"/success.html"));
            } else {
            res.sendFile(path.join(__dirname,"/failure.html"));
            }
            response.on("data", function (data) {
              console.log(JSON.parse(data));
          });
          
      });

      request.write(jsonData);
      request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(port,function(){;
console.log('Listening on port 3000');
});