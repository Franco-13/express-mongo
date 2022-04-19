const User = require("../models/User");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();
const {USER_PASS_NODEMAILER,USER_EMAIL_NODEMAILER} = process.env;

const loginForm = (req, res) => {
  res.render("login"/* , {mensaje: req.flash("mensaje")} */);
};

const loginUser = async (req, res) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    req.flash("mensaje", errors.array())
    return res.redirect("/auth/login")
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No existe el usuario");
    }

    if (!user.confirmAccount) {
      throw new Error("Cuenta sin confirmar");
    }

    if (!(await user.comparePassword(password))) {
      throw new Error("Contraseña incorrecta");
    }

    req.login(user, (err) => {
      if (err) {
        throw new Error("Error al iniciar sesión")
      }
      return res.redirect("/")
    })
  } catch (error) {
    req.flash("mensaje", {msg: error.message})
    return res.redirect("/auth/login")
  }
};

const registerForm = (req, res) => {
  res.render("register"/* , {mensaje: req.flash("mensaje")} */);
};

const registerUser = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("mensaje", errors.array())
    return res.redirect("/auth/register")
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      throw new Error("El usuario ya existe");
    }

    user = new User({ username, email, password, tokenConfirmation: nanoid() });

    await user.save();
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: USER_EMAIL_NODEMAILER,
        pass: USER_PASS_NODEMAILER
      }
    });

    await transport.sendMail({
      from: '"Fred Foo" <foo@example.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verificación de correo", // Subject line
      html: `<a href="${process.env.PATH_HEROKU ||"http://localhost:3002"}/auth/confirmAccount/${user.tokenConfirmation}">Verifica</a>`, // html body
    });
    
    req.flash("mensaje", {msg: "Revise su correo electrónico y valide su cuenta"})

    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensaje", {msg: error.message})
    return res.redirect("/auth/register")
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ tokenConfirmation: token });

    if (!user) {
      throw new Error("Token no válido");
    }

    user.confirmAccount = true;

    user.tokenConfirmation = null;

    await user.save();

    req.flash("mensaje", {msg: "Cuenta verificada, puede iniciar sesión."})

    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensaje", {msg: error.message})
    return res.redirect("/auth/login")
  }
};

const logoutSession = async(req, res) => {
  req.logout()
  res.redirect("/auth/login")
}

module.exports = {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  confirmAccount,
  logoutSession
};
