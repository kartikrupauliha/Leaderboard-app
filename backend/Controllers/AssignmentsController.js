let Assignment = require("../models/assignment.model");
const User = require("../models/user.model");
const CompletedTask = require("../models/completedTasks.model");
const Requests = require("../models/requests.model");
const alert = require("alert");

const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

// Fetching all the Assignment objects from "assignments" collection in database
exports.Assignments = async (req, res) => {
  await Assignment.find()
    .then((assignments) => {
      res.json(assignments);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

// Creating new Assignment object and adding it into the "assignments" collection in database
exports.AddAssignments = (req, res) => {
  const { name, title, description, tasks, approval, date, questions } =
    req.body;
  const assignment = new Assignment({
    name,
    title,
    description,
    tasks,
    approval,
    date,
    questions,
  });

  assignment
    .save()
    .then(() => res.json("Assignment added!"))
    .catch((err) => res.status(400).json("Error: " + err));
};

// Fetching specific Assignment object for displaying the Assignment information such as different tasks etc on webpage
exports.ViewAssignment = async (req, res) => {
  await Assignment.findById(req.params.id)
    .then((assignment) => res.json(assignment))
    .catch((err) =>
      res.status(404).json({ noassignmentfound: "No Assignment Found!" })
    );
};

// Route for adding a specific task into the Tasks array of that particular assignment into database when "Not Done" button is clicked!
exports.DoneTasks = async (req, res) => {
  const taskId = req.body.obj._id;
  const points = req.body.obj.points;
  const assignmentId = req.body.id;
  const uId = req.body.user._id;
  const userId = uId.valueOf();

  const existingAssignment = await CompletedTask.findOne({
    userId,
    assignmentId,
  });

  let flag = new Boolean(false);
  if (existingAssignment) {
    for (let i = 0; i < existingAssignment.Tasks.length; i++) {
      if (existingAssignment.Tasks[i].taskId == taskId) {
        flag = true;
      }
    }
  } else {
    alert("You must register in this assignment first!");
  }

  if (flag == true) {
    alert("You have already registered for this task!");
    return res.json({
      message: "This task is already present!",
    });
  } else {
    const query = { assignmentId: assignmentId, userId: uId };
    const update = {
      $push: { Tasks: { taskId: taskId, points: points } },
      $inc: { totalScore: points }, // Increment totalScore by points on each iteration
    };

    try {
      const response = await CompletedTask.updateOne(query, update);
      res.status(200).json({
        message: "Successfully updated",
      });
    } catch (err) {
      console.error(err);
      res.status(502).json({
        message: "Error",
      });
    }
  }
};

// approve a user's Register request on a specific assignment. Approval and deletion of requests can only be done by admin.
exports.ApproveRequest = async (req, res) => {
  const assignmentId = req.body.obj.assignmentId;
  const uId = req.body.obj.userId;
  const userId = uId.valueOf();

  const existingRequest = await Requests.findOne({
    userId,
    assignmentId,
  });

  const query = { assignmentId: assignmentId, userId: uId };
  const update = { $set: { approved: true } };

  if (existingRequest) {
    try {
      const response = await Requests.updateOne(query, update);
      res.status(200).json({
        message: "Successfully updated",
      });
    } catch (err) {
      console.error(err);
      res.status(502).json({
        message: "Error",
      });
    }
  } else {
    res.status(400).json({
      message: "no request found",
    });
  }
};

// Sending update(put) request to add the answer received on the popup when he clicks "Register" button of any assignment and that assignment requires a question
exports.AddAnswers = async (req, res) => {
  const assignmentId = req.body.obj.id;
  const uId = req.body.user._id;
  const userId = uId.valueOf();
  const docs = req.body.obj.arr;

  const existingObject = await CompletedTask.findOne({
    userId,
    assignmentId,
  });

  const query = { assignmentId: assignmentId, userId: uId };
  const update = { $push: { Questions: docs } };

  if (existingObject) {
    try {
      const response = await CompletedTask.updateOne(query, update);
      res.status(200).json({
        message: "Successfully updated",
      });
    } catch (err) {
      console.error(err);
      res.status(502).json({
        message: "Error",
      });
    }
  } else {
    res.status(400).json({
      message: "no request found",
    });
  }
};

// Route for adding an Assignment into the "completedtasks" database when "Register" button is clicked!
exports.RegisterAssignments = async (req, res) => {
  console.log("This is that:");
  const uId = req.body.user._id;
  const assignmentId = req.body.obj._id;
  const userId = uId.valueOf();

  const existingAssignment = await CompletedTask.findOne({
    userId,
    assignmentId,
  });
  if (existingAssignment) {
    return res.json({
      message: "This user has already registered for this assignment!!",
    });
  } else {
    const registered = new CompletedTask({ userId, assignmentId });

    registered
      .save()
      .then(() => res.json("Assignment Registered!!"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
};

// Add assignments approved (registration request approved) by admin into the CompletedTask Collection
exports.AddApprovedAssignments = async (req, res) => {
  const uId = req.body.obj.userId;
  const assignmentId = req.body.obj.assignmentId;
  const userId = uId.valueOf();

  const existingAssignment = await CompletedTask.findOne({
    userId,
    assignmentId,
  });
  if (existingAssignment) {
    return res.json({
      message: "This user has already registered for this assignment!!",
    });
  } else {
    const registered = new CompletedTask({ userId, assignmentId });

    registered
      .save()
      .then(() => res.json("Assignment Registered!!"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
};

// This is for the posting the requests.
exports.RegisterRequests = async (req, res) => {
  console.log("Request Registered:");
  const uId = req.body.user._id;
  const assignmentId = req.body.obj._id;
  const userId = uId.valueOf();

  const existingRequest = await Requests.findOne({
    userId,
    assignmentId,
  });
  if (existingRequest) {
    return res.json({
      message: "Already Registerd the request!!",
    });
  } else {
    const registered = new Requests({ userId, assignmentId, approved: false });

    registered
      .save()
      .then(() => res.json("Request Registered!!"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
};

// "Backend logic route for displaying the users info along with their scores onto the Assignment Leaderboard page"
exports.Leaderboard = async (req, res) => {
  // console.log("This is leaderboard backend route!!");
  const assignmentId = req.params.id;

  const assignment = await CompletedTask.find({ assignmentId });
  // console.log(assignment);

  let emailScoreArray = [];
  let emailScoreObject = {};

  // let score = 0;
  for (let i = 0; i < assignment.length; i++) {
    // for (let j = 0; j < assignment[i].Tasks.length; j++) {
    //   score = score + assignment[i].Tasks[j].points;
    // }
    const userIdForName = assignment[i].userId;
    const retrieveName = await User.find({ _id: userIdForName });
    let emailCurrentUser = retrieveName[0].email;
    let scoreCurrentUser = assignment[i].totalScore;

    emailScoreObject.email = `${emailCurrentUser}`;
    emailScoreObject.score = scoreCurrentUser;

    emailScoreArray.push(emailScoreObject);

    emailScoreObject = {};
  }
  res.json(emailScoreArray);
};

// To display the scores on Dashboard (Landing Page) on the card.
exports.MyScores = async (req, res) => {
  const userId = req.body.user._id.valueOf();
  const assignment = await CompletedTask.find({ userId });
  let assignmentScoreArray = [];
  let assignmentScoreObject = {};

  // let score = 0;
  for (let i = 0; i < assignment.length; i++) {
    // for (let j = 0; j < assignment[i].Tasks.length; j++) {
    //   score = score + assignment[i].Tasks[j].points;
    // }
    const assignmentIdCurrentUser = assignment[i].assignmentId;
    let scoreCurrentUser = assignment[i].totalScore;

    assignmentScoreObject.assignmentId = assignmentIdCurrentUser;
    assignmentScoreObject.score = scoreCurrentUser;
    // Pushing the object to array
    assignmentScoreArray.push(assignmentScoreObject);

    assignmentScoreObject = {};
    // score = 0;
  }
  res.json(assignmentScoreArray);
};

// Calling this route to implement the functionality of the "Register/Registered!" button on Dashboard page
exports.MyAssignments = async (req, res) => {
  const userId = req.body.user._id.valueOf();
  const findAllAssignmentsByUser = await CompletedTask.find({ userId });
  res.json(findAllAssignmentsByUser);

  // const response = {
  //   data: findAllAssignmentsByUser,
  //   user: req.body.user,
  // };
  // console.log(response);
};
exports.MyRequests = async (req, res) => {
  const userId = req.body.user._id.valueOf();
  const findAllRequestsByUser = await Requests.find({ userId });
  res.json(findAllRequestsByUser);
};

exports.AllRequests = async (req, res) => {
  await Requests.find()
    .then((requests) => {
      res.json(requests);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};
exports.AllUsers = async (req, res) => {
  await User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

// Calling this route to implement the functionality of "Done/Undone" button on AssignmentPage
exports.MyTasks = async (req, res) => {
  const userId = req.body.user._id.valueOf();
  // console.log(userId);
  const assignmentId = req.params.id;
  // console.log(assignmentId);
  const findAllTasksByUser = await CompletedTask.find({ userId, assignmentId });
  if (findAllTasksByUser.length === 0) {
    console.log(".");
    // alert("You must Register into this assignment first!");
  } else {
    // console.log(findAllTasksByUser);
    res.json(findAllTasksByUser);
  }
};

// Deleting Assignments from Dashboard page by clicking on the Trash can icon
// Need to delete data firstly from CompletedTasks collection, and then from Assignments collection.
exports.DeleteAssignments = async (req, res) => {
  const assignmentId = req.params.id;
  // console.log(req.body);
  const deleteFromcompletedtasksCollection = await CompletedTask.deleteMany({
    assignmentId: `${assignmentId}`,
  });

  const deleteFromassignmentsCollection = await Assignment.findByIdAndDelete({
    _id: req.params.id,
  });

  if (deleteFromcompletedtasksCollection) {
    alert("Assignment Deleted Successfully!!");
    return res.json({
      message:
        "Assignment Successfully Deleted from completed tasks collection!",
    });
  } else {
    return res.json({ message: "Not Deleted from tasks collection!" });
  }
};

// Deleting Register requests
exports.DeleteRequests = async (req, res) => {
  const requesttId = req.params.id;
  // console.log(req.body);
  const deleteFromRequestsCollection = await Requests.deleteMany({
    _id: `${requesttId}`,
  });

  if (deleteFromRequestsCollection) {
    alert("Request Deleted Successfully!!");
    return res.json({
      message: "Request Successfully Deleted from Requests collection!",
    });
  } else {
    return res.json({ message: "Not Deleted from Requests collection!" });
  }
};

// Editing Assignments displayed on Dashboard
exports.EditAssignments = async (req, res) => {
  const assignmentId = req.params.id;
  const { name, title, description, tasks, approval, questions } = req.body;

  Assignment.findByIdAndUpdate(
    assignmentId,
    { name, title, description, tasks, approval, questions },
    { new: true }
  )
    .then((assignment) => {
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.json({ message: "Assignment updated", assignment });
    })
    .catch((err) => res.status(400).json({ error: err.message }));
};

// View each and every details of all users who have registered for a specific assignment.
// Only backend route
exports.AssignmentUsers = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const completedTasks = await CompletedTask.find({ assignmentId });

    const result = [];

    for (const task of completedTasks) {
      const user = await User.findById(task.userId);

      const allUserInfo = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        completedTask: {
          _id: task._id,
          assignmentId: task.assignmentId,
          Tasks: task.Tasks,
          Questions: task.Questions,
        },
      };

      result.push(allUserInfo);
    }
    res.json(result);
  } catch (error) {
    console.error(
      "Error fetching completed tasks with user information:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// UpdateScore of any users, any assignment.
// Just a backend route, which could be done by only admin (service account)
exports.Update = async (req, res) => {
  const userId = req.params.userid;
  const assignmentId = req.params.assignmentid;
  const taskId = req.params.taskid;
  // console.log(assignmentId);
  // res.json("HEllo");

  try {
    const retrieveTaskAssignment = await Assignment.findById(assignmentId);
    if (!retrieveTaskAssignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    // Find the specific task object in the assignment's tasks array
    const retrieveTaskObject = retrieveTaskAssignment.tasks.find(
      (task) => task._id.toString() === taskId
    );
    if (!retrieveTaskObject) {
      return res
        .status(404)
        .json({ error: "Task not found in the assignment." });
    }

    const newTaskObject = {
      taskId: taskId,
      points: retrieveTaskObject.points,
    };
    // console.log(newTaskObject);

    // Find the user in the User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const completedTaskObject = await CompletedTask.findOne({
      userId: userId,
      assignmentId: assignmentId,
    });
    if (!completedTaskObject) {
      return res.status(404).json({
        error:
          " User, Assignment mapped object in CompletedTasks Collection not found!",
      });
    }

    const existingTaskIndex = completedTaskObject.Tasks.findIndex(
      (task) => task.taskId === taskId
    );

    if (existingTaskIndex !== -1) {
      completedTaskObject.Tasks[existingTaskIndex] = newTaskObject;
    } else {
      completedTaskObject.Tasks.push(newTaskObject);
    }

    completedTaskObject.totalScore = completedTaskObject.Tasks.reduce(
      (sum, task) => sum + task.points,
      0
    );

    await completedTaskObject.save();
    return res
      .status(200)
      .json({ message: "Task added to completed tasks successfully." });
  } catch (error) {
    console.error("Error adding completed task:", error);
    return res.status(500).json({ error: "Internal server error." });
  }

  // console.log(completedTaskObject);
  // res.json("Response is here!");
};

exports.UpdateScore = async (req, res) => {
  const userId = req.params.userid;
  const assignmentId = req.params.assignmentid;
  const totalScore = req.body.totalScore;

  const query = { assignmentId: assignmentId, userId: userId };
  const update = { totalScore: totalScore };
  try {
    const response = await CompletedTask.updateOne(query, update);
    res.status(200).json({
      message: "Successfully updated",
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({
      message: "Error",
    });
  }
};
