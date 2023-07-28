import React from "react";

import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const AssignmentPage = () => {
  const [assignment, setAssignment] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [myTasks, setMyTasks] = useState([]);

  const [status, setStatus] = useState("");

  const [completing, setcompleting] = useState(false);

  let { id } = useParams();
  const navigate = useNavigate();

  // Fetching specific Assignment object for displaying the Assignment information such as different tasks etc on webpage
  useEffect(() => {
    const fetchdata = async () => {
      await axios
        .get(`http://localhost:5000/assignments/${id}`, {
          withCredentials: true,
          obj: { id },
        })
        .then((res) => {
          setAssignment(res.data.tasks);
          setAssignmentName(res.data);
          // console.log(res.data.tasks);
          // console.log("Here!");
        })
        .catch((err) => {
          console.log(err);
          console.log("Error from show assignments");
        });
    };
    fetchdata();
    getMyTasksData();
  }, [id, completing]);

  // Redirect to Leaderboard Page when "View Leaderboard" button is clicked!
  const routeChange = () => {
    const path = `/assignments/${id}/leaderboard`;
    navigate(path);
  };

  // For implementing done/notdone functionality of different Tasks of a specific assignment!
  async function getMyTasksData() {
    const myTasksData = await axios.get(
      `http://localhost:5000/assignments/${id}/myTasks`,
      {
        withCredentials: true,
        obj: { id },
      }
    );
    setMyTasks(myTasksData.data[0].Tasks);
  }

  // Adding "Done" tasks into the "Tasks" array of completedtask collection of that specific assignment
  async function handleClick(task) {
    setcompleting(true);
    // setButtonText("Done!!!");
    try {
      const response = await axios.put(
        "http://localhost:5000/doneTasks",
        { obj: task, id },
        { withCredentials: true }
      );
      // console.log(response);
      // window.location.reload();
      setcompleting(false);
    } catch (err) {
      console.log(err);
      setcompleting(false);
    }
  }

  return (
    <Box p={4}>
      <Text as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
        {assignmentName.title}
      </Text>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Button onClick={routeChange} size="sm">
          View Leaderboard
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th width="10%">Status</Th>
            <Th width="60%" textAlign="center">
              Title
            </Th>
            <Th width="20%">Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {assignment &&
            assignment.map((task, index) => (
              <Tr key={index}>
                <Td width="10%">
                  <Button
                    onClick={() => {
                      handleClick(task);
                    }}
                    colorScheme="teal"
                    size="sm"
                  >
                    {myTasks.find((item) => item.taskId == task._id) ==
                    undefined
                      ? "Not Done"
                      : "Done"}
                  </Button>
                </Td>
                <Td width="60%" textAlign="center">
                  {task.title}
                </Td>
                <Td width="20%">{task.points}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AssignmentPage;
