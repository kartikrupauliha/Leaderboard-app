import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Alert, AlertIcon } from "@chakra-ui/react";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import AuthContext from "../context/AuthProvider";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();

  const { setAuth, auth, settoken, token } = useContext(AuthContext);

  const [cookies, removeCookie] = useCookies([]);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const [loginError, setLoginError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message, userName, userEmail, isAdmin } = res.data;
      setAuth({ success, message, userName, userEmail, isAdmin });
      settoken(res.data.token);
      if (res.data && res.data.success) {
        handleSuccess(res.data.message);
        setTimeout(() => navigate("/"), 1500);
        // navigate("/assignments");
      } else {
        handleError(res.data.message);
        setLoginError(true);
      }
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  // console.log(typeof cookies.token);
  // useEffect(() => {
  //   if(cookies && cookies.token!== "undefined"){
  //     settoken(cookies.token);
  //     setAuth({ id:cookies.id, userEmail:cookies.userEmail, isAdmin:cookies.isAdmin });
  //     navigate("/");
  //   }
  // });

  const formBgGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.500)",
    "linear(to-r, teal.500, purple.500)"
  );

  return (
    <Flex
      justifyContent="center"
      placeItems={"center"}
      height="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        p={8}
        maxWidth="400px"
        width="100%"
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="md"
        boxShadow="lg"
        mt={38}
        mb={10}
      >
        <Flex justifyContent="center" alignItems="center" marginBottom={8}>
          <Box
            as="h1"
            fontSize="2xl"
            fontWeight="bold"
            bgGradient={formBgGradient}
            bgClip="text"
            textAlign="center"
          >
            Login
          </Box>
        </Flex>
        {loginError && (
          <Alert status="error" marginBottom={4}>
            <AlertIcon />
            Invalid credentials!!
          </Alert>
        )}
        <FormControl marginBottom={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleOnChange}
          />
        </FormControl>
        <FormControl marginBottom={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleOnChange}
          />
        </FormControl>
        <ToastContainer />
        <Button
          type="submit"
          colorScheme="teal"
          width="100%"
          onClick={handleSubmit}
          _hover={{
            bgGradient: formBgGradient,
            boxShadow: "xl",
          }}
          _active={{
            bgGradient: formBgGradient,
            boxShadow: "lg",
          }}
          _focus={{
            outline: "none",
          }}
          transition="all 0.2s"
        >
          Login
        </Button>
        <Flex padding={"3"} justifyContent={"space-between"}>
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/signup")}>Sign up</button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;
