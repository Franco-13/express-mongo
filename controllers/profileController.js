const formidable = require("formidable")
const path = require("path")
const fs = require("fs")
const User = require("../models/User")
const Jimp = require("jimp")

const profileForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res.render("profile", {user: req.user, image: user.image})
  } catch (error) {
    req.flash("mensaje", { msg: error.message })
    return res.redirect("/profile")
  }
}

const profileEdit = async (req, res) => {
  const form = new formidable.IncomingForm()

  form.maxFileSize = 5 * 1024 * 1024

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("Falló la subída")
      }
      // console.log(files);

      const file = files.imageToUpdate

      if (file.originalFilename === "") {
        throw new Error("Debe cargar una imagen")
      }

      if (!(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif" || file.mimetype === "image/bmp")) {
        throw new Error("La imagen debe se del tipo .jpeg, .png, .gif ó .bmp")
      }

      if (file.size === 0 || file.size > form.maxFileSize) {
        throw new Error("El peso de la imagen debe ser mayor que 0mb y menor que 5mb")
      }

      const extension = file.mimetype.split("/")[1];
      const dirFile = path.join(__dirname, `../public/image/profile/${req.user.id}.${extension}`)

      let readStream = fs.createReadStream(file.filepath);
      let writeStream = fs.createWriteStream(dirFile)
      
      readStream.pipe(writeStream);
      readStream.on("end", function(){
        fs.unlinkSync(file.filepath);
      })
      //fs.renameSync(file.filepath, dirFile)
      
      const imageProfile = await Jimp.read(file.filepath)
      imageProfile.resize(200, 200).quality(90).writeAsync(dirFile)

      const user = await User.findById(req.user.id);
      user.image = `${req.user.id}.${extension}`

      await user.save()

      req.flash("mensaje", {msg: "Imagen subida con éxito"})
    } catch (error) {
      req.flash("mensaje", { msg: error.message })
    } finally {
      return res.redirect("/profile")
    }
  })
}

module.exports = {
  profileForm,
  profileEdit
}