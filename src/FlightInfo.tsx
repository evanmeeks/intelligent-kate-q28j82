import React, { useState, useEffect } from "react";

const FlightInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://aerodatabox.p.rapidapi.com/flights/airports/icao/KJAN/2023-04-04T20:00/2023-04-05T08:00?withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=true";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "10e8c21c3amshf504ff31a868da0p1ac9edjsnd2a151809643",
          "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const json = await response.json();
        if (response.ok) {
          setData(json);
        } else {
          setError(`Error: ${response.statusText}`);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Arrivals</h1>
      {data.arrivals.map((flight: any, index: number) => (
        <div key={index}>
          <h2>{flight.airline ? flight.airline.name : "Private Flight"}</h2>
          <p>Flight Number: {flight.number}</p>
          <p>
            Departure Airport: {flight.departure.airport.name} (
            {flight.departure.airport.iata})
          </p>
          <p>
            Scheduled Departure Time: {flight.departure.scheduledTime?.local}
          </p>
          <p>Status: {flight.status}</p>
          {flight.aircraft && <p>Aircraft Model: {flight.aircraft.model}</p>}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FlightInfo;
