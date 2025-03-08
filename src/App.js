import React, { useState } from 'react';
import JSONViewer from './components/JSONViewer';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [jsonText, setJsonText] = useState(`{
    "name": "John Doe",
    "age": 30,
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA"
    },
    "phoneNumbers": [
        {
            "type": "home",
            "number": "555-555-5555",
            "history": [
                {
                    "date": "2024-01-01",
                    "value": "555-555-5555"
                },
                {
                    "date": "2024-01-02",
                    "value": "555-555-5556",
                    "metadata": {
                        "address": "123 Main St",
                        "city": "Anytown",
                        "state": "CA"
                    }
                }
            ]
        },
        {
            "type": "work",
            "number": "555-555-5556",
            "history": [
                {
                    "date": "2024-01-01",
                    "value": "555-555-5556"
                },
                {
                    "date": "2024-01-02",
                    "value": "555-555-5557"
                }
            ]
        }
    ]
}`);
  const [showInput, setShowInput] = useState(true);

  const handleSubmit = () => {
    try {
      const parsedJson = JSON.parse(jsonText);
      setJsonData(parsedJson);
      setShowInput(false);
    } catch (e) {
      alert('Invalid JSON data. Please check your input.');
    }
  };

  const handleReset = () => {
    setJsonData(null);
    setShowInput(true);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>JSONさん</h1>
      <div style={{ 
        backgroundColor: '#e6f7ff', 
        padding: '10px', 
        borderRadius: '5px', 
        marginBottom: '15px',
        border: '1px solid #91d5ff'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Privacy Notice:</strong> JSON data is processed locally in your browser. 
          Your data never leaves your device.
        </p>
      </div>
      
      {showInput ? (
        <>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows="30"
            style={{ width: '100%' }}
            placeholder="Paste your JSON here"
          />
          <br />
          <button onClick={handleSubmit}>Submit</button>
        </>
      ) : (
        <>
          <button onClick={handleReset} style={{ marginBottom: '20px' }}>Reset</button>
          <JSONViewer data={jsonData} />
        </>
      )}
    </div>
  );
}

export default App;