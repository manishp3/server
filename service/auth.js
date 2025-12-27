const jwt = require("jsonwebtoken")

const generateJwtToken = (user) => {
    console.log("generateJwtToken role::", user);

    const payload = {
        _id: user._id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user?.role
    }
    const token = jwt.sign(payload, process.env.SECRET)
    // console.log("log of genrated token::", token);

    return token;
}

const verifyJwtToken = (token) => {
    console.log('verifyJwtToken============', token);

    const userPayload = jwt.verify(token, process.env.SECRET)
    console.log('verifyJwtToken============ 1', userPayload);
    // console.log("log of payload::", userPayload);

    return userPayload;

}


module.exports = {
    generateJwtToken,
    verifyJwtToken,

}