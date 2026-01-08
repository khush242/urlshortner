import { useState } from "react";
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
      className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-400"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyUrl;
