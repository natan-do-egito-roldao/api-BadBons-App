const express = require("express");
const router = express.Router();
const { searchTreinos } = require("../controllers/treinosController");

// Rota para pesquisa de treinos
router.get("/api/treinos/search", searchTreinos);

module.exports = router;