"use client";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useCallback, useState } from "react";

const PDFDropzone = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  //set up sensors for drag and drop
  const sensors = useSensors(useSensor(PointerSensor));

  //handle file drop via native browser events for better PDF support
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

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
