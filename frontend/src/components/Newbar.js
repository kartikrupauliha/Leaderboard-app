import React, { useState, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Spacer,
  IconButton,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import AuthContext from "../context/AuthProvider";

function Newbar() {
  const { setAuth, auth, settoken, token } = useContext(AuthContext);

  const [cookies, removeCookie] = useCookies([]);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  // useEffect(() => {
  //   settoken(cookies.token);
  // }, [cookies, token, settoken])

  // console.log(token);
  const Logout = () => {
    // setCookieStatus(false);
    settoken(null);
    setAuth(null);
    removeCookie("token");
    removeCookie("id");
    removeCookie("isAdmin");
    removeCookie("userEmail");
    navigate("/login");
    window.location.reload();
  };

  const handleLogin = () => {
    // Handle login functionality
    navigate("/login");
  };

  const handleSignUp = () => {
    // Handle sign up functionality
    navigate("/signup");
  };

  var regexPattern = new RegExp("true");
  var boolValue1 = regexPattern.test(auth?.isAdmin);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding={4}
      bg="teal.500"
      color="white"
    >
      <Box display="flex" alignItems="center">
        <Box as="span" marginRight={6} fontSize="xl">
          Logo
        </Box>
        <Box
          as="span"
          onClick={() => navigate("/")}
          marginRight={4}
          fontSize="xl"
          cursor={"pointer"}
          _hover={{ bg: "blue.600" }}
          _focus={{ boxShadow: "outline" }}
        >
          {/* <a href="/assignments">Dashboard</a> */}
          Dashboard
        </Box>
        {boolValue1 && (
          <Box
            onClick={() => navigate("/createnewassignment")}
            as="span"
            marginRight={4}
            fontSize="xl"
            _hover={{ bg: "blue.600" }}
            _focus={{ boxShadow: "outline" }}
            cursor={"pointer"}
          >
            Create New
          </Box>
        )}
        {boolValue1 && (
          <Box
            onClick={() => navigate("/requests")}
            as="span"
            marginRight={4}
            fontSize="xl"
            _hover={{ bg: "blue.600" }}
            _focus={{ boxShadow: "outline" }}
            cursor={"pointer"}
          >
            Requests
          </Box>
        )}
      </Box>
      <Spacer />
      <Box display="flex" alignItems="center">
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          marginRight={10}
        />
        {token ? (
          <Button
            variant="link"
            onClick={Logout}
            marginRight={6}
            textColor={"white"}
          >
            Sign Out
          </Button>
        ) : (
          <>
            <Button
              variant="link"
              onClick={handleLogin}
              marginRight={6}
              textColor={"white"}
            >
              Sign In
            </Button>

            <Button variant="link" onClick={handleSignUp} textColor={"white"}>
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
}

export default Newbar;
