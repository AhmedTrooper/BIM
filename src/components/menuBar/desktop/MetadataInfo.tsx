import { useApplicationStore } from "@/store/ApplicationStore";
import { open } from "@tauri-apps/plugin-shell";
import { Download } from "lucide-react";

export default function MetadataInfo() {
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);

  if (!updateMetadata) return null;
  
  return (
    <div className="w-40 sm:w-60 md:w-80 p-2 grid gap-2">
      <h1>Current : {updateMetadata.application.version.current}</h1>
      <h1>
        Available :{" "}
        <span className="text-red-600">{updateMetadata.application.version.online}</span>
      </h1>

      {updateMetadata.application.updateUrl && (
        <button
          onClick={() => open(updateMetadata.application.updateUrl!)}
          className="flex gap-2 bg-green-600 rounded-lg p-2 hover:bg-green-700 transition-colors cursor-pointer"
        >
          <Download />
          Download
        </button>
      )}
    </div>
  );
}
