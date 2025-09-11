const express = require("express");
const router = express.Router();
const { checkPNR } = require("../controllers/trainController");

// GET request with PNR as query parameter
// Example: /api/train/pnr?pnr=4844851755
router.get("/pnr", checkPNR);

module.exports = router;
