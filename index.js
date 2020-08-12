const excel = require('excel4node');
const fs = require("fs");
const mysql = require('mysql');

const clientId = '1240' // TODO: this should be configurable

// these are hardcoded for now, it would be better to read in environmant
// variables, and not use stuff like "password" :)
const connection = mysql.createConnection({
  host: "mariadb", // points to the mariadb image in docker-compose.yml
  user: "wbcc",
  password: "password",
  database: "wbcc",
  charset: "latin1" // utf8mb4 is better, but data.sql specifies latin1
});

const workbook = new excel.Workbook();
const dStandard = workbook.addWorksheet('Domestic Standard Rates');
let dStandardCell = 2
const dExpedited = workbook.addWorksheet('Domestic Expedited Rates');
let dExpeditedCell = 2
const dNextday = workbook.addWorksheet('Domestic Next Day Rates');
let dNextdayCell = 2
const iEconomy = workbook.addWorksheet('International Economy Rates');
let iEconomyCell = 2
const iExpedited = workbook.addWorksheet('International Expedited Rates');
let iExpeditedCell = 2

let style1 = [dStandard, dExpedited, dNextday]
let style2 = [iEconomy, iExpedited]

// set the headers for domestic
style1.forEach((worksheet) => {
  worksheet.cell(1, 1).string('Start Weight')
  worksheet.cell(1, 2).string('End Weight')
  worksheet.cell(1, 3).string('Zone 1')
  worksheet.cell(1, 4).string('Zone 2')
  worksheet.cell(1, 5).string('Zone 3')
  worksheet.cell(1, 6).string('Zone 4')
  worksheet.cell(1, 7).string('Zone 5')
  worksheet.cell(1, 8).string('Zone 6')
  worksheet.cell(1, 9).string('Zone 7')
  worksheet.cell(1, 10).string('Zone 8')
})

// set the headers for international
style2.forEach((worksheet) => {
  worksheet.cell(1, 1).string('Start Weight')
  worksheet.cell(1, 2).string('End Weight')
  worksheet.cell(1, 3).string('Zone A')
  worksheet.cell(1, 4).string('Zone B')
  worksheet.cell(1, 5).string('Zone C')
  worksheet.cell(1, 6).string('Zone D')
  worksheet.cell(1, 7).string('Zone E')
  worksheet.cell(1, 8).string('Zone F')
  worksheet.cell(1, 9).string('Zone G')
  worksheet.cell(1, 10).string('Zone H')
  worksheet.cell(1, 10).string('Zone I')
  worksheet.cell(1, 10).string('Zone J')
  worksheet.cell(1, 10).string('Zone K')
  worksheet.cell(1, 10).string('Zone L')
  worksheet.cell(1, 10).string('Zone M')
  worksheet.cell(1, 10).string('Zone N')
  worksheet.cell(1, 10).string('Zone O')
})

function runTheQuery() {
  // if (fs.existsSync(DATASQL)) {
  //   const data = fs.readFileSync(DATASQL, "utf8")

  //   connection.query('select 1;', (error, results, fields) => {
  //     console.log(error, results, fields)
  //   })

  //   // // this loads all of the initial data provided by data.sql
  //   // connection.query(data, (error, results, fields) => {
  //   //   if (error) throw error;

  //   //   console.log(results)
  //   //   console.log(fields)

  //   //   // now do the filtering as requested
  //   //   // TODO: the client ID should be configurable...
  //   //   const clientId = '1240'
  //   //   connection.query('SELECT * FROM `rates` where client_id = \'' + clientId + '\'', (error, results, fields) => {
  //   //     if (error) throw error;

  //   //     console.log(results)
  //   //   })
  //   // })
  // } else {
  //   console.error("unable to find " + DATASQL,
  //     "(maybe you need to gunzip it first?)")
  //   process.exit(1)
  // }
}

setTimeout(() => {
  const clientId = '1240'
  connection.query('SELECT * FROM `rates` where client_id = \'' + clientId + '\' order by zone, start_weight, end_weight', function (error, results, fields) {
  if (error) {
    // this will almost certainly happen because we need to wait for the mariadb
    // to come up. it would be better to retry in a loop with a smaller wait
    // time in-between and then give up after x retries, but we'll just hard
    // code sufficiently long time and then move on
    // sufficiently long time a
    // setTimeout(() => {
    //   connection.query('SELECT 1', function(error, results, fields) {
    //     // if we error again, then just bail
    //     if (error) throw error;

    //     console.log('here')

    //     runTheQuery()
    //     connection.end()
    //     process.exit(0)
    //   })
    // }, 10000) // 10 seconds was enough on my macbook

    throw error;
  }



  // set the headers


  // results.forEach((row, i) => {
  //   console.log(row)
  // })

  console.log(results.length)

  workbook.writeToBuffer().then((buffer) => {
    fs.writeFile("/output/output.xlsx", buffer, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
      }
    });
  })

  console.log('no here')
  // runTheQuexry()
  connection.end()
});
}, 1000)
