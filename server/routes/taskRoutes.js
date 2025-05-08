const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  addProgress,
} = require("../controllers/taskController");

router.post("/", auth, createTask); // Admin
router.get("/", auth, getTasks); // Admin/User
router.put("/:id/status", auth, updateTaskStatus); // User
router.post("/:id/progress", auth, addProgress); // User

module.exports = router;
