const handleFileUpload = (file, path, onUpload, setLoadingState) => {
  const formData = new FormData();
  formData.append("file", file);

  // Unsigned preset created in the new Cloudinary account.
  // Must match the preset name exactly in Cloudinary.
  formData.append("upload_preset", "wealthoracaresolutions");

  setLoadingState(true);

  fetch("https://api.cloudinary.com/v1_1/dszf8uvsn/image/upload", {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok || !data.secure_url) {
        throw new Error(
          data.error?.message || "Cloudinary did not return a public URL"
        );
      }
      return data;
    })
    .then((data) => {
      setLoadingState(false);
      onUpload(data.secure_url);
    })
    .catch((err) => {
      console.error("Error uploading image:", err);
      setLoadingState(false);
    });
};

export default handleFileUpload;
