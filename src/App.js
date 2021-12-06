import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useGlobalContext } from "./context";

// import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import LessonList from "./pages/LessonList";
import Lesson from "./pages/Lesson";
import VocabList from "./pages/VocabList";
import Vocab from "./pages/Vocab";
import ConvoList from "./pages/ConvoList";
import Convo from "./pages/Convo";

// import components
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

function App() {
  const { loading } = useGlobalContext();
  if (loading) {
    return <Loading />;
  }
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
        <Route path="/lessons">
          <LessonList />
        </Route>
        <Route exact path="/lesson/:lessonId">
          <Lesson />
        </Route>
        <Route path="/vocabularies">
          <VocabList />
        </Route>
        <Route path="/lesson/:lessonId/vocabulary/:vocabId">
          <Vocab />
        </Route>
        <Route path="/conversations">
          <ConvoList />
        </Route>
        <Route path="/lesson/:lessonId/conversation/:convoId">
          <Convo />
        </Route>

        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
