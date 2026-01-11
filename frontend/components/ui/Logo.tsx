import { ScanSearchIcon } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center justify-center gap-2">
        <ScanSearchIcon />
        <h1 className="text-2xl font-bold">Scanalytics</h1>
      </div>
    </Link>
  );
}
