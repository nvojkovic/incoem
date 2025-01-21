import { useEffect, useRef } from "react";

const ExternalDocs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.18.2/swagger-ui.css";
    document.head.appendChild(link);

    // Add and load script
    const script = document.createElement("script");
    script.src = "//unpkg.com/swagger-ui-dist/swagger-ui-bundle.js";
    script.async = true;
    const win: any = window;

    script.onload = () => {
      win.SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",
        presets: [
          win.SwaggerUIBundle.presets.apis,
          win.SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
      });
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-screen" ref={containerRef}>
      <div id="swagger-ui" />
    </div>
  );
};

export default ExternalDocs;
