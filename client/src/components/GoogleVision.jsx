import axios from "axios";
import { useState } from "react";

export default function GoogleVision({ onHandleText }) {
  const [previewSource, setPreviewSource] = useState("");
  const [fileName, setFileName] = useState("");
  const handleFileInput = (event) => {
    const imageFile = event.currentTarget.files;
    if (imageFile) {
      previewFile(imageFile[0]);
    }
  };

  const previewFile = (file) => {
    const readerUrl = new FileReader();
    readerUrl.readAsDataURL(file);
    readerUrl.onloadend = () => {
      if (typeof readerUrl.result === "string") {
        setPreviewSource(readerUrl.result);
      }
    };

    const readerBuffer = new FileReader();
    readerBuffer.readAsArrayBuffer(file);
    readerBuffer.onloadend = () => {
      setFileName(file.name);
    };
  };

  const handleSubmitFile = async (event) => {
    event.preventDefault();
    if (!previewSource) {
      return;
    }
    await uploadImage(previewSource);
  };

  const uploadImage = async (previewSource) => {
    try {
      // upload
      const base64Response = await fetch(previewSource);
      const blob = await base64Response.blob();

      const signedUrl = await uploadToCloudinary(blob, fileName);

      const { data } = await axios.post("/api/vision", { signedUrl });

      const googleVisionData = data.text.split('\n').join(" ");;

      onHandleText(googleVisionData);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadToCloudinary = async (file, fileName) => {
    // get signature
    const signatureRes = await fetch("/api/cloudSignature", {
      method: "GET",
      redirect: "follow",
    });

    const { timestamp, signature, key, cloudName } = await signatureRes.json();

    // upload to cloudinary
    const formdata = new FormData();
    formdata.append("file", file, fileName);

    const signedRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?api_key=${key}&signature=${signature}&timestamp=${timestamp}`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    const { secure_url } = await signedRes.json();

    return secure_url;
  };

  return (
    <div className="container create-page">
      <form onSubmit={handleSubmitFile}>
        <fieldset>
          <div className="form-group">
            <label htmlFor="image-upload">File input</label>
            <input
              type="file"
              className="form-control-file"
              id="image-upload"
              aria-describedby="fileHelp"
              onChange={handleFileInput}
            />
          </div>
        </fieldset>
        <div className="image-analysis-button">
          <button
            type="submit"
            className="btn btn-primary image-analysis"
            onClick={handleSubmitFile}
            style = {{margin: "20px  0px"}}
          >
            AI Image Analysis
          </button>
        </div>
      </form>
      {previewSource && (
        <img
          src={previewSource}
          alt="image preview"
          style={{ height: "100px" ,display:"flex", alignItems: "center", justifyContent:"center", margin:"auto" }}
        />
      )}
    </div>
  );
}
