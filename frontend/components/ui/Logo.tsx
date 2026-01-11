import { ScanSearchIcon } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <ScanSearchIcon />
      <h1 className="text-2xl font-bold">Scanalytics</h1>
    </div>
  );
}
