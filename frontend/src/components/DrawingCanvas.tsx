import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import "./canvas.css";

export const pusher = new Pusher("aeebbaeff97d07c436be", {
  cluster: "ap2",
});
interface DrawingCanvasProps {
  isDrawingEnabled: boolean;
  roomId: string;
  currentUserDrawingBool:boolean;
}

const colors = [
  "#FFFFFF",
  "#C0C0C0",
  "#808080",
  "#000000",
  "#FF0000",
  "#800000",
  "#FFFF00",
  "#808000",
  "#00FF00",
  "#008000",
  "#00FFFF",
  "#008080",
  "#0000FF",
  "#000080",
  "#FF00FF",
  "#800080",
  "#834d1d",
  "#83671d",
  "#83801d",
  "#6c831d",
  "#53831d",
  "#39831d",
  "#561d83",
  "#6f1d83",
  "#831d7d",
  "#831d64",
];

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isDrawingEnabled,roomId,currentUserDrawingBool }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);

  useEffect(() => {
    // console.log("ROOMID in canvas",roomId)
    const channel = pusher.subscribe(roomId);
    channel.bind(
      "draw-event",
      (data: {
        x: number;
        y: number;
        type: string;
        color: string;
        lineWidth: number;
      }) => {
        drawLine(data.x, data.y, data.type, false, data.color, data.lineWidth);
      }
    );

    channel.bind("clear-event", () => {
      clearCanvas(false);
    });

    channel.bind("word-chosen", ()=>{
      clearCanvas(true)
    });

    channel.bind("fill-event", (data: { color: string }) => {
      fillCanvas(data.color, false);
    });
    return () => {
      channel.unbind("draw-event");
      channel.unbind("clear-event");
      channel.unbind("fill-event");
      channel.unbind("word-chosen");
      pusher.unsubscribe(roomId);
    };
  }, []);
  
  const drawLine = (
    x: number,
    y: number,
    type: string,
    emit: boolean,
    colorParam: string = color,
    lineWidthParam: number = lineWidth
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = colorParam;
    ctx.lineWidth = lineWidthParam;

    if (type === "start") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (type === "move") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (type === "end") {
      ctx.closePath();
    }

    if (!emit) return;
  };

  const drawApi = (
    x: number,
    y: number,
    type: string,
    emit: boolean,
    colorParam: string = color,
    lineWidthParam: number = lineWidth
  ) => {
    console.log("emit in Play.tsx at line 118 : ",emit)
    fetch("/api/draw/draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x,
        y,
        type,
        color: colorParam,
        lineWidth: lineWidthParam,
        roomId
      }),
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(currentUserDrawingBool){
      saveState();
      setIsDrawing(true);
      const { offsetX, offsetY } = e.nativeEvent;
      drawApi(offsetX, offsetY, "start", true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(currentUserDrawingBool){
      if (!isDrawing) return;
      const { offsetX, offsetY } = e.nativeEvent;
      drawApi(offsetX, offsetY, "move", true);
    }
  };

  const handleMouseUp = () => {
    if(currentUserDrawingBool){
      setIsDrawing(false);
      drawApi(0, 0, "end", true);
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setUndoStack([
      ...undoStack,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);
  };

  const clearCanvas = (emit: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (emit) {
      fetch("/api/draw/clear", { method: "POST" ,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({roomId}),
      },
      );
    }
  };

  const fillCanvas = (color: string, emit: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (emit) {
      fetch("/api/draw/fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color,roomId }),
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if(currentUserDrawingBool){
      const newLineWidth = lineWidth + Math.sign(e.deltaY);
    if (newLineWidth >= 2 && newLineWidth <= 20) {
      setLineWidth(newLineWidth);
    }
    }
  };

  return (
    <div className="flex flex-col items-center m-2">
      <canvas
        ref={canvasRef}
        width={720}
        height={420}
        className={`${isDrawingEnabled ? "enabled" : "disabled"} border-2 rounded-md max-w-full h-auto shadow-2xl lg:h-full lg:w-full`}
        style={currentUserDrawingBool?{cursor: "url('/img/pen.gif'),auto" }:{}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
      {currentUserDrawingBool && (
        <div className="flex justify-center items-center rounded-t-md p-2 mt-2 bg-gray-200 w-full">
        <div className="flex items-center gap-2">
          <div className="flex">
            <button
              className="w-16 h-16 rounded-md border-4 border-gray-500"
              style={{ backgroundColor: color }}
            ></button>
          </div>
          <div className="grid grid-cols-13 w-full">
            {colors.map((c, index) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                className={`color-button ${color === c ? "selected" : ""} ${index === 0
                  ? "rounded-tl-md"
                  : index === 12
                    ? "rounded-tr-md"
                    : index === 13
                      ? "rounded-bl-md"
                      : index === 25
                        ? "rounded-br-md"
                        : ""
                  }`}
              ></button>
            ))}
          </div>
          <div className="flex text-black ">
            <div
              className="w-16 h-16 rounded-md border-4 border-gray-500"
              style={{
                backgroundSize: `${lineWidth * 3.7778}%`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: "url('/img/size.gif')",
                filter: "brightness(0) drop-shadow(3px 3px 0 rgba(0, 0, 0, .3))",
              }}
            ></div>
          </div>
        </div>
      </div>
      )}
      {currentUserDrawingBool && (
        <div className="flex bg-gray-200 rounded-b-md w-full justify-center items-center">
        <div className="flex flex-col items-center w-full mt-2 lg:mt-0 lg:w-1/3">
          <div className="flex mt-2 space-x-2">
            <button 
              onClick={() => clearCanvas(true)}
              className="w-14 h-14 p-1 rounded-md bg-gray-300 border border-black clear"
              style={{ backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundImage: "url('/img/clear.gif')" }}
            >
            </button>
            <button
              onClick={() => fillCanvas(color, true)}
              className="fill w-14 h-14 rounded-md p-2 bg-gray-300 border border-black "
              style={{ backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundImage: "url('/img/fill.gif')" }}
            >
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};


export default DrawingCanvas;
