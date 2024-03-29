const URL = "https://leafmight.dk/security";
function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });

    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };
  const getTokenInfo = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJWTData = JSON.parse(decodedJwtJsonData);
    return decodedJWTData;
  };
  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };
  const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    if (getTokenInfo().roles === "admin") {
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    }
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  const fetchFlightData1 = (
    startDate,
    cabinClass,
    arrival,
    destination,
    adults
  ) => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(
      "https://leafmight.dk/security/api/info/flightdata/" +
        startDate +
        "/" +
        cabinClass +
        "/" +
        arrival +
        "/" +
        destination +
        "/" +
        adults,
      options
    ).then(handleHttpErrors);
  };

  const fetchFootballMatches = destination => {
    const newDestination = destination.split("-")[0];
    return fetch(
      "https://sandersolutions.dk/sem3_backend/api/air/nearestmatch/" +
        newDestination
    )
      .then(handleHttpErrors)
      .then(response => {
        return response;
      })
      .catch(err => {
        console.log(err);
      });
  };
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getTokenInfo,
    fetchFlightData1,
    fetchFootballMatches
  };
}
const facade = apiFacade();
export default facade;
