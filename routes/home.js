const express = require("express");
const {
  readUrls,
  addUrls,
  deleteUrl,
  editUrlForm,
  editUrl,
  redirectUrl,
} = require("../controllers/homeControllers");
const { profileForm, profileEdit } = require("../controllers/profileController");
const urlValidate = require("../middleware/urlValidate");
const { userVerificate } = require("../middleware/userVerification");
const router = express.Router();

router.get("/", userVerificate, readUrls);

router.post("/", userVerificate, urlValidate, addUrls);

router.get("/eliminar/:id", userVerificate, deleteUrl);

router.get("/editar/:id", userVerificate, editUrlForm);

router.post("/editar/:id", userVerificate, urlValidate, editUrl);

router.get("/profile", userVerificate, profileForm);
router.post("/profile", userVerificate, profileEdit);

router.get("/:urlShort", redirectUrl);

module.exports = router;
