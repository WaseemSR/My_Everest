import React, { useState } from 'react';

const TestUpload = () => {
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const [response, setResponse] = useState('');
  const [preview, setPreview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !photo) {
      setResponse('❌ Message or photo required.');
      return;
    }

    const token = localStorage.getItem("token"); // Get token from storage
    if (!token) {
      setResponse("❌ No token found. Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append('message', message);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResponse('✅ Post created successfully.');
        if (data.post.photoUrl) {
          setPreview(`http://localhost:3000${data.post.photoUrl}`);
        }
      } else {
        setResponse(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setResponse('❌ Upload failed.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Test Photo Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Message:</label><br />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <br />
        <div>
          <label>Photo:</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <p>{response}</p>
        {preview && (
          <div>
            <h4>Image Preview:</h4>
            <img src={preview} alt="Uploaded preview" width="300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestUpload;
