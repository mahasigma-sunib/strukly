import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import AddIcon from "../components/icons/AddIcon";

export default function AddExpenseCamera() {
  const webcamRef = useRef<Webcam>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment", // 👈 better for receipts
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

        <div className="text-white text-xl absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
          <button onClick={() => navigate(-1)}>✕</button>
          <p className="font-semibold">Scan Receipt</p>
          <div className="w-6" />
        </div>


        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-50">
          <div
            className="flex items-center justify-center  bg-[#FFC606] border-6 border-[#FFE432] rounded-full shadow-[0_5px_0_0_#FFAA28] active:shadow-none active:translate-y-1 transition-all duration-100"
            onClick={capture}
          >
            <AddIcon width={50} height={50} />
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold animate-pulse">
            Scanning receipt...
          </div>
        </div>
      )}
    </div>
  );
}
