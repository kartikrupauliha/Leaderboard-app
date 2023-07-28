const {
  Assignments,
  AddAssignments,
  ViewAssignment,
  RegisterAssignments,
  DoneTasks,
  Leaderboard,
  MyAssignments,
  MyTasks,
  DeleteAssignments,
  EditAssignments,
  getUser,
  AllRequests,
  RegisterRequests,
  ApproveRequest,
  MyRequests,
  AddApprovedAssignments,
  DeleteRequests,
  AllUsers,
  MyScores,
  AddAnswers,
  AssignmentUsers,
  Update,
  UpdateScore,
} = require("../Controllers/AssignmentsController");

const router = require("express").Router();
const Assignment = require("../models/assignment.model");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const { adminVerification } = require("../Middlewares/AdminMiddleware");

router.get("/assignments", Assignments); //Display all assignments on dashboard (landing) page
router.post("/registerAssignments", userVerification, RegisterAssignments); // Route for adding an Assignment into the "completedtasks" database when "Register" button is clicked!
router.post("/addApprovedAssignments", AddApprovedAssignments); // // Add assignments approved (registration request approved) by admin into the CompletedTask Collection
router.post("/registerRequests", userVerification, RegisterRequests); // Add assignmentid, userid and approved:false into Requests collection when Register button is clicked, and pending comes on it (wait for admin to approve it).
router.put("/doneTasks", userVerification, DoneTasks); // Adding "Done" tasks into the "Tasks" array of completedtask collection of that specific assignment
router.put("/addAnswers", userVerification, AddAnswers); // Adding answers given by users to the popup questions while registering into the completedtask collection of that specific assignment.
router.put("/approveRequest", adminVerification, ApproveRequest); // For updating Approved status to true when a particular assignment is being approved to true
router.post("/addAssignments", adminVerification, AddAssignments); // Creating new assignment. could be done only by admin
router.get("/assignments/:id", userVerification, ViewAssignment); // Fetching specific Assignment object for displaying the Assignment information such as different tasks etc on webpage
router.get("/assignments/:id/leaderboard", Leaderboard); // Display Leaderboard on the Leaderboard Page
router.get("/myAssignments", userVerification, MyAssignments); // For implementing register/registered functioanlity
router.get("/myRequests", userVerification, MyRequests); // Requests for registering made by user
router.get("/myScores", userVerification, MyScores); // For displaying scores on cards on dashboard (landing page)
router.get("/requests", AllRequests); // For displaying all requests on requests page (admin accessbile only)
router.get("/allUsers", userVerification, AllUsers); // For checking if a particular assignment is checked with user
router.get("/assignments/:id/myTasks", userVerification, MyTasks); // For done/notdone functionality

router.delete(
  "/assignments/deleteAssignment/:id",
  adminVerification,
  DeleteAssignments
); // Admin can delete assignment by clicking on top right corner delete(trash) icon.
router.delete("/requests/deleteRequest/:id", adminVerification, DeleteRequests); // Admin could delete requests of users who have requested to register for some particular assignment.
router.put(
  "/assignments/editAssignment/:id",
  adminVerification,
  EditAssignments
); // Admin can edit assignment by clicking on top right corner edit(pencil) icon

// Admin (service account) can view all the details of users and their answers who have registered for one particular assignment.
// This is only a backend route. it is not connected to UI.
// Can only be accessed by admin through postman.
router.get("/users/assignment/:id", adminVerification, AssignmentUsers);

// Admin (Service account) can update score of any assignment of any user given that the user has registered for that specific assignment.
// This is only a backend route, it is not connected to UI
// Can only be accessed by admin through postman
router.put(
  "/:userid/:assignmentid/updateScore",
  adminVerification,
  UpdateScore
);

// Admin (Service account) can update CompletedTasks collection with a task that is not displayed on the Assignment Page as "Done".
// This is only a backend route, it is not connected to UI.
// Can only be accessed by admin through postman.
router.put("/:userid/:assignmentid/:taskid/update", adminVerification, Update);

module.exports = router;
