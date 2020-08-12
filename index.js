const excel = require('excel4node');
const fs = require("fs");
const mysql = require('mysql');

const clientId = '1240' // TODO: this should be configurable

let query = 'SELECT * FROM `rates` WHERE `client_id` = \'' + clientId +
  '\' ORDER BY `start_weight`, `zone`'

// these are hardcoded for now, it would be better to read in environmant
// variables, and not use stuff like "password" :)
const connectionDetails = {
  host: "mariadb", // points to the mariadb image in docker-compose.yml
  user: "wbcc",
  password: "password",
  database: "wbcc",
  charset: "latin1" // utf8mb4 is better, but data.sql specifies latin1
}

const workbook = new excel.Workbook();
const dStandard = workbook.addWorksheet('Domestic Standard Rates');
let dStandardCell = 1
let dStandardLastStart = 0.0
const dExpedited = workbook.addWorksheet('Domestic Expedited Rates');
let dExpeditedCell = 1
let dExpeditedLastStart = 0.0
const dNextday = workbook.addWorksheet('Domestic Next Day Rates');
let dNextdayCell = 1
let dNextdayLastStart = 0.0
const iEconomy = workbook.addWorksheet('International Economy Rates');
let iEconomyCell = 1
let iEconomyLastStart = 0.0
const iExpedited = workbook.addWorksheet('International Expedited Rates');
let iExpeditedCell = 1
let iExpeditedLastStart = 0.0

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
  worksheet.cell(1, 11).string('Zone I')
  worksheet.cell(1, 12).string('Zone J')
  worksheet.cell(1, 13).string('Zone K')
  worksheet.cell(1, 14).string('Zone L')
  worksheet.cell(1, 15).string('Zone M')
  worksheet.cell(1, 16).string('Zone N')
  worksheet.cell(1, 17).string('Zone O')
})

function domesticZoneToCell(zone) {
  switch(zone) {
    case '1':
      return 3;
    case '2':
      return 4;
    case '3':
      return 5;
    case '4':
      return 6;
    case '5':
      return 7;
    case '6':
      return 8;
    case '7':
      return 9;
    case '8':
      return 10;
  }
}

function intlZoneToCell(zone) {
  switch(zone) {
    case 'A':
      return 3;
    case 'B':
      return 4;
    case 'C':
      return 5;
    case 'D':
      return 6;
    case 'E':
      return 7;
    case 'F':
      return 8;
    case 'G':
      return 9;
    case 'H':
      return 10;
    case 'I':
      return 11;
    case 'J':
      return 12;
    case 'K':
      return 13;
    case 'L':
      return 14;
    case 'M':
      return 15;
    case 'N':
      return 16;
    case 'O':
    return 17;
  }
}

function parseResults(results) {
  results.forEach((row, index) => {
    if (row.locale === 'domestic' && row.shipping_speed === 'standard') {
      if (row.start_weight > dStandardLastStart) {
        dStandardCell++
        dStandardLastStart = row.start_weight

        // "number" is technically better here, but the provided output uses
        // string values so we match to be consistent
        dStandard.cell(dStandardCell, 1).string(row.start_weight.toFixed(2))
        dStandard.cell(dStandardCell, 2).string(row.end_weight.toFixed(2))
      }

      dStandard.cell(dStandardCell, domesticZoneToCell(row.zone)).string(row.rate.toFixed(2))
    } else if (row.locale === 'domestic' && row.shipping_speed === 'expedited') {
      if (row.start_weight > dExpeditedLastStart) {
        dExpeditedCell++
        dExpeditedLastStart = row.start_weight

        dExpedited.cell(dExpeditedCell, 1).string(row.start_weight.toFixed(2))
        dExpedited.cell(dExpeditedCell, 2).string(row.end_weight.toFixed(2))
      }

      dExpedited.cell(dExpeditedCell, domesticZoneToCell(row.zone)).string(row.rate.toFixed(2))
    } else if (row.locale === 'domestic' && row.shipping_speed === 'nextDay') {
      if (row.start_weight > dNextdayLastStart) {
        dNextdayCell++
        dNextdayLastStart = row.start_weight

        dNextday.cell(dNextdayCell, 1).string(row.start_weight.toFixed(2))
        dNextday.cell(dNextdayCell, 2).string(row.end_weight.toFixed(2))
      }

      dNextday.cell(dNextdayCell, domesticZoneToCell(row.zone)).string(row.rate.toFixed(2))
    } else if (row.locale === 'international' && row.shipping_speed === 'intlEconomy') {
      if (row.start_weight > iEconomyLastStart) {
        iEconomyCell++
        iEconomyLastStart = row.start_weight

        iEconomy.cell(iEconomyCell, 1).string(row.start_weight.toFixed(2))
        iEconomy.cell(iEconomyCell, 2).string(row.end_weight.toFixed(2))
      }

      iEconomy.cell(iEconomyCell, intlZoneToCell(row.zone)).string(row.rate.toFixed(2))
    } else if (row.locale === 'international' && row.shipping_speed === 'intlExpedited') {
      if (row.start_weight > iExpeditedLastStart) {
        iExpeditedCell++
        iExpeditedLastStart = row.start_weight

        iExpedited.cell(iExpeditedCell, 1).string(row.start_weight.toFixed(2))
        iExpedited.cell(iExpeditedCell, 2).string(row.end_weight.toFixed(2))
      }

      iExpedited.cell(iExpeditedCell, intlZoneToCell(row.zone)).string(row.rate.toFixed(2))
    }
  })

  workbook.writeToBuffer().then((buffer) => {
    fs.writeFile("/output/output.xlsx", buffer, (err) => {
      if (err) throw err;
    })
  })
}

let connection = mysql.createConnection(connectionDetails)

connection.query(query, (error, results, fields) => {
  if (error) {
    // this always fails on a fresh docker-compose up, as the database is not
    // initialized and we get a connection refused. it would be better to retry
    // in a loop and then bail after x attempts, but we're just going to
    // hardcode one attempt for this demo.
    setTimeout(() => {
      connection = mysql.createConnection(connectionDetails)

      connection.query(query, (error, results, fields) => {
        console.log(results.length)
        parseResults(results)
        connection.end()
      })
    }, 10000)
  } else {
    console.log(results.length)
    parseResults(results)
    connection.end()
  }
})
