import "./App.css";
import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Link,
  Prompt,
  NavLink,
  useHistory
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/");
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <HeaderStart />
          <ContentStart login={login} />
        </div>
      ) : (
        <div>
          <LoggedIn logout={logout} />
        </div>
      )}
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}
const Logout = ({ logout }) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function LoggedIn({ logout }) {
  return (
    <div>
      <Header />
      <Content logout={logout} />
    </div>
  );
}
const HeaderStart = () => {
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/readme">
          README
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/flightinfo">
          FlightInfo
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
      </li>
    </ul>
  );
};
const ContentStart = ({ login }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <LogIn login={login} />
      </Route>
      <Route path="/readme">
        <Readme />
      </Route>
      <Route path="/flightinfo">
        <FlightData />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};
const Header = () => {
  if (facade.getTokenInfo().roles === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/people">
            People
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/readme">
            README
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/edit">
            Edit
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/logout">
            Logout
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/user-info">
            Hi! {facade.getTokenInfo().username} Role:{" "}
            {facade.getTokenInfo().roles}
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/people">
          People
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/readme">
          README
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/logout">
          Logout
        </NavLink>
      </li>
      <li style={{ float: "right" }}>
        <NavLink activeClassName="active" to="/user-info">
          Hi! {facade.getTokenInfo().username} Role:{" "}
          {facade.getTokenInfo().roles}
        </NavLink>
      </li>
    </ul>
  );
};

const Content = ({ logout }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/people">
        <People />
      </Route>
      <Route path="/readme">
        <Readme />
      </Route>
      <Route path="/edit">
        <Edit />
      </Route>
      <Route path="/logout">
        <Logout logout={logout} />
      </Route>
      <Route path="/user-info">
        <UserInfo />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

const Home = () => {
  return (
    <div>
      <h3>Welcome to home</h3>
      <form>
        <input type="text" placeholder="Destination" />
        <input type="text" placeholder="Departure" />
        <input type="date" />
        <input type="date" />
        <button onClick={}>Søg</button>
      </form>
      <FlightData />
    </div>
  );
};
const FlightData = () => {
  const [flightInfo, setFlightInfo] = useState([]);
  useEffect(() => {
    let didCancel = false;
    facade.fetchFlightData().then(res => {
      if (didCancel === false) {
        setFlightInfo(res);
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);
  return (
    <div>
      <h3>Flightdata</h3>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {flightInfo.map(flight => {
            return (
              <tr>
                <td>{flight.id}</td>
                <td>{flight.startDestination}</td>
                <td>{flight.endDestination}</td>
                <td>{flight.departure}</td>
                <td>{flight.price}</td>
                <td>{flight.deeplinkUrl}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
const People = () => {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");
  const [listPeople, setListPeople] = useState([]);

  useEffect(() => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);
  useEffect(() => {
    let didCancel = false;
    facade.fetchPeople().then(res => {
      if (didCancel === false) {
        setListPeople(res);
        console.log("Fetching complete");
        facade.fetchStuff().then(res => console.log(res));
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);
  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      <p>{JSON.stringify(listPeople)}</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {listPeople.map((person, index) => {
            return (
              <tr key={index}>
                <td>{person.name}</td>
                <td>{person.height}</td>
                <td>{person.gender}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Edit = () => {
  return (
    <div>
      <h3>Find and Edit</h3>
    </div>
  );
};
const Readme = () => {
  return (
    <div>
      <h1>Setup everything:</h1>
      <h3>Backend</h3>
      <h3>Clone / setup</h3>
      <ul>
        <li>Clone this project</li>
        <li>Delete the .git folder and use "git init"</li>
        <li>Create your OWN repository for this project on github</li>
        <li>
          Go to travis and add your new repository by "flipping the switch"
          (Synchronize if now shown)
        </li>
        <li>
          Add credentials: "REMOTE_USER" + "script_user" and "REMOTE_PW" +
          password (values can be found in your "my-bootstrap.sh")
        </li>
        <li>Commit and Push your code to this repository</li>
        <li>
          Create databases by either only creating these 2 exacly as they are:
          CA3 CA3_test
        </li>
        <li>
          or choose your own name for db but then you will have to change the
          following files:
        </li>
        <ul>
          <li>Travis.yml: Line 40</li>
          <li>
            Other Sources: src/main/resources: : config.properties: Change db
            name at line 17 and 21.
          </li>
        </ul>
        <li>run "mvn clean test" in terminal: fix problems if any appears.</li>
      </ul>
      <h3>Backend Deploy</h3>
      <ul>
        <li>
          Change the remote.server url to your own domain/droplet Project Files:
          Pom.xml: remote.server>https://leafmight.dk/manager/text ...
        </li>
        <li>
          Run "ssh DropletUserName@domain" followed by "sudo nano
          /opt/tomcat/bin/setenv.sh"
        </li>
        <li>Change USER, PW and CONNECTION(startcode) to your own values:</li>
        <p>export DEPLOYED="DEV_ON_DIGITAL_OCEAN"</p>
        <p>export USER="YOUR_DB_USER"</p>
        <p>export PW="YOUR_DB_PASSWORD"</p>
        <p>export CONNECTION_STR="jdbc:mysql://localhost:3306/startcode"</p>
        <li>Save file: "cntrl + x" and "Enter".</li>
        <li>Restart tomcat "sudo systemctl restart tomcat".</li>
        <li>
          You can run the following with your own user / pw info: mvn clean test
          -Dremote.user=script_user -Dremote.password=PW_FOR_script_user
          tomcat7:deploy
        </li>
        <li>
          If everything was fine the project should be deployed to your droplet,
          ready to use with the remote database.
        </li>
        <li>
          Otherwise you should be able to just commit and push changes to github
          and travis should deploy it for you.
        </li>
      </ul>
      <br></br>
      <h2>Frontend</h2>
      <h3>Change</h3>
      <ul>
        <li>Clone this repository</li>
        <li>Open project in Visual Studio Code</li>
        <li>Change url at the top of apiFacade to your own domain name.</li>
        <li>Navigate into the folder via terminal</li>
        <li>Run: "npm install react-router-dom", "npm start"</li>
      </ul>
      <h3>Deploy Frontend</h3>
      <ul>
        <li>Remember to change URL's from local to the domain</li>
        <li>Run: "npm run build".</li>
        <li>Run: "sudo npm install -g surge".</li>
        <li>Run: "surge --project ./build --domain DOMAIN_NAME.surge.sh".</li>
        <li>Enter email and password.</li>
      </ul>
    </div>
  );
};

const UserInfo = () => {
  return (
    <div>
      <h2>User Info</h2>
      <li>Username: {facade.getTokenInfo().username}</li>
      <li>Role: {facade.getTokenInfo().roles}</li>
    </div>
  );
};
const NoMatch = () => <div>No match for path</div>;
export default App;
