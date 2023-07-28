import React from "react";
import { Routes, Route } from "react-router-dom";

import Newbar from "./components/Newbar";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import { Login, Signup } from "./components";
import { ChakraProvider } from "@chakra-ui/react";
import AssignmentPage from "./components/AssignmentPage";
import Leaderboard from "./components/Leaderboard";
import EditForm from "./components/EditForm";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Requests from "./components/Requests";

function App() {
  return (
    <ChakraProvider>
      <div>
        {<Newbar />}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route exact path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Dashboard />}></Route>
            <Route
              path="/assignments/:id/leaderboard"
              element={<Leaderboard />}
            />

            <Route element={<RequireAuth />}>
              <Route path="/createnewassignment" element={<Form />} />
              <Route path="/requests" element={<Requests />} />
              <Route path={`/assignments/:id`} element={<AssignmentPage />} />
              <Route
                path="/assignments/editAssignment/:id"
                element={<EditForm />}
              />
              <Route path="*" element={<Login />}></Route>
            </Route>
          </Route>
        </Routes>
        {/* <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/createnewassignment" element={<Form />} />
            <Route path={`/assignments/:id`} element={<AssignmentPage />} />
            <Route
              path="/assignments/:id/leaderboard"
              element={<Leaderboard />}
            />
            <Route path="/assignments" element={<Dashboard />}></Route>
            <Route
              path="/assignments/editAssignment/:id"
              element={<EditForm />}
            />
          </Routes> */}
      </div>
    </ChakraProvider>
  );
}

export default App;
