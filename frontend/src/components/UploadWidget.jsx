import { useEffect, useRef } from "react";

const UploadWidget = ({
  imageUrl,
  setImageUrl,
  folder = "user-profiles",
  buttonText = "Upload Profile Image",
  altText = "Profile preview",
  previewClass = "is-96x96" // default preview size
}) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dcwwflklx", // your Cloudinary cloud name
        uploadPreset: "everest_user_profile", // your unsigned preset
        folder, // dynamic folder
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

  const openWidget = () => {
    widgetRef.current?.open();
  };

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
          <figure className={`image ${previewClass} is-inline-block`}>
            <img
              className="is-rounded"
              src={imageUrl}
              alt={altText}   //use altText prop here
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </figure>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;