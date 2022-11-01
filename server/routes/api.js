const vision = require("@google-cloud/vision");
const router = require("express").Router();
const { cloudinary, createImageUpload } = require("../utils/cloudinary");

const multer = require("multer");
const upload = multer({ dest: "img/" });

router.get("/api/cloudSignature", async (req, res) => {
  const uploadSignature = await createImageUpload();

  res.json(uploadSignature);
});

router.post("/api/upload", upload.single("image"), async (req, res) => {
  cloudinary.uploader
    .upload(req.file, {
      upload_preset: "speech_app",
    })
    .then((response) => {
      res.json({
        url: response.secure_url,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Image upload failed",
        error: error,
        success: false,
      });
    });
});

router.post("/api/vision", async (req, res) => {
  // // get data url
  const { signedUrl } = req.body;

  console.log(signedUrl);
  // // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs text detection on the local file
  const [result] = await client.textDetection(signedUrl);

  console.log(result);

  const detections = result.textAnnotations;

  const textArray = detections.map((data) => data.description);

  res.json({ success: true, text: textArray[0] });
});

module.exports = router;
