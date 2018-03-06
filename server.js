let express = require("express")
let bodyParser = require('body-parser')

let app = express()

let port = parseInt(process.env.PORT, 10) || 8082
let publicDir =  __dirname + '/app'

app.use(express.static(publicDir))

console.log('Server listening on ', port)
app.listen(port)

