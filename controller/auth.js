const User = require("../model/user");

async function handleSignup(req, res) {
  try {
    console.log("log of signup body by mdd:: 1", req.body);
    const { email, password, name, role } = req.body;
    console.log("log of signup body by mdd:: 2");
    const userExist = await User.findOne({ email: email })
    console.log("log of signup body by mdd:: 2");
    if (userExist) {
      return res.status(200).json({ msg: "User Already exist!",status_code:409 })
    }
    console.log("log of signup body by mdd:: 3");
    let taskData = {
      name: name,
      email: email,
      password: password,
      role: role,
    }
    console.log("log of signup body by mdd:: 4", taskData);
    await User.create(taskData);
    return res
      .status(200)
      .json({ msg: "SignUp success", success: true, status_code: 200 });
  } catch (error) {
    return res.status(200).json({ msg: "Error in SignUp", success: false, err: error, status_code: 500 });
  }
}



async function handleSignin(req, res) {
  console.log("handleSignin:", req.body);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // not found
      return res.status(201).json({ msg: "Please register!", status_code: 404 });
    }

    const token = await User.matchPassword(email, password);
    if (!token) {
      // unauthenticate
      return res.status(201).json({ msg: "Wrong Password!", success: true, status_code: 401 });
    }

    res
      .cookie("token", token)
      .status(200)
      .json({ msg: "Login success", success: true, status_code: 200, token });

  } catch (error) {
    console.error("Error in handleSignin:", error);
    return res.status(200).json({
      msg: "Internal Server Error signin",
      success: false,
      status_code: 500
    });
  }
}
async function handleGetMyProfile(req, res) {
  try {
    const autUser = req.user;
    return res.status(200).json({ msg: "profile get succesfully!",status_code:200, autUser })

  } catch (error) {
    return res.status(200).json({
      msg: "Internal Server Error Get Profile !",
      success: false,
      status_code: 500
    });
  }
}

module.exports = { handleSignup, handleSignin, handleGetMyProfile };
