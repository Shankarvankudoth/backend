import joi from "joi";
import mongoose from "mongoose";
import { createError } from "../../../services/errorhandling.service.js";
import loggerService from "../../../services/logging.service.js";

const logger = loggerService.getModuleLogger("TaskService");

const baseTaskSchema = {
  title: joi.string().required(),
  description: joi.string().required(),
  actions: joi
    .array()
    .items(
      joi.object({
        _id: joi.string().optional(),
        creator: joi.string().max(200),
        note: joi.string().max(1000),
      })
    )
    .optional(),
  assignee: joi.array().required(),
  stage: joi.string().allow("").optional(),
  creator: joi.string().max(100).required(),
  targetDate: joi.date().required(),
  updatedDate: joi.date().allow(null).optional().default(new Date()),
  completionDate: joi.date().allow(null).optional(),
  version: joi.number().default(1),
  documentId: joi
    .array()
    .items(joi.string().optional()) // Allow an array of string IDs
    .optional(),
};

// Function to retrieve schema based on version
const getTaskSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return joi.object(baseTaskSchema); // Version 1 uses base schema
    case 2:
      return joi.object({
        ...baseTaskSchema,
        priority: joi.string().valid("Low", "Medium", "High").optional(), // Example additional field for version 2
      });
    case 3:
      return joi.object({
        ...baseTaskSchema,
        priority: joi.string().valid("Low", "Medium", "High").optional(),
        estimatedHours: joi.number().min(1).optional(), // Example field for version 3
      });
    default:
      return null; // Invalid version
  }
};

// Helper function to update project completion date
const updateProjectCompletionDate = async (Project, projectId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      logger.warn("Project not found for completion date update", {
        projectId,
      });
      return;
    }

    // Only consider non-deleted tasks with completion dates
    const completedTasks = project.task
      .filter((task) => task.stage !== "deleted" && task.completionDate)
      .map((task) => ({
        ...task.toObject(),
        completionDate: new Date(task.completionDate),
      }));

    // Get all active (non-deleted) tasks
    const activeTasks = project.task.filter((task) => task.stage !== "deleted");

    if (
      completedTasks.length === activeTasks.length &&
      completedTasks.length > 0
    ) {
      // All tasks are complete, find the latest completion date
      const latestCompletionDate = new Date(
        Math.max(...completedTasks.map((task) => task.completionDate))
      );

      // Update project completion date only if it's different
      if (
        !project.completionDate ||
        project.completionDate.getTime() !== latestCompletionDate.getTime()
      ) {
        project.completionDate = latestCompletionDate;
        await project.save();
        logger.info("Project completion date updated", {
          projectId,
          completionDate: latestCompletionDate,
        });
      }
    } else if (project.completionDate) {
      // If not all tasks are complete but project has a completion date, remove it
      project.completionDate = null;
      await project.save();
      logger.info("Project completion date cleared", { projectId });
    }
  } catch (error) {
    logger.error("Error while updating project completion date", {
      error: error.message,
      stack: error.stack,
      projectId,
    });
  }
};

