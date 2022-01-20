"use strict";

const mysql = require("mysql");
const db = mysql.createFoolCluster();

db.add("ban", {
  host: "localhost",
  user: "root",
  password: "",
  database: "ban",
  port: 3306,
});

module.exports.db = db;
