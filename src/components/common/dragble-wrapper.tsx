import React, { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChevronUp } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import MinimizeOutlinedIcon from "@mui/icons-material/MinimizeOutlined";
// import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
// import { animate } from "motion/react";

interface DraggableWrapperProps {
  children: ReactNode;
  title?: string;
  className?: string;
  defaultPosition?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onFullScreenChange?: (isFullScreen: boolean) => void;
  onMinimizeChange?: (isMinimized: boolean) => void;
  width?: string;
  height?: string;
  customWidth?: number,
  customHeight?: number,
  fullScreenWidth?: string;
  fullScreenHeight?: string;
  closeButton?: ReactNode;
  maximizeButton?: ReactNode;
  minimizeButton?: ReactNode;
  restoreButton?: ReactNode;
  headerContent?: ReactNode;
  externalFullScreen?: boolean;
  externalMinimized?: boolean;
}

type ResizeHandle = "s" | "e" | "w" | "se" | "sw" | null;

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  title,
  className = "",
  defaultPosition = { x: 0, y: 0 },
  onPositionChange,
  onFullScreenChange,
  onMinimizeChange,
  width = "w-64",
//   height = "h-64",
  customWidth = 530,
  customHeight = 550,
  fullScreenWidth = "100%",
  fullScreenHeight = "100%",
  headerContent,
  closeButton = <CloseIcon sx={{ fontSize: "16px" }} />,
  maximizeButton = <SquareOutlinedIcon sx={{ fontSize: "16px" }} />,
  minimizeButton = <MinimizeOutlinedIcon sx={{ fontSize: "16px" }} />,
  restoreButton = <></>,
  externalFullScreen,
  externalMinimized,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [lastPosition, setLastPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [customSize, setCustomSize] = useState<{
    width?: number;
    height?: number;
  }>({ width: customWidth, height:  customHeight});
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync external fullscreen state
  useEffect(() => {
    if (externalFullScreen !== undefined && externalFullScreen !== isFullScreen) {
      if (externalFullScreen) {
        setLastPosition(position);
      } else {
        setPosition(lastPosition);
        onPositionChange?.(lastPosition);
      }
      setIsFullScreen(externalFullScreen);
    }
  }, [externalFullScreen]);

  // Sync external minimized state
  useEffect(() => {
    if (externalMinimized !== undefined && externalMinimized !== isMinimized) {
      setIsMinimized(externalMinimized);
    }
  }, [externalMinimized]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (cardRef.current && !isFullScreen && !isMinimized) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const startX = e.clientX - position.x;
        const startY = e.clientY - position.y;

        const onMouseMove = (e: MouseEvent) => {
          let newX = e.clientX - startX;
          let newY = e.clientY - startY;

          // Boundary checks
          newX = Math.max(0, Math.min(newX, viewportSize.width - cardRect.width));
          newY = Math.max(0, Math.min(newY, viewportSize.height - cardRect.height));

          const newPosition = { x: newX, y: newY };
          setPosition(newPosition);
          setLastPosition(newPosition);
          onPositionChange?.(newPosition);
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          setIsDragging(false);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        setIsDragging(true);
      }
    },
    [position, isFullScreen, isMinimized, viewportSize, onPositionChange]
  );

  const startResize = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      if (!isFullScreen && !isMinimized && cardRef.current) {
        e.stopPropagation(); // Prevent dragging when resizing
        const startX = e.clientX;
        const startY = e.clientY;
        const rect = cardRef.current.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startPosition = { ...position };

        const onMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          let newWidth = startWidth;
          let newHeight = startHeight;
          let newX = startPosition.x;
          let newY = startPosition.y;

          // Handle resizing based on the edge being dragged
          switch (handle) {
            case "e":
              newWidth = Math.max(200, startWidth + deltaX);
              break;
            case "w":
              newWidth = Math.max(200, startWidth - deltaX);
              newX = startPosition.x + startWidth - newWidth;
              break;
            case "s":
              newHeight = Math.max(100, startHeight + deltaY);
              break;
            case "se":
              newWidth = Math.max(200, startWidth + deltaX);
              newHeight = Math.max(100, startHeight + deltaY);
              break;
            case "sw":
              newWidth = Math.max(200, startWidth - deltaX);
              newHeight = Math.max(100, startHeight + deltaY);
              newX = startPosition.x + startWidth - newWidth;
              break;
          }

          // Boundary checks
          if (newX < 0) {
            newWidth += newX;
            newX = 0;
          }
          if (newY < 0) {
            newHeight += newY;
            newY = 0;
          }
          if (newX + newWidth > viewportSize.width) {
            newWidth = viewportSize.width - newX;
          }
          if (newY + newHeight > viewportSize.height) {
            newHeight = viewportSize.height - newY;
          }

          setCustomSize({ width: newWidth, height: newHeight });
          setPosition({ x: newX, y: newY });
          onPositionChange?.({ x: newX, y: newY });
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          setIsResizing(null);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        setIsResizing(handle);
      }
    },
    [isFullScreen, isMinimized, onPositionChange, position, viewportSize.width, viewportSize.height]
  );

  const toggleFullScreen = useCallback(() => {
    if (isMinimized) {
      setIsMinimized(false);
      onMinimizeChange?.(false);
    } else {
      if (!isFullScreen) {
        setLastPosition(position);
      } else {
        setPosition(lastPosition);
        onPositionChange?.(lastPosition);
      }
      setIsFullScreen(!isFullScreen);
      onFullScreenChange?.(!isFullScreen);
    }
  }, [isFullScreen, isMinimized, lastPosition, position, onFullScreenChange, onMinimizeChange, onPositionChange]);

  const toggleMinimize = useCallback(() => {
    if (isFullScreen) {
      setIsFullScreen(false);
      setPosition(lastPosition);
      onPositionChange?.(lastPosition);
      onFullScreenChange?.(false);
    }
    setIsMinimized(!isMinimized);
    onMinimizeChange?.(!isMinimized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen, lastPosition, onFullScreenChange, onMinimizeChange, onPositionChange]);

  const toggleClose = useCallback(() => {
    if (isFullScreen) {
      setIsFullScreen(false);
      setPosition(lastPosition);
      onPositionChange?.(lastPosition);
      onFullScreenChange?.(false);
    }
    setIsMinimized(!isMinimized);
    onMinimizeChange?.(!isMinimized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen, lastPosition, onFullScreenChange, onMinimizeChange, onPositionChange]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        toggleFullScreen();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullScreen, toggleFullScreen]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  const renderHeader = () => {
    if (headerContent) {
      return headerContent;
    }

    return (
      <CardHeader className="flex flex-row items-center justify-between space-x-2 p-0 px-0">
        <div className="flex flex-row items-center space-x-2 p-0 px-0">
          {/* <div onClick={()=>{}}><ArrowBackOutlinedIcon sx={{ fontSize: "16px" }} /> </div>
            <div onClick={()=>{}}><ArrowBackOutlinedIcon sx={{ fontSize: "16px" }} /></div> */}
        </div>
        <div className="flex space-x-5 px-2.5 py-1">
          {title && <CardTitle className="translate-y-1 truncate text-xs">{title}</CardTitle>}
          {minimizeButton && <div onClick={toggleMinimize}>{minimizeButton}</div>}
          {maximizeButton && <div onClick={toggleFullScreen}>{maximizeButton}</div>}
          {closeButton && <div onClick={toggleClose}>{closeButton}</div>}
        </div>
      </CardHeader>
    );
  };

  const resizeHandles = [
    {
      handle: "s",
      className: "absolute bottom-0 left-0 right-0 h-1 cursor-s-resize",
    },
    {
      handle: "e",
      className: "absolute top-0 right-0 bottom-0 w-1 cursor-e-resize",
    },
    {
      handle: "w",
      className: "absolute top-0 left-0 bottom-0 w-1 cursor-w-resize",
    },
    {
      handle: "se",
      className: "absolute bottom-0 right-0 h-2 w-2 cursor-se-resize",
    },
    {
      handle: "sw",
      className: "absolute bottom-0 left-0 h-2 w-2 cursor-sw-resize",
    },
  ];

  // useEffect(() => {
  //     const box = cardRef.current;
  //     if (!box) return;

  //     const currentWidth = box.offsetWidth;
  //     const currentHeight = box.offsetHeight;

  //     animate(
  //      box,
  //       {
  //         width: isFullScreen ? "100%" : 384,
  //         height: isFullScreen ? "100%" : 384,
  //         left: isFullScreen ? 0 : `${position.x}px`,
  //         top: isFullScreen ? 0 : `${position.y}px`,
  //         // opacity: isFullScreen ? 1 : 0,
  //       },
  //       {
  //         duration: 0.2,
  //       }
  //     );
  //   }, [isFullScreen]);

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          position: "fixed",
          left: isFullScreen ? 0 : position.x,
          top: isFullScreen ? 0 : position.y,
          width: isFullScreen ? fullScreenWidth : customSize.width,
          height: isFullScreen ? fullScreenHeight : customSize.height,
          padding: "0px",
          touchAction: "none",
          display: isMinimized ? "none" : "block",
        }}
      >
        <Card
          className={cn(
            "flex flex-col z-50 select-none transition-shadow gap-0 overflow-hidden",
            (isDragging || isResizing) && !isFullScreen && "shadow-lg",
            isFullScreen ? "h-full w-full" : `${width} h-full`,
            className,
            isFullScreen && "rounded-none"
          )}
          style={!isFullScreen ? { height: customSize.height ? `${customSize.height}px` : undefined } : undefined}
        >
          <div onPointerDown={onMouseDown} className="cursor-move">
            {renderHeader()}
          </div>
          <CardContent className="relative flex-1 min-h-0 p-0">
            {children}
            {!isFullScreen &&
              !isMinimized &&
              resizeHandles.map(({ handle, className }) => (
                <div
                  key={handle}
                  className={cn("bg-transparent hover:bg-gray-200", className)}
                  onPointerDown={(e) => startResize(e, handle as ResizeHandle)}
                />
              ))}
          </CardContent>
        </Card>
      </div>

      {isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          {restoreButton && <div onClick={() => setIsMinimized(false)}>{restoreButton}</div>}
        </div>
      )}
    </div>
  );
};

export default DraggableWrapper;
