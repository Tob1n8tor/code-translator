//import logo from './logo.svg';
import './App.css';
import Select from "react-select";
import { useState } from 'react';

const options = [
  { value: 'java', label: 'java' },
  { value: 'python', label: 'python' },
  { value: 'javascript', label: 'javascrip' },
  { value: 'c#', label: 'c#' },
  { value: 'c++', label: 'c++' },
  { value: 'c', label: 'c' },
];

function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  return (
    <div className="App" style={{ maxWidth: "300px" }}>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
