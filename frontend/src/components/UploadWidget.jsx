import { useEffect, useRef } from "react";

const UploadWidget = ({ imageUrl, setImageUrl }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dcwwflklx", // your Cloudinary cloud name
        uploadPreset: "everest_user_profile", // your unsigned preset
        folder: "user-profiles", // optional: organize images into folders
        cropping: true, // optional: allow cropping
        multiple: false,
      },
      function (error, result) {
        if (!error && result?.event === "success") {
          console.log("Upload successful:", result.info);
          setImageUrl(result.info.secure_url); // Send URL back to parent
        }
      }
    );
  }, [setImageUrl]);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <div className="has-text-centered mt-5 mb-5">
      {/* Upload Button */}
      <button
        type="button"
        className="button is-my-green is-small has-text-white"
        onClick={openWidget}
      >
        Upload Profile Image
      </button>

      {/* Preview */}
      {imageUrl && (
        <div className="mt-3">
          <figure className="image is-96x96 is-inline-block">
            <img
              className="is-rounded"
              src={imageUrl}
              alt="Profile preview"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </figure>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;