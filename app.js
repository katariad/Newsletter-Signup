const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

const apiEndpoint = "https://us17.api.mailchimp.com/3.0/lists";
const listId = "6ed438ab0c";
const apiKey = "64e2299a242283e20e0ae8f40d0272c7-us17";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/submit", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const response = await axios.post(
      `${apiEndpoint}/${listId}/members`,
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.Firstname,
          LNAME: req.body.lastname,
        },
      },

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic 64e2299a242283e20e0ae8f40d0272c7-us17",
        },
      }
    );

    res.sendFile(__dirname + "/successfull.html");
  } catch (error) {
    console.error(error);
    res.render("failure.ejs", {
      // content: error.request.data.title,
    });
    setTimeout(() => {
      res.redirect("signup.html");
    }, 5000);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
