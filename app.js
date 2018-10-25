// Loading our local server using express
const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = require('./routes/user.js');
const PORT = process.env.PORT || 8080;

app.use(express.static('./public'));
app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

function sqlConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'mysql_test_db'
    });
}

app.listen(PORT, () => {
    console.log("Our server is listening on " + PORT + "...");
});

app.all("/", (req, res) => {
    console.log("Responding to '/' route");
    res.send("<h1>Hello from '/'</h1>")
});

