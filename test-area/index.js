const express = require("express");
const app = express();
app.use(express.json());

const validator = require("@tdogan/validator");

app.post("/register", validator({
  email: { required: true, minLength: 6 },
  phone: { required: true },
  username: { required: true, minLength: 3 }
}), (req, res) => {
  res.send({ message: "All good", body: req.body });
});

app.listen(3000);