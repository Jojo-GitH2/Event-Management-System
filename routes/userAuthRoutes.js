const { signup, login, logout, verifyUser } = require("../controllers/userAuthController");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("User Routes");
});
    
router.post("/signup", signup);

router.get("/verify/:token", verifyUser);

router.post("/login", login);

router.get("/logout", logout);


module.exports = router;