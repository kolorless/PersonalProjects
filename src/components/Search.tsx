import { useState, useEffect, FormEvent } from "react";
import "./Search.css";
import EventData from "./EventData";
import "./Present.css";
import axios from "axios";

//!!IMPORTANT FIXES LATER ON

//desperately work on this css shit

export default function Search() {
  //All Variables
  const [newKeyword, setKeyword] = useState("");
  let [radius, setDistance] = useState("");
  let [newLocation, setLocation] = useState("");
  const [newCategory, setCategory] = useState("default");
  const [newChecked, setChecked] = useState(false);
  const [loc, setLoc] = useState("");
  const [finalLat, setRLat] = useState("");
  const [finalLong, setRLong] = useState("");
  let segmentID: string = "";
  const [showresults, setShow] = useState(false);
  const [results, setResults] = useState("");

  //Handling submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setShow(true);
    if (radius === "") {
      radius = "10";
    }
    console.log("New request submitted!");

    //Assigning Segment ID to the Categories
    switch (newCategory) {
      case "default":
        segmentID = "";
      case "music":
        segmentID = "KZFzniwnSyZfZ7v7nJ";
        break;
      case "sports":
        segmentID = "KZFzniwnSyZfZ7v7nE";
        break;
      case "arts":
        segmentID = "KZFzniwnSyZfZ7v7na";
        break;
      case "film":
        segmentID = "KZFzniwnSyZfZ7v7nn";
        break;
      case "misc":
        segmentID = "KZFzniwnSyZfZ7v7n1";
        break;
    }

    //Assigning the URL using the location value
    const locURL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      newLocation +
      "&key=AIzaSyCdkwOuZ9lnc8r4-NeCLuebFGhWL56Fv4A";

    //Fetching the auto detect location using IPINFO API
    if (newChecked) {
      try {
        const response = await axios.get(
          "https://ipinfo.io/json?token=d0ce80eac5f779"
        );
        const jsonResponse = response.data;
        setLoc(jsonResponse.loc);
        let locate: any = loc.split(",");
        setRLat(locate[0]);
        setRLong(locate[1]);
        console.log(finalLat, finalLong);
      } catch (error) {
        console.error("Error fetching auto-detected location: ", error);
      }
    }

    //Fetching the input location using Google Maps API
    if (!newChecked) {
      try {
        const response = await axios.get(locURL);
        const jsonResponse = response.data;
        setRLat(jsonResponse.results[0].geometry.location.lat);
        setRLong(jsonResponse.results[0].geometry.location.lng);
      } catch (error) {
        console.error("Error fetching Google API location: ", error);
      }
    }

    sendData(newKeyword, segmentID, radius, finalLat, finalLong);
  };

  //Sending data to Django
  const sendData = async (
    keyword: any,
    segmentID: any,
    radius: any,
    lat: any,
    long: any
  ) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/search/", {
        keyword,
        segmentID,
        radius,
        lat,
        long,
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error posting data to Django: ", error);
    }
  };
  //Handling Auto-Location Check
  const checkHandler = () => {
    setChecked(!newChecked);
  };

  //Handling the clear button
  const handleClear = (e: any) => {
    e.preventDefault();
    setShow(false);
    setKeyword("");
    setLocation("");
    setChecked(false);
    setDistance("");
    setCategory("default");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h1 className="header">Events Search</h1>
          <div className="keyword">
            Keyword:
            <input
              required
              name="keyword"
              type="text"
              value={newKeyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="distance">
            Distance(miles):
            <input
              name="distance"
              type="number"
              value={radius}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <div className="category">
            Category:
            <select
              id="category"
              required
              value={newCategory}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option defaultValue="default">Default</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts & Theatre</option>
              <option value="film">Film</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>

          <div className="location">
            Location:
            <input
              required
              name="location"
              disabled={newChecked}
              type="text"
              value={newLocation}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="checkbox">
            <input
              type="checkbox"
              name="auto"
              checked={newChecked}
              onChange={checkHandler}
            />
            <label>Auto-detect your location</label>
          </div>
          <button type="submit" className="submit">
            {" "}
            SUBMIT
          </button>
          <button type="reset" className="clear" onClick={handleClear}>
            {" "}
            CLEAR
          </button>
          <div>{showresults ? <Present response={results} /> : null}</div>
        </div>
      </form>
    </div>
  );
}

//Data Presentation
interface Props {
  response: any;
}
function Present({ response }: Props) {
  const [isHidden, setIsHidden] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  const [details, setDetails] = useState(false);
  const [ref, setRef] = useState<number>(-100);

  function handleClick(id: number) {
    setDetails(true);
    setRef(id);
    setIsHidden(true);
  }

  function handleBackClick() {
    setDetails(false);
    setIsHidden(false);
  }

  useEffect(() => {
    setEvents(response.data._embedded.events || []);
  }, [response]);

  return (
    <div>
      <div className={isHidden ? "hidden" : ""}>
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Date/Time</th>
                <th scope="col">Icon</th>
                <th className="event" scope="col">
                  Event
                </th>
                <th scope="col">Genre</th>
                <th scope="col">Venue</th>
              </tr>
            </thead>
            <tbody>
              {events.map((eventName, index) => (
                <>
                  <tr key={index} onClick={() => handleClick(index)}>
                    <td scope="row">
                      {eventName.dates.start.localDate}
                      <br />
                      {eventName.dates.start.localTime}
                    </td>
                    <td>
                      <img className="logo" src={eventName.images[0].url}></img>
                    </td>
                    <td className="event">{eventName.name}</td>
                    <td>{eventName.classifications[0].segment.name}</td>
                    <td>{eventName._embedded.venues[0].name}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {details ? (
        <EventData events={events} index={ref} backClick={handleBackClick} />
      ) : null}
    </div>
  );
}
