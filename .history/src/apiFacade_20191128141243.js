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
  const fetchPeople = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/people", options).then(handleHttpErrors);
  };
  const fetchFlightData = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(
      "http://localhost:8080/securitystarter/api/info/flightdata",
      options
    ).then(handleHttpErrors);
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
      "http://leafmight.dk/security/api/info/flightdata/" +
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

  const fetchStuff = () => {
    return fetch(
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
          "x-rapidapi-key": "1e16b498-3dfb-400b-8ecd-91d0f943a5a3",
          "content-type": "application/x-www-form-urlencoded"
        },
        body: {
          inboundDate: "2019-11-21",
          cabinClass: "business",
          children: "0",
          infants: "0",
          country: "US",
          currency: "USD",
          locale: "en-US",
          originPlace: "SFO-sky",
          destinationPlace: "LHR-sky",
          outboundDate: "2019-11-22",
          adults: "1"
        }
      }
    )
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const fetchNew = () => {
    return fetch(
      "https://apidojo-hipmunk-v1.p.rapidapi.com/flights/create-session?infants_lap=0&children=0&seniors=0&country=US&from0=SGN&to0=DAD&date0=Jan%2027%202019&pax=1&cabin=Coach",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "apidojo-hipmunk-v1.p.rapidapi.com",
          "x-rapidapi-key": "4dfa3d7cb0msh7701660655f1502p13c7cbjsn3a351650d218"
        }
      }
    )
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const fetchFootballMatches = () => {
    return fetch(
      "https://sandersolutions.dk/sem3_backend/api/air/nearestmatch/LGW"
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
    fetchPeople,
    getTokenInfo,
    fetchStuff,
    fetchFlightData,
    fetchFlightData1,
    fetchFootballMatches
  };
}
const facade = apiFacade();
export default facade;
