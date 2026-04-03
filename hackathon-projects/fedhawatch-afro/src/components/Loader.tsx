import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f2a44] text-white">

      {/* Logo / Title */}
      <div className="flex items-center gap-3 mb-10">
        <Eye size={36} className="text-orange-500" />
        <h1 className="text-4xl font-bold tracking-wide">FedhaWatch</h1>
      </div>

      <p className="text-gray-300 mb-12 text-lg">
        Revealing the Shadow Budget
      </p>

      {/* Loader Box */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-8 w-96 text-center">

        <h2 className="text-lg mb-6 text-gray-200">Loading System</h2>

        {/* Progress Tube */}
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-orange-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <p className="text-xl font-semibold text-orange-400">
          {progress}%
        </p>

      </div>
    </div>
  );
};

export default Loader;