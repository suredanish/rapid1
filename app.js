const crypto = require('crypto');
var express = require('express');
const prisma = require('./prisma/db');
var port = 3000
var app = express()
var cors = require('cors')
app.use(express.json())
var jwt = require('jsonwebtoken');
app.use(cors())
app.get('/helloworld', (req, res) => {
    return res.send("hello world");
})
const secret = "ThereIsNoSecret"
app.post('/signup', async (req, res) => {
    const user = req.body // {username: "danish", password: "new password"}
    const dbUser = await prisma.user.findFirst({where: {username: user.username}})
    if(dbUser){
        return res.status(409).send("User Exists")
    }
    const newUser = await prisma.user.create(
        { data: 
            { //user
                username: user.username,
                password: hashPass(user.password)
            }
        }
    )
    return res.status(201).send()

})
app.post('/signin', async(req, res) => {
    const user = req.body
    const userInDb = await prisma.user.findFirst({where:{username: user.username}})
    if(userInDb){
        if(userInDb.password == hashPass(user.password)){
            delete userInDb.password // userInDb.password = undefined
            token = getJwt(userInDb)
            return res.send({token: token})
        }
    }
    return res.status(401).send("Username of Password is not valid")
    // select * from user where username = ${user.username}
})

app.get('/hello-user', async(req, res) => {
    return res.send("Hello User")
})
app.listen(port, () => console.log("listing on " + port))




function hashPass(password){
    const hash = crypto.createHmac('md5', secret) // Using HMAC with MD5 and a secret key
        .update(password) // Update with the data to hash
        .digest('hex'); // Output in hexadecimal format
    return hash;
}

function getJwt(user) {
    var token = jwt.sign({
        // learn unix time
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: user
      }, secret);
      return token;
}