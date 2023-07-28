import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import "./css/Dashboard.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, IconButton } from "@chakra-ui/react";
import { Spacer } from "@chakra-ui/react";
import { AiOutlineEdit, AiTwotoneDelete } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import AuthContext from "../context/AuthProvider";

export default function Dashboard() {
  const { auth, settoken, setAuth } = useContext(AuthContext);

  const [asignments, setAsignments] = useState();
  const [cookies, removeCookie] = useCookies([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [myRequests, setmyRequests] = useState([]);
  const [myScores, setmyScores] = useState([]);
  const [cookieStatus, setCookieStatus] = useState(false);
  const [registering, setregistering] = useState(false);
  const [checkApproval, setcheckApproval] = useState(false);
  const [assignment, setassignment] = useState({});
  const [questions, setquestions] = useState([]);

  // const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const date = new Date();
  const currTimestamp = Date.parse(date);

  //Display all assignments on dashboard (landing) page
  const fetchAllAssignmentsData = async () => {
    const allAssignments = await axios.get(
      "http://localhost:5000/assignments",
      {
        withCredentials: true,
      }
    );
    setAsignments(allAssignments);
  };
  useEffect(() => {
    getCookieStatus();
    fetchAllAssignmentsData();
    if (cookies && cookies.token !== "undefined") {
      settoken(cookies.token);
      setAuth({
        id: cookies.id,
        userEmail: cookies.userEmail,
        isAdmin: cookies.isAdmin,
      });
    }
    cookieStatus && getMyAssignmentsData();
    cookieStatus && getMyRequestsData();
    cookieStatus && getMyScoresData();
  }, [navigate, registering, cookieStatus, checkApproval]);

  // console.log(cookies)

  async function getCookieStatus() {
    if (cookies.token !== "undefined") {
      await setCookieStatus(true);
    }
  }

  // For implementing register/registered functioanlity
  async function getMyAssignmentsData() {
    const myAssignmentsData = await axios.get(
      "http://localhost:5000/myAssignments",
      { withCredentials: true }
    );
    setMyAssignments(myAssignmentsData.data);
    // console.log(myAssignmentsData.data);
  }

  // Requests for registering made by user
  async function getMyRequestsData() {
    const myRequestsData = await axios.get("http://localhost:5000/myRequests", {
      withCredentials: true,
    });
    setmyRequests(myRequestsData.data);
  }

  // For displaying scores on cards on dashboard (landing page)
  async function getMyScoresData() {
    const myScoresData = await axios.get("http://localhost:5000/myScores", {
      withCredentials: true,
    });
    setmyScores(myScoresData.data);
  }

  // Adding answers given by users to the popup questions while registering into the completedtask collection of that specific assignment.
  async function addAnswers(assignment) {
    const obj = { id: assignment._id, arr: questions };
    console.log(obj);
    try {
      const response = await axios.put(
        "http://localhost:5000/addAnswers",
        { obj: obj },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Route for adding an Assignment into the "completedtasks" database when "Register" button is clicked!
  async function handleClick(assignment) {
    setregistering(true);
    onClose();
    try {
      const response = await axios.post(
        "http://localhost:5000/registerAssignments",
        { obj: assignment },
        { withCredentials: true }
      );
      console.log(response);
      addAnswers(assignment);
      // window.location.reload();
      setregistering(false);
    } catch (err) {
      console.log(err);
      setregistering(false);
    }
  }

  // Redireting to EditForm page when "Edit" icon is clicked!
  const routeChange = (assignment) => {
    const path = `/assignments/editAssignment/${assignment._id}`;
    navigate(path);
  };

  // Redirctin to Leaderboard page when "View Leaderboard" button is clicked!
  const LeaderboardRoute = (assignment) => {
    const path = `/assignments/${assignment._id}/leaderboard`;
    navigate(path);
  };

  // Admin can delete assignment by clicking on top right corner delete(trash) icon.
  async function clickDelete(assignment) {
    try {
      const deleteReq = await axios.delete(
        `http://localhost:5000/assignments/deleteAssignment/${assignment._id}`,
        { withCredentials: true }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  // Add assignmentid, userid and approved:false into Requests collection when Register button is clicked, and pending comes on it (wait for admin to approve it).
  const requestApproval = async (assignment) => {
    setcheckApproval(true);
    onClose();
    try {
      const response = await axios.post(
        "http://localhost:5000/registerRequests",
        { obj: assignment },
        { withCredentials: true }
      );
      console.log(response);
      setcheckApproval(false);
    } catch (err) {
      console.log(err);
      setcheckApproval(false);
    }
  };

  const handleChangeAnswer = (index, value) => {
    const updatedAnswers = questions.map((question, i) => {
      if (i === index) {
        return { ...question, answer: value };
      }
      return question;
    });
    setquestions(updatedAnswers);
  };

  // To Check if user is logged in
  var regexPattern = new RegExp("true");
  var boolValue1 = regexPattern.test(auth?.isAdmin);

  return (
    <Flex flexWrap="wrap" justifyContent="center">
      {asignments &&
        asignments?.data.map((assignment, index) => (
          <Box key={index} width="55%" padding={2}>
            <Box
              margin={10}
              width="100%"
              height="30vh"
              borderRadius="md"
              boxShadow="lg"
              border="1px"
              p={4}
              bg="pale"
              md={3}
            >
              <Flex direction="column" height="100%">
                <Box>
                  <Flex>
                    <Box>
                      {cookieStatus ? (
                        <Flex gap={8}>
                          <Link to={`/assignments/${assignment._id}`}>
                            <strong>{assignment.name}</strong>
                          </Link>
                          <Box color={"gray.500"}>
                            <strong>
                              Tasks -{" "}
                              {myAssignments.length !== 0 &&
                              Array.isArray(myAssignments) &&
                              myAssignments.find(
                                (item) => item.assignmentId === assignment._id
                              ) !== undefined
                                ? `${
                                    Array.isArray(myAssignments) &&
                                    myAssignments.find(
                                      (item) =>
                                        item.assignmentId === assignment._id
                                    ).Tasks.length
                                  }/${assignment.tasks.length}`
                                : "NA"}
                            </strong>
                          </Box>
                          <Box color={"gray.500"}>
                            <strong>
                              Scores -{" "}
                              {myScores.length !== 0 &&
                              Array.isArray(myScores) &&
                              myScores.find(
                                (item) => item.assignmentId === assignment._id
                              ) !== undefined
                                ? Array.isArray(myScores) &&
                                  myScores.find(
                                    (item) =>
                                      item.assignmentId === assignment._id
                                  ).score
                                : "NA"}
                            </strong>
                          </Box>
                        </Flex>
                      ) : (
                        <>
                          <strong>{assignment.name}</strong>
                        </>
                      )}
                    </Box>
                    <Spacer />
                    <Box>
                      {boolValue1 && (
                        <>
                          <IconButton
                            icon={<AiOutlineEdit />}
                            size="sm"
                            colorScheme="blue"
                            aria-label="Favorite"
                            alignSelf="flex-end"
                            marginRight={1}
                            marginBottom={1}
                            onClick={() => {
                              routeChange(assignment);
                            }}
                          />
                          <IconButton
                            icon={<AiTwotoneDelete />}
                            size="sm"
                            colorScheme="blue"
                            aria-label="Share"
                            alignSelf="flex-end"
                            marginRight={1}
                            marginBottom={1}
                            onClick={() => {
                              clickDelete(assignment);
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </Flex>
                  <Box mt={6}>{assignment.title}</Box>
                </Box>
                <Flex alignItems="center">
                  <Box mt={14}>
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is not expired /
                        approved by admin /
                        and registerd by user */}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      assignment.approval &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) !== undefined && (
                        <Button colorScheme="teal" size="sm" mt={4}>
                          Registered
                        </Button>
                      )}
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is not expired /
                        approved by admin /
                        but user has not registerd after the approval */}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      assignment.approval &&
                      assignment.questions.length !== 0 &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) === undefined &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ) !== undefined &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ).approved === true && (
                        <Button
                          colorScheme="red"
                          size="sm"
                          mt={4}
                          onClick={() => {
                            onOpen();
                            setassignment(assignment);
                            setquestions(assignment.questions);
                          }}
                        >
                          Approved - Register Now!
                        </Button>
                      )}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      assignment.approval &&
                      assignment.questions.length === 0 &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) === undefined &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ) !== undefined &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ).approved === true && (
                        <Button
                          colorScheme="red"
                          size="sm"
                          mt={4}
                          onClick={() => {
                            handleClick(assignment);
                          }}
                        >
                          Approved - Register Now!
                        </Button>
                      )}
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is not expired /
                        not approved by admin /
                        and user asked for the approval i.e the pending state */}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      assignment.approval &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) === undefined &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ) !== undefined &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ).approved === false && (
                        <Button colorScheme="yellow" size="sm" mt={4}>
                          Pending
                        </Button>
                      )}
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is not expired /
                        and user didnt asked for the approval yet*/}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      assignment.approval &&
                      Array.isArray(myRequests) &&
                      myRequests.find(
                        (item) => item.assignmentId === assignment._id
                      ) === undefined && (
                        <Button
                          colorScheme="teal"
                          size="sm"
                          mt={4}
                          onClick={() => requestApproval(assignment)}
                        >
                          Register
                        </Button>
                      )}
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is not expired /
                        dosent need admin approval
                        and user didnt registerd yet*/}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      !assignment.approval &&
                      assignment.questions.length !== 0 &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) === undefined && (
                        <Button
                          onClick={() => {
                            onOpen();
                            setassignment(assignment);
                            setquestions(assignment.questions);
                          }}
                          colorScheme="teal"
                          size="sm"
                          mt={4}
                        >
                          Register
                        </Button>
                      )}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      !assignment.approval &&
                      assignment.questions.length === 0 &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) === undefined && (
                        <Button
                          onClick={() => {
                            handleClick(assignment);
                          }}
                          colorScheme="teal"
                          size="sm"
                          mt={4}
                        >
                          Register
                        </Button>
                      )}
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is not expired /
                        dosent need admin approval
                        and user registerd*/}
                    {cookieStatus &&
                      assignment.date > currTimestamp &&
                      !assignment.approval &&
                      Array.isArray(myAssignments) &&
                      myAssignments.find(
                        (item) => item.assignmentId === assignment._id
                      ) !== undefined && (
                        <Button colorScheme="teal" size="sm" mt={4}>
                          Registered
                        </Button>
                      )}
                    {/* this is the register button which is shown when
                        user is loged in /
                        assignment is expired*/}
                    {cookieStatus && assignment.date < currTimestamp && (
                      <Button
                        textColor={"gray.200"}
                        size="sm"
                        backgroundColor={"gray.500"}
                        mt={4}
                      >
                        Expired
                      </Button>
                    )}
                    {/* this is the register button which is shown when
                        user is not loged in */}
                    {!cookieStatus && (
                      <Button
                        onClick={() => navigate("/login")}
                        colorScheme="teal"
                        size="sm"
                        mt={4}
                      >
                        {assignment.date < currTimestamp
                          ? "Expired"
                          : "Register"}
                      </Button>
                    )}
                  </Box>
                  <Spacer />
                  <Box mt={14}>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      mt={4}
                      mx={2}
                      onClick={() => {
                        LeaderboardRoute(assignment);
                      }}
                    >
                      View Leaderboard
                    </Button>
                  </Box>

                  <Box mt={14}>
                    <Popover>
                      <PopoverTrigger>
                        <Button colorScheme="green" size="sm" mt={4}>
                          Description
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Description!</PopoverHeader>
                        <PopoverBody>{assignment.description}</PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Box>
        ))}

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {questions.map((question, i) => (
              <Box key={i} marginBottom={4}>
                <FormControl marginRight={4}>
                  <FormLabel>
                    {i + 1}: {question.question}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Write Answer"
                    required
                    value={question.answer}
                    onChange={(event) =>
                      handleChangeAnswer(i, event.target.value)
                    }
                  />
                </FormControl>
              </Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              colorScheme="teal"
              mr={4}
              onClick={() => {
                handleClick(assignment);
              }}
            >
              Register
            </Button>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
