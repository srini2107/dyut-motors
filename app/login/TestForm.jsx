import React, { useState } from 'react';

export default function TestForm() {
  const [data, setData] = useState('');

  const handleChange = e => {
    console.log('Input Changed:', e.target.value);
    setData(e.target.value);
  };

  return (
    <div>
      <h2>Test Form</h2>
      <input
        type="text"
        value={data}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <p>Current Value: {data}</p>
    </div>
  );
}