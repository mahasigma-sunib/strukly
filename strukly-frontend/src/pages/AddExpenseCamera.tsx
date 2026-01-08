import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
// import AddIcon from "../components/icons/AddIcon";
import CameraIcon from "../components/utilityIcons/CameraIcon";

export default function AddExpenseCamera() {
  const webcamRef = useRef<Webcam>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      setIsUploading(true);

      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "receipt.jpg");

      const result = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/scan-image`,
        formData,
        { withCredentials: true }
      );

      navigate("/expense/add", {
        state: { scannedData: result.data.transaction },
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 to-transparent z-10" />

        <div className="text-white text-xl absolute top-0 left-0 right-0 p-5 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
          <button onClick={() => navigate(-1)}>✕</button>
          <p className="font-semibold">Scan Receipt</p>
          <div className="w-6" />
        </div>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-50">
          <div
            className="flex items-center justify-center rounded-full shadow-[0_6px_0_0_#ee9f02] active:shadow-none active:translate-y-1 transition-all duration-100"
            onClick={capture}
          >
            <CameraIcon className="text-[#FFC606]" width={64} height={64} />
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col gap-10 items-center justify-center z-50">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-400 animate-bounce" />
            <div className="w-4 h-4 rounded-full bg-orange-400 animate-bounce [animation-delay:-.3s]" />
            <div className="w-4 h-4 rounded-full bg-orange-400 animate-bounce [animation-delay:-.5s]" />
          </div>
          <div className="flex flex-col items-center justify-center mx-20 gap-3">
            <p className="text-white text-xl font-semibold animate-pulse">
              Scanning Receipt
            </p>
            <p className="text-gray-300 text-sm text-center">
              Please wait a moment while we're reading your receipt
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
