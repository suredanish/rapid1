const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
var express = require('express')
var port = 3000
var app = express()
app.use(express.json())
app.get('/helloworld', (req, res) => {
    return res.send("hello world");
})
const secret = "ThereIsNoSecret"
app.post('/signup', async (req, res) => {
    const user = req.body // {username: "danish", password: "new password"}
    const prisma = new PrismaClient();
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
    var prisma = new PrismaClient();
    const userInDb = await prisma.user.findFirst({where:{username: user.username}})
    if(userInDb){
        if(userInDb.password == hashPass(user.password)){
            return res.send("this is the token")
        }
    }
    return res.status(401).send("Username of Password is not valid")
    // select * from user where username = ${user.username}
})
app.listen(port, () => console.log("listing on " + port))

function hashPass(password){
    const hash = crypto.createHmac('md5', secret) // Using HMAC with MD5 and a secret key
        .update(password) // Update with the data to hash
        .digest('hex'); // Output in hexadecimal format
    return hash;
}