import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import Profile from "./pages/Profile";

// import components
import Navbar from "./components/Navbar";
import Lesson from "./components/Lesson";
import LessonList from "./components/LessonList";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/lesson">
          <LessonList />
        </Route>
        <Route path="/lesson/:id">
          <Lesson />
        </Route>
        {/* <Route path="/conversation">
          <ConvoList />
        </Route>
        <Route path="/vocabulary">
          <VocabList />
        </Route> */}

        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
