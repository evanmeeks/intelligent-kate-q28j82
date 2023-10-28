import React, { useState, useEffect } from "react";

const FlightInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Helper function to format the date as required by the API
    const formatDateToString = (date) => {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();

      // Padding single digits with zero
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;

      return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    // Calculate the current date and time and the date and time for 12 hours later
    const now = new Date();
    const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000); // milliseconds for 12 hours

    // Format the dates to strings
    const nowString = formatDateToString(now);
    const twelveHoursLaterString = formatDateToString(twelveHoursLater);

    // Construct the URL with the dates
    const url = `https://aerodatabox.p.rapidapi.com/flights/airports/icao/KJAN/${nowString}/${twelveHoursLaterString}?withLeg=true&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=true`;

    // Remaining API call code...
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "10e8c21c3amshf504ff31a868da0p1ac9edjsnd2a151809643",
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
      },
    };

    const fetchData = async () => {
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

  const format12HourTime = (dateString) => {
    // Create a date object from the date string
    const date = new Date(dateString);

    // Extract hours and minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Calculate AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Pad minutes with a zero if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Return the formatted string
    return `${hours}:${minutes} ${amOrPm}`;
  };
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
            Scheduled Arrival Time:{" "}
            {flight.arrival.scheduledTime?.local
              ? format12HourTime(flight.arrival.scheduledTime.local)
              : "N/A"}
          </p>

          {flight.aircraft && <p>Aircraft Model: {flight.aircraft.model}</p>}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FlightInfo;
