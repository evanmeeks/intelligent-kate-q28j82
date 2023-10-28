import React, { useState, useEffect } from "react";
export interface APIResponse {
  departures: DepartureElement[];
  arrivals: ArrivalElement[];
}

export interface ArrivalElement {
  departure: ArrivalDeparture;
  arrival: DepartureClass;
  number: string;
  callSign?: string;
  status: Status;
  codeshareStatus: CodeshareStatus;
  isCargo: boolean;
  aircraft: Aircraft;
  airline: Air;
  location?: Location;
}

export interface Aircraft {
  reg?: string;
  modeS?: string;
  model: string;
}

export interface Air {
  name: string;
  iata?: string;
  icao?: string;
}

export interface DepartureClass {
  scheduledTime: Time;
  revisedTime?: Time;
  quality: Quality[];
}

export enum Quality {
  Basic = "Basic",
  Live = "Live",
}

export interface Time {
  utc: string;
  local: string;
}

export enum CodeshareStatus {
  IsOperator = "IsOperator",
  Unknown = "Unknown",
}

export interface ArrivalDeparture {
  airport: Air;
  scheduledTime?: Time;
  revisedTime?: Time;
  runwayTime?: Time;
  quality: Quality[];
  terminal?: string;
}

export interface Location {
  pressureAltitude: Altitude;
  altitude: Altitude;
  pressure: { [key: string]: number };
  groundSpeed: GroundSpeed;
  trueTrack: TrueTrack;
  reportedAtUtc: string;
  lat: number;
  lon: number;
}

export interface Altitude {
  meter: number;
  km: number;
  mile: number;
  nm: number;
  feet: number;
}

export interface GroundSpeed {
  kt: number;
  kmPerHour: number;
  miPerHour: number;
  meterPerSecond: number;
}

export interface TrueTrack {
  deg: number;
  rad: number;
}

export enum Status {
  Expected = "Expected",
  Unknown = "Unknown",
}

export interface DepartureElement {
  departure: DepartureClass;
  arrival: PurpleArrival;
  number: string;
  callSign?: string;
  status: Status;
  codeshareStatus: CodeshareStatus;
  isCargo: boolean;
  aircraft: Aircraft;
  airline: Air;
}

export interface PurpleArrival {
  airport: Air;
  scheduledTime: Time;
  revisedTime?: Time;
  terminal?: string;
  quality: Quality[];
}

const FlightInfo = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Helper function to format the date as required by the API
    const formatDateToString = (date: Date) => {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();

      // Padding single digits with zero
      month = Number(month < 10 ? "0" + month : month);
      day = Number(day < 10 ? "0" + day : day);
      hour = Number(hour < 10 ? "0" + hour : hour);
      minute = Number(minute < 10 ? "0" + minute : minute);

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
      } catch (err: unknown) {
        // Change here to 'unknown'
        // We need to check if 'err' is an instance of Error to satisfy TypeScript's type checker
        if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          // If it's not an Error instance, it could be anything, so we might want to stringify it.
          // You can handle different cases based on your needs.
          setError(`An error occurred: ${String(err)}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const format12HourTime = (dateString: Date) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes(); // Keep minutes as a number here
    const amOrPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Minutes converted to string only in the return statement
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${amOrPm}`;
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Arrivals</h1>
      {data?.arrivals.map((flight: any, index: number) => (
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
