
'use strict'

var express = require('express');

var app = module.exports = express()


app.use(express.static('public'));



/* istanbul ignore next */
if (!module.parent) {
  app.listen(8080);
  console.log('Express started on port 8080');
}