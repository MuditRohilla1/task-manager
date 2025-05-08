const Task = require("../models/Task");
const { getSocketIO } = require("../utils/io");

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

    const io = getSocketIO();

    // Notify assigned users
    assignedTo.forEach((userId) => {
      io.to(userId).emit("taskAssigned", {
        message: "You have been assigned a new task.",
        task,
      });
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const { status, priority } = req.query;

  try {
    let query = {};

    if (role === "admin") {
      query.createdBy = userId;
    } else {
      query.assignedTo = userId;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks =
      role === "admin"
        ? await Task.find(query).populate("assignedTo")
        : await Task.find(query).populate("createdBy");

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

    const io = getSocketIO();

    // Notify the admin (creator)
    io.to(updated.createdBy.toString()).emit("statusChanged", {
      taskId: updated._id,
      newStatus: status,
      message: `${req.user.name} changed task status to ${status}.`,
    });

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

    const io = getSocketIO();

    // Notify the admin (creator)
    io.to(task.createdBy.toString()).emit("progressAdded", {
      taskId: task._id,
      message: `${req.user.name} added a progress update.`,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
