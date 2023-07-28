import React, { useState } from "react";
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

function Form() {
  const [tasks, setTasks] = useState([]);
  const [questions, setquestions] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [approval, setapproval] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setdate] = useState("");
  const [formError, setFormError] = useState(false);
  const [pointsError, setPointsError] = useState(false);

  const navigate = useNavigate();

  // Showing 2 new fields when for adding a task when "Add Task" button is clicked!
  const addTask = () => {
    const newTask = { title: "", points: "" };
    setTasks([...tasks, newTask]);
  };

  // For Adding a Question field, to be asked when "Add Question" button is clicked!
  const addQuestion = () => {
    const newQuestion = { question: "", answer: "" };
    setquestions([...questions, newQuestion]);
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

  const handleChangeQuestion = (index, value) => {
    const updatedQuestions = questions.map((question, i) => {
      if (i === index) {
        return { ...question, question: value };
      }
      return question;
    });
    setquestions(updatedQuestions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if any of the points fields have non-numeric input
    const hasNonNumericPoints = tasks.some((task) => isNaN(task.points));

    if (
      !name ||
      !date ||
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

    // Creating new assignment. Adding assignment into "assignments" collection when "Submit" button is clicked!. (could be done only by admin)
    const Assignment = {
      name,
      title,
      description,
      tasks,
      questions,
      approval,
      date: Date.parse(date),
    };
    // console.log(Assignment);
    axios
      .post("http://localhost:5000/addAssignments", Assignment, {
        withCredentials: true,
      })
      .then((res) => console.log(res.data));

    navigate("/");
  };

  // For Handling color change modes
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
            Create New Assignment
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
            <FormLabel>Expire Date</FormLabel>
            <Input
              type="datetime-local"
              value={date}
              required
              onChange={(event) => setdate(event.target.value)}
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
        <Flex>
          <Button onClick={addQuestion} marginBottom={2} mr={4}>
            Add Question
          </Button>
          <Button onClick={addTask} marginBottom={2}>
            Add Task
          </Button>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Button colorScheme="teal" width="80%" onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Form;