/**
 * Get task by ID within a project.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const getTaskById = async (req, res, next, Project) => {
  logger.info(
    "Received API call at /projects/:id/task to get task from specific project based on IDs",
    { params: req.params }
  );

  const { id: projectId, taskId } = req.params;

  if (!projectId || !taskId) {
    logger.error("Project or Task ID missing", { projectId, taskId });
    return next(createError(400, "Project or Task ID missing"));
  }

  // Validate the IDs
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    logger.error("Invalid Project or Task ID format", { projectId, taskId });
    return next(createError(400, "Invalid Project or Task ID format"));
  }

  try {
    const data = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(projectId) } }, // Proper use of ObjectId
      { $unwind: "$task" },
      {
        $match: {
          "task._id": new mongoose.Types.ObjectId(taskId), // Proper use of ObjectId
        },
      },
      {
        $replaceRoot: { newRoot: "$task" },
      },
    ]);

    if (!data.length) {
      logger.warn("Task record not found", { projectId, taskId });
      return next(createError(404, "Task record not found"));
    }

    const [task] = data;
    return res.send(task);
  } catch (error) {
    logger.error("Error while getting specific task", {
      error: error.message,
      stack: error.stack,
    });
    return next(createError(500, "Internal server error"));
  }
};

/**
 * Create a new task within a project.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const createTask = async (req, res, next, Project) => {
  logger.info(
    "Received API call at /projects/:id/task to add task to specific project",
    { params: req.params, body: req.body }
  );

  if (!req.params.id) return next(createError(400, "Project ID missing"));

  const version = req.body?.version || 1;
  const taskSchema = getTaskSchemaForVersion(version);

  if (!taskSchema) {
    logger.error("Invalid version provided", { version });
    return next(createError(400, "Invalid version provided"));
  }

  const { error, value } = taskSchema.validate(req.body);

  if (error) {
    logger.error("Error while validating task", {
      error: error.details[0].message,
    });
    return next(createError(422, error.details[0].message));
  }

  try {
    const project = await Project.findById(req.params.id, { "task.index": 1 });
    if (!project) {
      logger.warn("Project not found", { projectId: req.params.id });
      return next(createError(404, "Project not found"));
    }

    const taskIndex =
      project.task.length > 0
        ? Math.max(...project.task.map((t) => t.index)) + 1
        : 0;
    const newTask = {
      ...value,
      stage: value?.stage || "To Do",
      order: (project?.task?.length || 0) + 1,
      index: taskIndex,
    };

    project.task.push(newTask);
    const updatedProject = await project.save();
    const createdTask = updatedProject.task[updatedProject.task.length - 1];

    res.send({ message: "Task created successfully", id: createdTask._id });
  } catch (error) {
    logger.error("Error while creating new task", {
      error: error.message,
      stack: error.stack,
    });
    return next(createError(500, "Internal server error"));
  }
};

/**
 * Update task by ID within a project.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const updateTaskById = async (req, res, next, Project) => {
  logger.info(
    "Received API call at /projects/:id/task to handle task operation",
    { params: req.params, body: req.body }
  );

  if (!req.params.id || !req.params.taskId) {
    logger.error("Project ID and Task ID are required", {
      projectId: req.params.id,
      taskId: req.params.taskId,
    });
    return next(createError(400, "Project ID and Task ID are required"));
  }

  try {
    const operation = req.method;
    const version = req.body?.version || 1;
    const taskSchema = getTaskSchemaForVersion(version);

    if (!taskSchema && operation === "PUT") {
      logger.error("Invalid version provided for update", { version });
      return next(createError(400, "Invalid version provided"));
    }

    if (operation === "PUT") {
      const { error, value } = taskSchema.validate(req.body);

      if (error) {
        logger.error("Error while validating task update", {
          error: error.details[0].message,
        });
        return next(createError(422, error.details[0].message));
      }
    }

    let updateData = {};
    let shouldUpdateProjectCompletion = false;

    if (operation === "PUT") {
      updateData["task.$.updatedDate"] = new Date();

      Object.keys(req.body).forEach((key) => {
        if (key === "completionDate" && req.body[key]) {
          const newCompletionDate = new Date(req.body[key]);
          updateData["task.$.completionDate"] = newCompletionDate;
          updateData["task.$.stage"] = "Done";
          shouldUpdateProjectCompletion = true;
        } else if (key === "targetDate" && req.body[key]) {
          updateData["task.$.targetDate"] = new Date(req.body[key]);
        } else if (key === "actions" && req.body[key]) {
          updateData["task.$.actions"] = req.body[key];
        } else if (req.body[key] !== undefined) {
          updateData[`task.$.${key}`] = req.body[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return next(createError(400, "No valid fields provided for update"));
      }
    } else if (operation === "DELETE") {
      updateData["task.$.stage"] = "deleted";
      shouldUpdateProjectCompletion = true;
    }

    const result = await Project.updateOne(
      {
        _id: new mongoose.Types.ObjectId(req.params.id),
        task: {
          $elemMatch: { _id: new mongoose.Types.ObjectId(req.params.taskId) },
        },
      },
      { $set: updateData }
    );

    if (!result.modifiedCount) {
      logger.warn("Task not found or not updated", {
        projectId: req.params.id,
        taskId: req.params.taskId,
      });
      return next(createError(404, "Task not found or not updated"));
    }

    // Update project completion date only if necessary
    if (shouldUpdateProjectCompletion) {
      await updateProjectCompletionDate(Project, req.params.id);
    }

    if (operation === "PUT") {
      res.send({ message: "Task updated successfully" });
    } else if (operation === "DELETE") {
      res.send({ message: "Task marked as deleted successfully" });
    }
  } catch (error) {
    logger.error("Error while handling task", {
      error: error.message,
      stack: error.stack,
    });
    return next(createError(500, "Internal server error"));
  }
};

/**
 * Update tasks when dragged within a project.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const updateTasksWhenDragged = async (req, res, next, Project) => {
  let todo = [];
  let hasCompletionDateUpdate = false;

  for (const key in req.body) {
    for (const index in req.body[key].items) {
      req.body[key].items[index].stage = req.body[key].name;

      const completionDate =
        req.body[key].name.toLowerCase() === "done"
          ? new Date().toISOString()
          : null;

      if (completionDate) {
        hasCompletionDateUpdate = true;
      }

      todo.push({
        name: req.body[key].items[index]._id,
        stage: req.body[key].items[index].stage,
        order: index,
        completionDate,
      });
    }
  }
  try {
    await Promise.all(
      todo.map(async (item) => {
        const updateFields = {
          "task.$.order": item.order,
          "task.$.stage": item.stage,
        };

        if (item.completionDate) {
          updateFields["task.$.completionDate"] = item.completionDate;
        }

        await Project.updateOne(
          {
            _id: new mongoose.Types.ObjectId(req.params.id),
            task: {
              $elemMatch: { _id: new mongoose.Types.ObjectId(item.name) },
            },
          },
          { $set: updateFields }
        );
      })
    );

    // Update project completion date only if there were completion date changes
    if (hasCompletionDateUpdate) {
      await updateProjectCompletionDate(Project, req.params.id);
    }

    res.send(todo);
  } catch (error) {
    logger.error("Error while updating tasks when dragged", {
      error: error.message,
      stack: error.stack,
    });
    return next(createError(500, "Internal server error"));
  }
};
