import { useState, useRef, useEffect } from 'react';
import { MoveHorizontal, Maximize2, ZoomIn, ZoomOut, X, MousePointerClick } from 'lucide-react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export default function ImageComparison({ beforeImage, afterImage }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [snapMode, setSnapMode] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const clampPanPosition = (x: number, y: number, currentZoom: number) => {
    if (currentZoom === 1) return { x: 0, y: 0 };
    
    if (!containerRef.current) return { x, y };
    
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = (rect.width * (currentZoom - 1)) / 2;
    const maxY = (rect.height * (currentZoom - 1)) / 2;
    
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  };

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    const scale = zoom;
    const offsetX = panPosition.x;
    
    const containerCenterX = rect.left + rect.width / 2;
    const relativeX = (clientX - containerCenterX - offsetX) / scale + rect.width / 2;
    
    const percentage = (relativeX / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingSlider(true);
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (snapMode) {
      handleDoubleClick(e);
      setSnapMode(false);
      return;
    }
    
    if (zoom > 1 && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ 
        x: e.clientX - panPosition.x, 
        y: e.clientY - panPosition.y 
      });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scale = zoom;
    const offsetX = panPosition.x;
    
    const containerCenterX = rect.left + rect.width / 2;
    const relativeX = (e.clientX - containerCenterX - offsetX) / scale + rect.width / 2;
    
    const percentage = (relativeX / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      } else if (isPanning) {
        const newX = e.clientX - panStart.x;
        const newY = e.clientY - panStart.y;
        const clamped = clampPanPosition(newX, newY, zoom);
        setPanPosition(clamped);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
    };

    if (isDraggingSlider || isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingSlider, isPanning, panStart, zoom]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(1, Math.min(4, zoom + delta));
    
    if (newZoom === 1) {
      setPanPosition({ x: 0, y: 0 });
    } else {
      const clamped = clampPanPosition(panPosition.x, panPosition.y, newZoom);
      setPanPosition(clamped);
    }
    
    setZoom(newZoom);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(4, zoom + 0.25);
    setZoom(newZoom);
    const clamped = clampPanPosition(panPosition.x, panPosition.y, newZoom);
    setPanPosition(clamped);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(1, zoom - 0.25);
    if (newZoom === 1) {
      setPanPosition({ x: 0, y: 0 });
    } else {
      const clamped = clampPanPosition(panPosition.x, panPosition.y, newZoom);
      setPanPosition(clamped);
    }
    setZoom(newZoom);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getCursor = () => {
    if (snapMode) return 'crosshair';
    if (isDraggingSlider) return 'col-resize';
    if (isPanning) return 'grabbing';
    if (zoom > 1) return 'grab';
    return 'default';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-xl shadow-2xl select-none bg-black"
      style={{ cursor: getCursor() }}
      onMouseDown={handleImageMouseDown}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
    >
      <div 
        className="absolute inset-0 will-change-transform"
        style={{ 
          transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
          transition: isPanning || isDraggingSlider ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-contain bg-black"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none">
            After
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-contain bg-black"
            draggable={false}
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none">
            Before
          </div>
        </div>

        <div
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize z-10"
            onMouseDown={handleSliderMouseDown}
            style={{ 
              pointerEvents: 'auto',
              marginTop: zoom > 1 ? `${-panPosition.y / zoom}px` : '0px'
            }}
          >
            <MoveHorizontal className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        <button
          onClick={() => setSnapMode(!snapMode)}
          className={`${snapMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black/70 hover:bg-black/90'} text-white p-2 rounded-lg backdrop-blur-sm transition-colors`}
          title="Snap Slider (click to activate, then click on image)"
        >
          <MousePointerClick className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {zoom > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm pointer-events-none z-20">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}