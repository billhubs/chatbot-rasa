import React, { useState, useEffect, useRef } from "react";

const widgetStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "280px",
  backgroundColor: "#1e1e1e",
  color: "#c5c6c7",
  fontFamily: "monospace",
  fontSize: "12px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  zIndex: 10000,
  userSelect: "none",
  cursor: "move",
  padding: "10px",
};

const headerStyle: React.CSSProperties = {
  fontWeight: "bold",
  marginBottom: "8px",
  borderBottom: "1px solid #45a29e",
  paddingBottom: "4px",
  color: "#66fcf1",
};

const flowItemStyle: React.CSSProperties = {
  marginBottom: "6px",
  padding: "4px",
  backgroundColor: "#0b0c10",
  borderRadius: "4px",
  border: "1px solid #45a29e",
};

const SystemFlowWidget: React.FC = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Example system flow states (these could be connected to real-time data)
  const [flowStates, setFlowStates] = useState({
    backend: "Idle",
    rasaAgent: "Waiting for input",
    llamaAgent: "Idle",
    randomForest: "Idle",
  });

  // Simulate flow changes for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStates((prev) => {
        const nextStates = { ...prev };
        if (prev.backend === "Idle") {
          nextStates.backend = "Processing user message";
          nextStates.rasaAgent = "Classifying intent";
          nextStates.randomForest = "Predicting intent";
          nextStates.llamaAgent = "Idle";
        } else if (prev.backend === "Processing user message") {
          nextStates.backend = "Waiting for response";
          nextStates.rasaAgent = "Routing to LLaMA fallback";
          nextStates.randomForest = "Idle";
          nextStates.llamaAgent = "Generating response";
        } else {
          nextStates.backend = "Idle";
          nextStates.rasaAgent = "Waiting for input";
          nextStates.randomForest = "Idle";
          nextStates.llamaAgent = "Idle";
        }
        return nextStates;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging && dragStart.current) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    dragStart.current = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div
      ref={widgetRef}
      style={{ ...widgetStyle, left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
      title="Drag to move"
    >
      <div style={headerStyle}>System Flow Monitor</div>
      <div style={flowItemStyle}>
        <strong>Backend:</strong> {flowStates.backend}
      </div>
      <div style={flowItemStyle}>
        <strong>Rasa Agent:</strong> {flowStates.rasaAgent}
      </div>
      <div style={flowItemStyle}>
        <strong>Random Forest ML:</strong> {flowStates.randomForest}
      </div>
      <div style={flowItemStyle}>
        <strong>LLaMA Agent:</strong> {flowStates.llamaAgent}
      </div>
    </div>
  );
};

export default SystemFlowWidget;
