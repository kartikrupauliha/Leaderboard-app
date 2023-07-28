const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 4 },
  password: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
  isAdmin: { type: Boolean, required: true },
  // secretPhrase:{type: String, required: false}
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
