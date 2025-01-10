var express = require('express')
var port = 3000
var app = express()

app.get('/helloworld', (req, res) => {
    return res.send("hello world");
})
app.listen(port, () => console.log("listing on " + port))