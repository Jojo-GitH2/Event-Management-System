const { signup, login, logout } = require("../controllers/userAuthController");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("User Routes");
});
    
router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);


module.exports = router;