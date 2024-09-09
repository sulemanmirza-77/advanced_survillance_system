/* Express Router */
const router = require("express").Router();
/* Auth Controller */
const { register, logout, login } = require("../controllers/auth.controller");

/* Register
   http://localhost:5500/api/auth/register (http post method) */
router.post("/register", register);
/* Login
   http://localhost:5500/api/auth/login (http post method) */
router.post("/login", login);
/* Logout
   http://localhost:5500/api/auth/logout (http get method) */
router.get("/logout", logout);

module.exports = router;
