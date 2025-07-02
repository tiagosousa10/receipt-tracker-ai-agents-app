"use client";

import { useUser } from "@clerk/clerk-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const PDFDropzone = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const router = useRouter();

  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    featureUsage,
    featureAllocation,
  } = useSchematicEntitlement("scans");
  console.log("🚀 ~ PDFDropzone ~ featureUsage:", featureUsage);
  console.log("🚀 ~ PDFDropzone ~ isFeatureEnabled:", isFeatureEnabled);
  console.log("🚀 ~ PDFDropzone ~ featureAllocation:", featureAllocation);
  console.log("🚀 ~ PDFDropzone ~ featureUsageExceeded:", featureUsageExceeded);

  //set up sensors for drag and drop
  const sensors = useSensors(useSensor(PointerSensor));

  //handle file drop via native browser events for better PDF support
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    console.log("dropped");
  }, []);

  //   const canUpload = isUserSignedIn && isFeatureEnabled;
  const canUpload = true;

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto bg-red-400">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"} ${!canUpload ? "opacity-70 cursor-not-allowed" : ""} `}
        ></div>
      </div>
    </DndContext>
  );
};

export default PDFDropzone;
