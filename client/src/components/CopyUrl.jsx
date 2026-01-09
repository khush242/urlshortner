import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const CopyUrl = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Url copied")
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 p-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
        copied
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
      }`}
    >
      {copied ? (
        <>
          <Check size={18} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={18} />
          Copy
        </>
      )}
    </button>
  );
};

export default CopyUrl;
