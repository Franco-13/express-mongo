const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const urls = [
    {origin:"www.google.com/a1", shortUrl: "a1"},
    {origin:"www.google.com/a2", shortUrl: "a2"},
    {origin:"www.google.com/a3", shortUrl: "a3"},
  ]
  res.render("home", {urls})
})

module.exports = router;
