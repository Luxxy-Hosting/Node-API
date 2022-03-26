const express = require('express')
const fs = require('fs')
const https = require("https");

const dir = __dirname
const app = express()
const apirouter = require("./routes/apirouter")

const httpport = 998
const httpsport = 997

app.get('/', function(req, res){ res.json({ status: 200, message: 'what are you doing here :)'  }) });
app.use('/api', apirouter)



const privateKey = fs.readFileSync(`${dir}/certs/privkey.pem`);
const certificate = fs.readFileSync(`${dir}/certs/fullchain.pem`);

app.listen(httpport, () => { console.log(`http server running on 998`) })
https.createServer( { key: privateKey, cert: certificate }, app).listen(httpsport, ()=> { console.log('https server running on 997') });