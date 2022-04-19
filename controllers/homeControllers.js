const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const readUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    return res.render("home", { urls });
  } catch (error) {
    req.flash("mensaje", { msg: error.message });
    return res.redirect("/");
  }
};

const addUrls = async (req, res) => {
  const { origin } = req.body;

  try {
    const url = new Url({
      origin,
      shortUrl: nanoid(8),
      user: req.user.id,
    });

    await url.save();

    return res.redirect("/");
  } catch (error) {
    req.flash("mensaje", { msg: error.message });
    return res.redirect("/");
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  try {
    // await Url.findByIdAndDelete(id);
    const url = await Url.findById(id)
    if (!url.user.equals(req.user.id)) {
      throw new Error("La URL que intenta eliminar no es de su pertenencia")
    }
    await url.remove();
    req.flash("mensaje", { msg: "URL eliminada con éxito"})
    return res.redirect("/");
  } catch (error) {
    req.flash("mensaje", { msg: error.message });
    return res.redirect("/");
  }
};

const editUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    if (!url.user.equals(req.user.id)) {
      throw new Error("La URL que intenta editar no es de su pertenencia")
    }
    return res.render("home", { url });
  } catch (error) {
    req.flash("mensaje", { msg: error.message });
    return res.redirect("/");
  }
};

const editUrl = async (req, res) => {
  const { origin } = req.body;
  const { id } = req.params;

  try {
    //const url = await Url.findByIdAndUpdate(id, { origin });
    const url = await Url.findById(id)
    if (!url.user.equals(req.user.id)) {
      throw new Error("La URL que intenta editUrl no es de su pertenencia")
    }
    await url.updateOne({origin})
    
    req.flash("mensaje", { msg:"URL actualizada"})

    return res.redirect("/");
  } catch (error) {
    req.flash("mensaje", { msg: error.message });
    return res.redirect("/");
  }
};

const redirectUrl = async (req, res) => {
  const { urlShort } = req.params;
  try {
    const url = await Url.findOne({ shortUrl: urlShort });
    if (url) {
      return res.redirect(url.origin);
    }
  } catch (error) {
    req.flash("mensaje", { msg: error.message });
    return res.redirect("/auth/login");
  }
};

module.exports = {
  readUrls,
  addUrls,
  deleteUrl,
  editUrlForm,
  editUrl,
  redirectUrl,
};
