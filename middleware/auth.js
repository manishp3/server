const { verifyJwtToken } = require("../service/auth")

const validateAuthToken = (cookiename) => {
    return (req, res, next) => {

        console.log("validateAuthToken:: 0",req.headers.authorization);
        
        const tokenValue = req.headers.authorization
        console.log("validateAuthToken:: 1", tokenValue);
        if (!tokenValue) {
            return res.status(401).json({ msg: "unauthorized :No Token", success: false })
        }

        try {
            // console.log("toke value from validate token::", tokenValue);

            const userpayload = verifyJwtToken(tokenValue)
            console.log('====================',userpayload);
            
            req.user = userpayload
            return next()

        } catch (error) {

        }
    }

}

module.exports = {
    validateAuthToken
}