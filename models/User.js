const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  tokenConfirmation: {
    type: String,
    default: null
  },
  confirmAccount: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: null
  }
})

userSchema.pre("save", async function(next){
  const user = this
  if (!user.isModified("password")) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash
    next()
  } catch (error) {
    console.log(error);
    throw new Error("Error al codificar la contraseña")
  }
})

userSchema.methods.comparePassword = async function(passwordToCompare) {
  return await bcrypt.compare(passwordToCompare, this.password)
}

module.exports = mongoose.model('User', userSchema);