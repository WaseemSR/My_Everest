import { useState } from 'react';

const TestUpload = () => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [photo, setPhoto] = useState(null);
  const [response, setResponse] = useState('');
  const [preview, setPreview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() && !photo) {
      setResponse('Name or photo required.');
      return;
    }

    const token = localStorage.getItem("token");
    console.log(">>>>>>>>>>", token)
    if (!token) {  // TODO: check for undefined
      setResponse(" No token found. Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('details', details);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch('http://localhost:3000/everests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResponse('✅ Everest created successfully.');
        if (data.everest.photo) {
          setPreview(`http://localhost:3000${data.everest.photo}`);
        }
      } else {
        setResponse(` ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setResponse(' Upload failed.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Test Everest Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <br />
        <div>
          <label>Details:</label><br />
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
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

