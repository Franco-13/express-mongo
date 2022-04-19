const { URL } = require("url");

const urlValidate = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFront = new URL(origin);

    if (urlFront.origin !== "null") {
      if (urlFront.protocol === "http:" || urlFront.protocol === "https:") {
        return next();
      }
      throw new Error("La url debe ser del tipo http:// ó https://");
    }
    throw new Error("Url no valida");
  } catch (error) {
    if (error.message === "Invalid URL") {
      req.flash("mensaje", {msg: "URL inválida"})
    }else{
      req.flash("mensaje", { msg: error.message });
    }
    return res.redirect("/");
  }
};

module.exports = urlValidate;
