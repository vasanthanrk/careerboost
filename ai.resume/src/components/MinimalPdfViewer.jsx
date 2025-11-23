import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function MinimalPdfViewer({ pdfData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!pdfData) return;

    const container = containerRef.current;
    container.innerHTML = ""; // clear previous pages

    const loadingTask = pdfjsLib.getDocument({ data: pdfData });

    loadingTask.promise.then(async (pdf) => {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 1.3 });

        const canvas = document.createElement("canvas");
        canvas.className = "shadow-md mx-auto mt-2";
        canvas.style.pointerEvents = "none"; // block all interactions
        canvas.style.userSelect = "none";

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        container.appendChild(canvas);

        page.render({ canvasContext: context, viewport });
      }
    });

  }, [pdfData]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto bg-gray-100 p-4 rounded"
      onContextMenu={(e) => e.preventDefault()} // no right click
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
      }}
    ></div>
  );
}
