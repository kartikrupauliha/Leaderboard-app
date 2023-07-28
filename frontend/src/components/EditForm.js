import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function EditForm({ assignmentId }) {
  const [tasks, setTasks] = useState([]);
  const [questions, setquestions] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [approval, setapproval] = useState(false);
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState(false);

  let { id } = useParams();
  const navigate = useNavigate();

  // Fetching specific Assignment object for displaying the Assignment information such as different tasks etc on webpage
  useEffect(() => {
    axios
      .get(`http://localhost:5000/assignments/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const assignment = res.data;
        console.log(res.data);
        setName(assignment.name);
        setTitle(assignment.title);
        setapproval(assignment.approval);
        setDescription(assignment.description);
        setTasks(assignment.tasks);
        setquestions(assignment.questions);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const addTask = () => {
    const newTask = { title: "", points: "" };
    setTasks([...tasks, newTask]);
  };

  const addQuestion = () => {
    const newQuestion = { question: "", answer: "" };
    setquestions([...questions, newQuestion]);
  };

  const handleChangeQuestion = (index, value) => {
    const updatedQuestions = questions.map((question, i) => {
      if (i === index) {
        return { ...question, question: value };
      }
      return question;
    });
    setquestions(updatedQuestions);
  };

  const handleChangeTask = (index, field, value) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, [field]: value };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const hasNonNumericPoints = tasks.some((task) => isNaN(task.points));

    if (
      !name ||
      !title ||
      !description ||
      tasks.some((task) => !task.title || !task.points) ||
      questions.some((question) => !question.question)
    ) {
      setFormError(true);
      return;
    }
    if (hasNonNumericPoints) {
      setFormError(true);
      return;
    }

    console.log("Form submitted!");
    const updatedAssignment = {
      name,
      title,
      description,
      tasks,
      approval,
      questions,
    };
    const config = {
      withCredentials: true, // Include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Sending update (put) request to edit the assignment info. Admin can edit assignment by clicking on top right corner edit(pencil) icon
    axios
      .put(
        `http://localhost:5000/assignments/editAssignment/${id}`,
        updatedAssignment,
        config
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    navigate("/");
    // window.location.href = "/assignments";
  };

  const formBgColor = useColorModeValue("gray.100", "gray.700");
  const headingBgGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.500)",
    "linear(to-r, teal.500, purple.500)"
  );

  return (
    <Flex justifyContent="center" marginTop={12} height="60vh">
      <Box width="400px" p={4} bg={formBgColor} borderRadius="md">
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          marginBottom={4}
        >
          <Box
            as="h1"
            fontSize="xl"
            fontWeight="bold"
            bgGradient={headingBgGradient}
            bgClip="text"
            textAlign="center"
            marginBottom={4}
          >
            Edit Assignment
          </Box>
        </Flex>
        <Box height="300px" overflowY="auto">
          {formError && (
            <Alert status="error" marginBottom={4}>
              <AlertIcon />
              Some fields are Empty or Task Points are not numeric!!
            </Alert>
          )}
          <FormControl marginBottom={4}>
            <FormLabel>Assignment Name</FormLabel>
            <Input
              type="text"
              value={name}
              placeholder="Assignment Name"
              required
              onChange={(event) => setName(event.target.value)}
            />
          </FormControl>
          <FormControl
            display={"flex"}
            justifyContent={"space-between"}
            marginBottom={4}
          >
            <FormLabel>Approval Needed</FormLabel>
            <input
              type="checkbox"
              checked={approval}
              onChange={() => setapproval(!approval)}
            />
          </FormControl>
          <FormControl marginBottom={4}>
            <FormLabel>Assignment Title</FormLabel>
            <Input
              type="text"
              value={title}
              placeholder="Assignment Title"
              required
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>
          <FormControl marginBottom={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </FormControl>
          {tasks.map((task, i) => (
            <Flex key={i} marginBottom={4}>
              <FormControl marginRight={4}>
                <FormLabel>Task Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Task Title"
                  required
                  value={task.title}
                  onChange={(event) =>
                    handleChangeTask(i, "title", event.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Points</FormLabel>
                <Input
                  type="text"
                  value={task.points}
                  placeholder="points"
                  required
                  onChange={(event) =>
                    handleChangeTask(i, "points", event.target.value)
                  }
                />
              </FormControl>
            </Flex>
          ))}
          {questions.map((question, i) => (
            <Flex key={i} marginBottom={4}>
              <FormControl marginRight={4}>
                <FormLabel>Question : {i + 1}</FormLabel>
                <Input
                  type="text"
                  placeholder="Write Question"
                  required
                  value={question.question}
                  onChange={(event) =>
                    handleChangeQuestion(i, event.target.value)
                  }
                />
              </FormControl>
            </Flex>
          ))}
        </Box>
        <Button onClick={addQuestion} marginBottom={2} mr={4}>
          Add Question
        </Button>
        <Button onClick={addTask} marginBottom={2}>
          Add Task
        </Button>
        <Flex justifyContent="center" alignItems="center">
          <Button colorScheme="teal" width="80%" onClick={handleSubmit}>
            Update
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default EditForm;
