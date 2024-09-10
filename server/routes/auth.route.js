/* Express Router */
const router = require("express").Router();
/* Auth Controller */
const { register, logout, login } = require("../controllers/auth.controller");

/* Register
   http://10.128.0.5:5500/api/auth/register (http post method) */
router.post("/register", register);
/* Login
   http://10.128.0.5:5500/api/auth/login (http post method) */
router.post("/login", login);
/* Logout
   http://10.128.0.5:5500/api/auth/logout (http get method) */
router.get("/logout", logout);

module.exports = router;
