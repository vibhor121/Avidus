const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getActivityLogs,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);
router.get('/activity-logs', getActivityLogs);

module.exports = router;
