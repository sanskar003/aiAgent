// components/MermaidViewer.tsx
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false });

export default function MermaidViewer({ chart, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      try {
        mermaid.render("mermaid-diagram", chart, (svgCode) => {
          containerRef.current.innerHTML = svgCode;
        });
      } catch (err) {
        containerRef.current.innerHTML = `<pre class="text-red-500">Mermaid render error:\n${err.message}</pre>`;
      }
    }
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-renderer bg-white/5 border border-white/10 rounded-xl p-4 shadow-md overflow-x-auto ${className}`}
    />
  );
}