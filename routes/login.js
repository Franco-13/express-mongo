const express = require("express");
const { body } = require("express-validator");
const {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  confirmAccount,
  logoutSession
} = require("../controllers/authController");

const router = express.Router();

router.get("/login", loginForm);

router.post(
  "/login",
  [
    body("email", "Ingrese un email válido")
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body("password", "Ingrese una contraseña válida de 8 caracteres")
      .trim()
      .isLength({ min: 8 })
      .escape()
  ],
  loginUser
);

router.get("/register", registerForm);

router.post(
  "/register",
  [
    body("username", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "Ingrese un email válido")
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body("password", "Ingrese una contraseña válida de 8 caracteres")
      .trim()
      .isLength({ min: 8 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("No coinciden las contraseñas");
        }
        return value;
      }),
  ],
  registerUser
);

router.get("/confirmAccount/:token", confirmAccount);

router.get("/logout", logoutSession)

module.exports = router;
