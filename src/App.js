import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/user/:id">
          <Profile id="1" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
