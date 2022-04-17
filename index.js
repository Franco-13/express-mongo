const express = require('express');
const { create } = require('express-handlebars');
const home = require('./routes/home')
const login = require('./routes/login')
const app = express();
const PORT = 3002

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"]
})

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views")


app.use('/', home)

app.use('/login', login)

app.use(express.static(__dirname + '/public'))

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
})