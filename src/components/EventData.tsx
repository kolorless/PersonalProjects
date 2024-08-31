import "./EventData.css";
import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface Props {
  events: any;
  index: number;
  backClick: () => void;
}

const containerStyle = {
  width: "400px",
  height: "400px",
};

export default function EventData({ events, index, backClick }: Props) {
  const center = {
    lat: Number(events[index]._embedded.venues[0].location.latitude),
    lng: Number(events[index]._embedded.venues[0].location.longitude),
  };
  console.log(center);

  const [activeTab, setTab] = useState("event");

  const [map, setMap] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: APIKEY,
  });

  function onTab(tab: string) {
    setTab(tab);
  }

  return (
    <div className="event-container">
      <button className="back-button" onClick={backClick}>
        &lt; Back
      </button>
      <div className="event-header">
        <h4>{events[index].name} </h4>
      </div>
      <div className="event-tabs">
        <div onClick={() => onTab("event")}>
          <span
            className={`tab ${activeTab === "event" ? "tab active" : "tab"}`}
          >
            Events
          </span>
        </div>

        <div onClick={() => onTab("venue")}>
          <span
            className={`tab ${activeTab === "venue" ? "tab active" : "tab"}`}
          >
            Venue
          </span>
        </div>
      </div>
      <div>
        <div
          className={`tab ${
            activeTab === "event" ? "event-details" : "displayOff"
          }`}
        >
          <p>
            <strong>Date/Time</strong>
            <br />
            {events[index].dates.start.localDate}
            <br />
            {events[index].dates.start.localTime}
          </p>
          <p>
            <strong>Venue</strong>
            <br />
            {events[index]._embedded.venues[0].name}
          </p>
          <p>
            <strong>Buy Ticket At</strong>
            <br />
            <a
              href={events[index].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ticketmaster
            </a>
          </p>
        </div>
        <div
          className={`tab ${
            activeTab === "venue" ? "event-details" : "displayOff"
          }`}
        >
          <p>
            <strong>Name</strong>
            <br />
            {events[index]._embedded.venues[0].name}
          </p>
          <p>
            <strong>Address</strong>
            <br />
            {events[index]._embedded.venues[0].address.line1},{" "}
            {events[index]._embedded.venues[0].city.name},{" "}
            {events[index]._embedded.venues[0].state.name}
          </p>
          <button className="mapbutton" onClick={() => setMap(!map)}>
            Show venue on Google map
          </button>
          <div className={map ? "gmap" : "displayOff"}>
            <strong>Event Venue</strong>
            <div className="map">
              {isLoaded && (
                <GoogleMap
                  center={center}
                  mapContainerStyle={containerStyle}
                  zoom={15}
                >
                  <Marker position={center} />
                </GoogleMap>
              )}
            </div>
            <button className="mapback" onClick={() => setMap(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
