import joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ProjectManagementService");

// Define the base schema for project validation
const baseProjectSchema = {
  title: joi.string().max(200).required(),
  description: joi.string().required(),
  assignee: joi.array().required(),
  branch: joi.array().required(),
  owner: joi.string().max(200).required(),
  notes: joi
    .array()
    .items(
      joi.object({
        _id: joi.string().optional(),
        creator: joi.string().max(200),
        note: joi.string().max(1000),
      })
    )
    .optional(),
  targetDate: joi.date().required(),
  completionDate: joi.date().allow(null).optional(),
  version: joi.number().default(1),
};

// Return project schema based on version
const getProjectSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return joi.object(baseProjectSchema); // For version 1, use the base schema
    case 2:
      return joi.object({
        ...baseProjectSchema,
        additionalFieldForV2: joi.string().optional(), // Example additional field for version 2
      });
    case 3:
      return joi.object({
        ...baseProjectSchema,
        additionalFieldForV2: joi.string().optional(),
        anotherNewFieldForV3: joi.string().optional(), // Example additional field for version 3
      });
    default:
      return null; // For invalid versions
  }
};

/**
 * Get all projects.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const getAllProjects = async (req, res, next, Project) => {
  logger.info("Fetching all projects");
  try {
    const data = await Project.find({});
    logger.info("Projects retrieved successfully", { count: data.length });
    res.status(200).send(data);
  } catch (error) {
    logger.error("Error fetching projects", { error: error.message });
    next(createError(500, "Internal server error"));
  }
};

/**
 * Create a new project.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 * @param {Object} User - Mongoose User model.
 */
export const createProject = async (req, res, next, Project, User) => {
  logger.info("Creating new project", { requestBody: req.body });

  const version = req.body?.version || 1;
  const projectSchema = getProjectSchemaForVersion(version);

  if (!projectSchema) {
    logger.warn("Invalid project version provided", { version });
    return next(createError(400, "Invalid version provided"));
  }

  const { error, value } = projectSchema.validate(req.body);
  if (error) {
    logger.warn("Validation error", { details: error.details });
    return next(createError(422, error.details[0].message));
  }

  try {
    const newProject = new Project(value);

    // Map assignees to tasks
    const tasks = (value.assignee || []).map((assignee, index) => ({
      title: value.title,
      description: value.description,
      notes: [{ creator: value.owner, note: "" }],
      assignee: [assignee],
      creator: value.owner,
      order: index + 1,
      stage: "To Do",
      index: index + 1,
      createdDate: new Date(),
      targetDate: value.targetDate,
      completionDate: null,
      updatedDate: new Date(),
      version: 1,
    }));

    newProject.task = tasks;

    // Save the project to the database
    const projectData = await newProject.save();
    logger.info("Project created successfully", { projectId: projectData._id });

    // Return dynamic response based on saved project
    const responseData = {
      title: projectData.title,
      description: projectData.description,
      assignee: projectData.assignee,
      branch: projectData.branch,
      owner: projectData.owner,
      notes: projectData.notes,
      tasks: projectData.task,
      targetDate: projectData.targetDate,
      _id: projectData._id,
    };

    res.status(201).send(responseData);
  } catch (e) {
    logger.error("Error while creating project", { error: e.message });

    if (e.code === 11000) {
      logger.warn("Duplication error", { error: e });
      return next(createError(422, "Title must be unique"));
    } else {
      return next(createError(500, "Internal server error"));
    }
  }
};

/**
 * Get project by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const getProjectById = async (req, res, next, Project) => {
  logger.info("Fetching project by ID", { projectId: req.params.id });
  const { id } = req.params;
  console.log(id);

  // Check if ID is provided
  if (!req.params.id) {
    logger.warn("Project ID not provided");
    return next(createError(422, "ID is required"));
  }

  try {
    // Fetch the project by ID from the database (Mongoose)
    const projectData = await Project.findById(req.params.id);
    if (!projectData) {
      logger.warn("Project not found", { projectId: req.params.id });
      return next(createError(404, "Project not found"));
    }

    // If project is found, send it as a response
    logger.info("Project retrieved successfully", { projectId: req.params.id });
    res.status(200).send(projectData);
  } catch (error) {
    // If an error occurs during the database operation, log and return the error
    logger.error("Error fetching project by ID", { error: error.message });
    next(createError(500, "Internal server error: " + error.message)); // Provide detailed error message
  }
};

/**
 * Update project by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const updateProjectById = async (req, res, next, Project) => {
  logger.info("Updating project", {
    projectId: req.params.id,
    updateData: req.body,
  });

  const version = req.body?.version || 1;
  const projectSchema = getProjectSchemaForVersion(version);

  if (!projectSchema) {
    logger.warn("Invalid project version provided", { version });
    return next(createError(400, "Invalid version provided"));
  }

  const { error, value } = projectSchema.validate(req.body);
  if (error) {
    logger.warn("Validation error", { details: error.details });
    return next(createError(422, error.details[0].message));
  }

  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      logger.warn("Project not found", { projectId: req.params.id });
      return next(createError(404, "Project not found"));
    }

    const currentAssignees = new Set(existingProject.assignee || []);
    const updatedAssignees = new Set(value.assignee || []);
    const newAssignees = [...updatedAssignees].filter(
      (assignee) => !currentAssignees.has(assignee)
    );
    const removedAssignees = [...currentAssignees].filter(
      (assignee) => !updatedAssignees.has(assignee)
    );

    const taskIndexOffset = (existingProject.task || []).length;
    const newTasks = newAssignees.map((assignee, index) => ({
      title: existingProject.title,
      description: existingProject.description,
      notes: [{ creator: value.owner, note: "" }],
      assignee: [assignee],
      creator: value.owner,
      order: taskIndexOffset + index + 1,
      stage: "To Do",
      index: taskIndexOffset + index + 1,
      createdDate: new Date(),
      targetDate: value.targetDate,
      updatedDate: new Date(),
      completionDate: null,
      version: 1,
    }));

    const updatedTasks = existingProject.task.filter(
      (task) => !removedAssignees.includes(task.assignee[0])
    );

    existingProject.assignee = value.assignee;
    existingProject.title = value.title;
    existingProject.description = value.description;
    existingProject.targetDate = value.targetDate;
    existingProject.branch = value.branch;
    existingProject.notes = value.notes;
    existingProject.task = [...updatedTasks, ...newTasks];

    const updatedProject = await existingProject.save();
    logger.info("Project updated successfully", { projectId: req.params.id });
    res.status(200).send(updatedProject);
  } catch (e) {
    logger.error("Error while updating project", { error: e.message });
    next(createError(500, "Internal server error"));
  }
};

/**
 * Delete project by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Object} Project - Mongoose Project model.
 */
export const deleteProjectById = async (req, res, next, Project) => {
  logger.info("Deleting project", { projectId: req.params.id });
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      logger.warn("Project not found", { projectId: req.params.id });
      return next(createError(404, "Project not found"));
    }
    const data = await Project.deleteOne({ _id: req.params.id });
    logger.info("Project deleted successfully", { projectId: req.params.id });
    res.status(200).send({ message: "Project deleted", deletedCount: data.deletedCount });
  } catch (error) {
    logger.error("Error while deleting project", { error: error.message });
    next(createError(500, "Internal server error"));
  }
};
