// Contains user related routes
const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'mysql_test_db'
});

function sqlConnection() {
    return pool;
}

router.get('/messages', (req, res) => {
    console.log("Showing messages...");
    res.end();
});

router.get("/users", (req, res) => {
    const queryString = "SELECT * FROM users";
    sqlConnection().query(queryString, (err, rows, fields) => {
        if(err) {
            console.log("Error occured when getting users: " + err);
            res.sendStatus(500);
            return;
        }
        res.json(rows);
    });
});

router.all("/user/:id", (req,res) => {
    console.log("Fetching user with id: " + req.params.id);

    const userId = req.params.id;
    const queryString = "SELECT * FROM users WHERE id = ?";
    sqlConnection().query(queryString, [userId], (err, rows, fields) => {
        if(err) {
            console.log("Failed to query for users \n" + err);
            res.sendStatus(500);
            return
        }

        const users = rows.map((row) => {
            return {
                firstName: row.first_name,
                lastName: row.last_name
            }
        });

        res.json(users);
    });
});

router.post('/user_create', (req, res) => {
    console.log("Trying to send user data");
    const firstName = req.body.create_first;
    const lastName = req.body.create_last;

    const newQueryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)";
    sqlConnection().query(newQueryString, [firstName, lastName], (err, row, fields) => {
        if(err) {
            console.log("Failed to POST: " + err);
            res.sendStatus(500);
            return
        }

        console.log("Inserted new user data with id: " + row.insertId);
    })
    
    res.end();
});

module.exports = router;