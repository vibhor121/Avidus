const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({ title, description, status, priority, user: req.user._id });

    await ActivityLog.create({
      user: req.user._id,
      action: 'TASK_CREATED',
      details: `Task created: "${title}"`,
      ipAddress: req.ip,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to update this task' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'TASK_UPDATED',
      details: `Task updated: "${updated.title}"`,
      ipAddress: req.ip,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to delete this task' });

    await ActivityLog.create({
      user: req.user._id,
      action: 'TASK_DELETED',
      details: `Task deleted: "${task.title}"`,
      ipAddress: req.ip,
    });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
