import { useEffect, useState } from "react";

const port = process.env.BACKEND_PORT || '3000';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`http://localhost:${port}/`)
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