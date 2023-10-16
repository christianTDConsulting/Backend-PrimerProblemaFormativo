const express = require('express');
//const bodyParser = require('body-parser');
const clienteRouter = require('./routes/clienteRoutes');
const tlfRouter = require('./routes/tlfRoutes');

const cors = require('cors'); //para que permita request de un puerto con otro origen
const app = express();

const port = process.env.PORT || 3000;

//app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use('/', clienteRouter);
app.use('/', tlfRouter);




app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
