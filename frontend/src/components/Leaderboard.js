import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
} from "@chakra-ui/react";

const Leaderboard = () => {
  const [cookies, removeCookie] = useCookies([]);
  let { id } = useParams();
  const navigate = useNavigate();
  const [emailScoreData, setEmailScoreData] = useState([]);

  const { colorMode } = useColorMode();

  const bgColor = colorMode === "light" ? "gray.200" : "gray.800";
  const textColor = colorMode === "light" ? "gray.800" : "gray.200";
  const rowColor = colorMode === "light" ? "gray.100" : "gray.700";

  useEffect(() => {
    // if (cookies.token == "undefined") {
    //   navigate("/login");
    // }
    const fetchdata = async () => {
      const emailScoreArray = await axios.get(
        `http://localhost:5000/assignments/${id}/leaderboard`,
        {
          withCredentials: true,
          obj: { id },
        }
      );
      console.log(emailScoreArray.data);
      setEmailScoreData(emailScoreArray.data);
    };
    fetchdata();
  }, [cookies, navigate, removeCookie]);

  // Sort the leaderboardData in descending order based on the scores
  emailScoreData.sort((a, b) => b.score - a.score);

  const handleClick = () => {
    const path = `/assignments/${id}`;
    navigate(path);
  };

  return (
    
    <Box minH="100vh" bg={bgColor} py={8}>
      <Box maxW="md" mx="auto" p={4}>
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <Text as="h1" fontSize="3xl" fontWeight="bold" color={textColor}>
            Leaderboard
          </Text>
        </Flex>
        <Flex justifyContent="flex-start" alignItems="center" mb={4}>
          {/* <Button onClick={handleClick} size="sm">
            Go Back
          </Button> */}
        </Flex>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Email</Th>
              <Th>Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {emailScoreData.map((entry, index) => (
              <Tr key={index} bg={rowColor}>
                <Td>{index + 1}</Td>
                <Td>{entry.email}</Td>
                <Td>{entry.score}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Leaderboard;
