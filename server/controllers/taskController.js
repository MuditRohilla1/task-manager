const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, description, priority, assignedTo, team, deadline } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      team,
      deadline,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  try {
    const tasks =
      role === "admin"
        ? await Task.find({ createdBy: userId }).populate("assignedTo")
        : await Task.find({ assignedTo: userId }).populate("createdBy");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addProgress = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const task = await Task.findById(id);
    task.progressUpdates.push({ text, user: req.user.id });
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
