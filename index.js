const fs = require("fs");
const mysql = require('mysql');

const DATASQL = 'data.sql'

// these are hardcoded for now, it would be better to read in environmant
// variables, and not use stuff like "password" :)
const connection = mysql.createConnection({
  host: "mariadb", // points to the mariadb image in docker-compose.yml
  user: "wbcc",
  password: "password",
  database: "wbcc",
  charset: "latin1" // utf8mb4 is better, but data.sql specifies latin1
});


function runTheQuery() {
  if (fs.existsSync(DATASQL)) {
    console.log('do something cool')
  } else {
    console.error("unable to find " + DATASQL,
      "(maybe you need to gunzip it first?)")
    process.exit(1)
  }
}

connection.query('SELECT 1', function (error, results, fields) {
  if (error) {
    // this will almost certainly happen because we need to wait for the mariadb
    // to come up. it would be better to retry in a loop with a smaller wait
    // time in-between and then give up after x retries, but we'll just hard
    // code sufficiently long time and then move on
    // sufficiently long time a
    setTimeout(() => {
      connection.query('SELECT 1', function(error, results, fields) {
        // if we error again, then just bail
        if (error) throw error;

        runTheQuery()
        connection.end()
        process.exit(0)
      })
    }, 10000) // 10 seconds was enough on my macbook
  }

  runTheQuery()
  connection.end()
  process.exit(0)
});
