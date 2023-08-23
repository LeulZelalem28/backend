const User = require('../model/userModel')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({refreshToken}).exec()
    if(!foundUser) return res.sendStatus(403)
    // const roles = Object.values(foundUser.roles);
    jwt.verify(refreshToken, 
               process.env.REFRESH_TOKEN_SECRET, 
               (err,decoded) => {
                if(err || foundUser.username !== decoded.username) return sendStatus(403)
               
    const accessToken = jwt.sign(
                // {
                //   "UserInfo": {
                //       "username": foundUser.username,
                //       "roles": roles
                //   }
                { UserInfo: {
                  "username":foundUser.username,
                  "id": foundUser.id
                }},
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: "10m"})
    res.json({/*roles,*/accessToken})
            })
}

module.exports = {handleRefreshToken}