import axios from "axios";
import React, { useEffect, useState } from "react";
import "./css/RequestsPage.css";

const Requests = () => {
  const [reqArr, setreqArr] = useState([]);
  const [sendingApproval, setsendingApproval] = useState(false);
  const [deletingRequest, setdeletingRequest] = useState(false);
  const [assignments, setassignments] = useState([]);
  const [users, setusers] = useState([]);

  // For displaying all requests on requests page (admin accessbile only)
  const fetchAllRequests = async () => {
    const allRequests = await axios.get("http://localhost:5000/requests", {
      withCredentials: true,
    });
    setreqArr(allRequests.data);
    console.log(allRequests.data);
  };

  // For checking if a particular assignment is checked with user
  const fetchAllUsers = async () => {
    const allUsers = await axios.get("http://localhost:5000/allUsers", {
      withCredentials: true,
    });
    setusers(allUsers.data);
  };

  const fetchAllAssignmentsData = async () => {
    const allAssignments = await axios.get(
      "http://localhost:5000/assignments",
      {
        withCredentials: true,
      }
    );
    setassignments(allAssignments.data);
  };

  useEffect(() => {
    fetchAllRequests();
    fetchAllAssignmentsData();
    fetchAllUsers();
  }, [sendingApproval, deletingRequest]);

  // For updating Approved status to true when a particular assignment is being approved to true
  const sendApproveRequest = async (data) => {
    // addApprovedAssignment(data);
    setsendingApproval(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/approveRequest",
        { obj: data },
        { withCredentials: true }
      );
      console.log(response);
      setsendingApproval(false);
    } catch (err) {
      console.log(err);
      setsendingApproval(false);
    }
  };

  // Add assignments approved (registration request approved) by admin into the CompletedTask Collection
  const addApprovedAssignment = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/addApprovedAssignments",
        { obj: data },
        { withCredentials: true }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  // Admin could delete requests of users who have requested to register for some particular assignment.
  const deleteRequest = async (data) => {
    setdeletingRequest(true);
    try {
      const deleteReq = await axios.delete(
        `http://localhost:5000/requests/deleteRequest/${data._id}`,
        { withCredentials: true }
      );
      console.log(deleteReq);
      setdeletingRequest(false);
    } catch (err) {
      console.log(err);
      setdeletingRequest(false);
    }
  };

  return (
    <div className="main">
      <div className="middle">
        <div className="row header">
          <div className="title">Name of User</div>
          <div className="title">Email of User</div>
          <div className="title">Assignment Name</div>
          <div className="title">Action</div>
        </div>
        {reqArr.length !== 0 &&
          reqArr.map((data) => (
            <div className="row" key={data._id}>
              {users.find((item) => item._id === data.userId) !== undefined && (
                <div className="center">
                  {users.length !== 0 &&
                    users.find((item) => item._id === data.userId).name}
                </div>
              )}
              {users.find((item) => item._id === data.userId) !== undefined && (
                <div className="center">
                  {users.length !== 0 &&
                    users.find((item) => item._id === data.userId).email}
                </div>
              )}
              {assignments.find((item) => item._id === data.assignmentId) !==
              undefined ? (
                <div className="center">
                  {assignments.length !== 0 &&
                    assignments.find((item) => item._id === data.assignmentId)
                      .name}
                </div>
              ) : (
                <div>Assignment Deleted</div>
              )}

              {!data.approved && (
                <div className="">
                  <button
                    className="button"
                    onClick={() => sendApproveRequest(data)}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => deleteRequest(data)}
                    className="button"
                  >
                    Delete
                  </button>
                </div>
              )}
              {data.approved && <button>Approved</button>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Requests;
