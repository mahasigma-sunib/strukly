import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

export default function AddExpenseCamera() {

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = useRef<Webcam>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const capture = useCallback(
    async () => {
      if (webcamRef.current === null) return;
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) return;

      try {
        setIsUploading(true);

        // Convert base64 to blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();

        // Create FormData and append the image
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');

        // Send to backend
        const result = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/expenses/scan-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );

        console.log('Upload successful:', result.data);
        
        // Navigate to AddExpense with scanned data
        navigate('/expense/add', { state: { scannedData: result.data.transaction } });
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [navigate]
  );

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      {isUploading ?
        <p>Uploading...</p>
        :
        <button onClick={capture}>Capture photo</button>
      }
    </>
  );
}