import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import FlightInfo from "./FlightInfo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <FlightInfo />
      </div>
    </div>
  );
}

export default App;
