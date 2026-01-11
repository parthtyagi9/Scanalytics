"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Copy,
  FileCode,
  Terminal,
  HardDrive,
  Download,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

interface SuccessClientProps {
  initialCode: string;
}

export default function SuccessClient({ initialCode }: SuccessClientProps) {
  const [code, setCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const run = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCode(initialCode);
    };

    run();
  });

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("SYSTEM: BYTES_COPIED_TO_CLIPBOARD");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-mono p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full z-10 space-y-8">
        {/* Header: Server File Status */}
        <div className="flex items-center justify-between border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 text-black">
              <HardDrive size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                Server_IO_Success
              </h1>
              <div className="flex items-center gap-2 opacity-40 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>STREAMED_FROM_LOCAL_STORAGE (fs.readFile)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant={"secondary"}>
                <ArrowRight />
                To Dashboard
              </Button>
            </Link>
            <Button
              onClick={copyToClipboard}
              className="font-bold rounded-none hover:bg-secondary transition-all px-8 border-2"
            >
              <Copy className="mr-2 w-4 h-4" /> Copy_Buffer
            </Button>
          </div>
        </div>

        {/* Code Workspace */}
        <div className="relative group">
          <div className="bg-secondary text-black text-[10px] font-bold px-4 py-2 uppercase inline-flex items-center gap-2">
            <FileCode size={14} />
            server_disk_source.ts
          </div>

          <ScrollArea className="h-[70vh] w-full border-2 border-secondary bg-card shadow-[12px_12px_0px_0px_rgba(255,255,255,0.03)]">
            <div className="p-8">
              <pre className="text-sm leading-relaxed text-white">
                {code ? (
                  <code>{code}</code>
                ) : (
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                )}
              </pre>
            </div>
          </ScrollArea>

          {/* Metadata Footer */}
          <div className="mt-4 flex justify-between items-center text-[10px] text-white/30 uppercase font-bold">
            <div className="flex gap-4">
              <span>Path: ./templates/base_analytics.ts</span>
              <span>Mode: Read_Only</span>
            </div>
            {code && (
              <span>Size: {(new Blob([code]).size / 1024).toFixed(2)} KB</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
