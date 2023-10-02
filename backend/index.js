const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();
const { connectToMongoose } = require("./db");
connectToMongoose();
const Users = require("./models/Users.model");

app.use(express.json());
app.use(cors({ origin: "*" }));

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "./build");
app.use(express.static(buildPath));

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});


app.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password, confirm_password } = req.body;
    const findUser = await Users.findOne({ email: email });
    if (findUser) {
      return res
        .status(401)
        .json({ status: "failed", message: "Email already exists!" });
    }
    const newUser = new Users(req.body);
    await newUser.save();
    res
      .status(200)
      .json({ status: "success", message: "signup successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "Error Occoured On Server" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existuser = await Users.findOne({ email });
    if (!existuser) {
      return res
        .sendStatus(404)
        .json({ status: "failed", message: "Sorry Email Doesn't Exists." });
    }

    res.status(200).json({ status: "success", message: "Login Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "Error Occoured On Server" });
  }
});


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
