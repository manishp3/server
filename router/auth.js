const express = require("express");
const { handleSignup, handleSignin, handleGetMyProfile } = require("../controller/auth");
const { validateAuthToken } = require("../middleware/auth");

const router = express.Router();
router.post("/register", (req, res) => {
  handleSignup(req, res);
});
router.post("/login", async (req, res) => {
  handleSignin(req, res);
});
router.get("/me",validateAuthToken("token"), async (req, res) => {
  handleGetMyProfile(req, res);
  // return res.json({ success: true })
});

module.exports = router;
