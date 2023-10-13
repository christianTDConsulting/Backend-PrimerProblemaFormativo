
/*
const path = require('path');
const mysql = require('mysql2/promise');

const dotenv = require('dotenv'); // Importa la biblioteca dotenv

dotenv.config({ path: path.resolve(__dirname, '../.env') })// Carga las variables de entorno desde el archivo .env




// Configuración de la conexión a la base de datos

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});


// Conectar a la base de datos

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});



//ZOD validador JS
/*
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});



*/
//------------------------------------------------------y 
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();
module.exports=db;
