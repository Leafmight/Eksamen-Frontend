import "./App.css";
import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";

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
      <div>
        <HeaderStart />
        <ContentStart login={login} />
      </div>
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
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
      </li>
    </ul>
  );
};
const ContentStart = ({ login, props }) => {
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
      <FindFlight />
    </div>
  );
};

const FlightData = flightInfo => {
  return (
    <div>
      <h3>Flightdata</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Agent</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Booking</th>
          </tr>
        </thead>
        <tbody>
          {flightInfo.map((flight, index) => {
            return (
              <tr key={index}>
                <td>
                  <img
                    src={flight.imageUrl}
                    height="auto"
                    width="100%"
                    alt="Ups"
                  ></img>
                </td>
                <td>{flight.agentsName}</td>
                <td>{flight.startDestination}</td>
                <td>{flight.endDestination}</td>
                <td>{flight.departure}</td>
                <td>{flight.arrival}</td>
                <td>{flight.duration} min</td>
                <td>{flight.price} kr. </td>
                <td>
                  <button>
                    <a href={flight.deeplinkUrl} target="_blank">
                      Book now
                    </a>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const FindFlight = ({ flightinfo }) => {
  const [state, setState] = useState({
    startDate: "",
    cabinClass: "economy",
    destination: "",
    adults: "1",
    arrival: ""
  });
  const [listData, setListData] = useState([]);
  const [listMatches, setListMatches] = useState([]);

  function handleFindFlight(event) {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setState({
      ...flightinfo,
      [name]: value
    });
    state.startDate
      .split("-")
      .reverse()
      .join("-");
    facade
      .fetchFlightData1(
        state.startDate,
        state.cabinClass,
        state.arrival,
        state.destination,
        state.adults
      )
      .then(res => {
        setListData(res);
      });
    handleFootballSubmit(event);
  }
  function handleFootballSubmit(event) {
    event.preventDefault();
    facade
      .fetchFootballMatches(state.destination)
      .then(res => setListMatches(res));
  }

  return (
    <div>
      <form>
        <input
          type="text"
          name="arrival"
          placeholder="Departure"
          onChange={handleFindFlight}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          onChange={handleFindFlight}
        />
        <input
          type="date"
          name="startDate"
          onChange={handleFindFlight}
          required
        />
        <input
          type="number"
          name="adults"
          placeholder="1"
          min="1"
          size="4"
          onChange={handleFindFlight}
        />
        <select name="cabinClass" onChange={handleFindFlight}>
          <option value="economy">Economy</option>
          <option value="premiumeconomy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First Class</option>
        </select>
        <button onClick={handleSubmit}>Søg</button>
      </form>
      <div>{FlightData(listData)}</div>
      <div>{Footballmatches(listMatches)}</div>
    </div>
  );
};

const Footballmatches = listMatches => {
  return (
    <div>
      <h2>Data from football matches</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Away City</th>
            <th>Home City</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {listMatches.map((match, index) => {
            return (
              <tr key={index}>
                <td>{match.awayCity}</td>
                <td>{match.homeCity}</td>
                <td>{match.utcDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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

const NoMatch = () => <div>No match for path</div>;
export default App;
