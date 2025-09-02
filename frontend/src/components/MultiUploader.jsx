import React, { useState, useEffect } from "react";

export default function MultiUploader({ onUpload }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Local file input ref
  const fileInputRef = React.useRef(null);

  // Dropbox and Google SDK script loaders
  useEffect(() => {
    // Load Dropbox SDK
    if (!window.Dropbox) {
      const script = document.createElement("script");
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.id = "dropboxjs";
      script.setAttribute("data-app-key", "YOUR_DROPBOX_APP_KEY");
      script.async = true;
      document.body.appendChild(script);
    }

    // Load Google Picker SDK
    window.gapi && window.gapi.load("picker", () => {
      // Picker will be initialized on button click
    });
  }, []);

  // Handler for local file upload
  function handleFileChange(e) {
    if (e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  }

  // Dropbox chooser
  function openDropboxChooser() {
    if (window.Dropbox) {
      window.Dropbox.choose({
        success: function(files) {
          // files is an array of chosen files (with link URLs)
          onUpload(files[0]); // pass the first file object
        },
        cancel: function() {
          console.log("Dropbox chooser cancelled");
        },
        linkType: "direct", // or "preview"
        multiselect: false,
      });
    } else {
      alert("Dropbox SDK not loaded yet");
    }
  }

  // Google Picker integration
  function openGooglePicker() {
    if (!window.gapi) {
      alert("Google API not loaded");
      return;
    }
    const developerKey = "YOUR_GOOGLE_API_KEY";
    const clientId = "YOUR_GOOGLE_CLIENT_ID";
    const scope = ["https://www.googleapis.com/auth/drive.readonly"];

    let oauthToken;

    function onAuthApiLoad() {
      window.gapi.auth.authorize(
        {
          client_id: clientId,
          scope: scope,
          immediate: false,
        },
        handleAuthResult
      );
    }

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
      }
    }

    function createPicker() {
      if (oauthToken) {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .setOAuthToken(oauthToken)
          .setDeveloperKey(developerKey)
          .setCallback(pickerCallback)
          .build();
        picker.setVisible(true);
      }
    }

    function pickerCallback(data) {
      if (data.action === window.google.picker.Action.PICKED) {
        const fileId = data.docs[0].id;
        // Use Google Drive API to get file metadata or download URL here
        onUpload(data.docs[0]);
      }
    }

    // Load auth API and start flow
    window.gapi.load("auth", onAuthApiLoad);
  }

  // Camera start
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraActive(true);
    } catch (err) {
      alert("Failed to access camera: " + err.message);
    }
  }

  // Capture photo from video stream
  function capturePhoto() {
    if (!cameraStream) return;

    const video = document.createElement("video");
    video.srcObject = cameraStream;
    video.play();

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    video.addEventListener("canplay", () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setCapturedPhoto(blob);
        onUpload(blob);
        stopCamera();
      }, "image/jpeg");
    });
  }

  // Stop camera
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setCameraActive(false);
    }
  }

  return (
    <div>
      <button onClick={() => fileInputRef.current.click()}>Upload from Computer</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button onClick={openDropboxChooser}>Import from Dropbox</button>
      <button onClick={openGooglePicker}>Import from Google Drive</button>

      {!cameraActive ? (
        <button onClick={startCamera}>Take a Photo</button>
      ) : (
        <>
          <button onClick={capturePhoto}>Capture</button>
          <button onClick={stopCamera}>Cancel</button>
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (video && cameraStream) {
                video.srcObject = cameraStream;
              }
            }}
            style={{ width: "300px", height: "auto" }}
          />
        </>
      )}

      {capturedPhoto && (
        <div>
          <h4>Captured Photo Preview:</h4>
          <img
            src={URL.createObjectURL(capturedPhoto)}
            alt="Captured"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}
    </div>
  );
}
