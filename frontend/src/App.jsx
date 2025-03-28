import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:3000/')
    .then(res => res.text())
    .then(data => setMessage(data))
    .catch(() => setMessage('Failed to connect to backend'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>React Frontend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;