
var fs = require('fs');
var locker = fs.readFileSync('./locker.json');
var lockerJSON = JSON.parse(locker);
console.log(lockerJSON.seats);

var seats = lockerJSON.seats;

module.export = seats;