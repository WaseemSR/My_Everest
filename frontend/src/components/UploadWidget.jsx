import { useEffect, useRef } from "react";

const UploadWidget = ({
  imageUrl,
  setImageUrl,
  folder = "user-profiles",
  buttonText = "Upload Image",
  altText = "Preview",
  previewStyle = {}, // custom width/height or shape
}) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dcwwflklx",
        uploadPreset: "everest_user_profile",
        folder,
        cropping: true,
        multiple: false,
      },
      function (error, result) {
        if (!error && result?.event === "success") {
          console.log("Upload successful:", result.info);
          setImageUrl(result.info.secure_url);
        }
      }
    );
  }, [setImageUrl, folder]);

  const openWidget = () => widgetRef.current?.open();

  return (
    <div className="has-text-centered mt-5 mb-5">
      <button
        type="button"
        className="button is-my-green is-small has-text-white"
        onClick={openWidget}
      >
        {buttonText}
      </button>

      {imageUrl && (
        <div className="mt-3">
          <figure className="image is-inline-block" style={{ ...previewStyle }}>
            <img
              src={imageUrl}
              alt={altText}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </figure>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;