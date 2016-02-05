var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));
app.listen(process.env.PORT || 3000);

console.log("Website live on port 3000 ! (Ctrl+C to stop it)");