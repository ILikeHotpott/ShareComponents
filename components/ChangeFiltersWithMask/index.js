import React, { useRef, useState, useEffect } from 'react';
import { Controller, Scene } from 'react-scrollmagic';
import { Tween, Timeline } from 'react-gsap';

const ChangeFilter = ({
  width = '100%',
  height = '100%',
  duration = 1500,
  image1,
  image2,
  direction = 'left',
  holeDuration = 750,
  showBar = false,
}) => {
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const [clipPathValue, setClipPathValue] = useState(0);
  const [holeRadius, setHoleRadius] = useState(250);

  const updateHoleAndClipPath = (progress) => {
    const holeDurationFraction = holeDuration / duration;
    const holeProgress = Math.min(progress / holeDurationFraction, 1);
    const imageProgress = Math.max((progress - holeDurationFraction) / (1 - holeDurationFraction), 0);

    if (holeProgress < 1) {
      const newRadius = 250 + holeProgress * (1750 - 350);
      setHoleRadius(newRadius);
      setClipPathValue(0);
    } else {
      const newClipValue = imageProgress * 100;
      setClipPathValue(newClipValue);
      setHoleRadius(250 + (1750 - 350));
    }
  };

  useEffect(() => {
    if (overlayRef.current) {
      const radius = holeRadius;
      const maskImage = `radial-gradient(circle ${radius}px at 70% 50%, transparent 0%, black 100%)`;
      overlayRef.current.style.backgroundColor = 'black';
      overlayRef.current.style.maskImage = maskImage;
      overlayRef.current.style.webkitMaskImage = maskImage;
    }
  }, [holeRadius]);

  useEffect(() => {
    if (imageRef.current) {
      let clipPath;
      switch (direction) {
        case 'top':
          clipPath = `inset(${clipPathValue}% 0 0 0)`;
          break;
        case 'bottom':
          clipPath = `inset(0 0 ${clipPathValue}% 0)`;
          break;
        case 'right':
          clipPath = `inset(0 0 0 ${clipPathValue}%)`;
          break;
        case 'left':
        default:
          clipPath = `inset(0 ${clipPathValue}% 0 0)`;
          break;
      }
      imageRef.current.style.clipPath = clipPath;
    }
  }, [clipPathValue, direction]);

  const getBarStyle = () => {
  const fixedBarWidth = '20px';
  const fixedBarWidthPx = parseFloat(fixedBarWidth);
  const baseStyle = {
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 40,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
  };

  const isVisible = clipPathValue > 0 && clipPathValue < 100;
  const opacity = isVisible ? 1 : 0;

  const offset = 5;

  if (direction === 'left') {
    const left = `calc(${100 - clipPathValue}% - ${fixedBarWidthPx * ((100 - clipPathValue) / 100)}px - ${offset}px)`;
    return {
      ...baseStyle,
      width: fixedBarWidth,
      height: '100%',
      top: 0,
      left,
      opacity,
    };
  } else if (direction === 'right') {
    const left = `calc(${clipPathValue}% - ${fixedBarWidthPx * (clipPathValue / 100)}px - ${offset}px)`;
    return {
      ...baseStyle,
      width: fixedBarWidth,
      height: '100%',
      top: 0,
      left,
      opacity,
    };
  } else if (direction === 'top') {
    const top = `calc(${clipPathValue}% - ${fixedBarWidthPx * (clipPathValue / 100)}px - ${offset}px)`;
    return {
      ...baseStyle,
      height: fixedBarWidth,
      width: '100%',
      left: 0,
      top,
      opacity,
    };
  } else if (direction === 'bottom') {
    const top = `calc(${100 - clipPathValue}% - ${fixedBarWidthPx * ((100 - clipPathValue) / 100)}px - ${offset}px)`;
    return {
      ...baseStyle,
      height: fixedBarWidth,
      width: '100%',
      left: 0,
      top,
      opacity,
    };
  }
};


  return (
    <Controller>
      <div>
        <Scene
          triggerHook="onLeave"
          duration={duration}
          pin
          triggerElement="#change-filter-trigger"
        >
          {(progress) => {
            updateHoleAndClipPath(progress);
            return (
              <div
                id="change-filter-trigger"
                className="h-[100vh] w-full bg-white flex justify-center items-center"
              >
                <Timeline totalProgress={progress} paused>
                  <Tween>
                    <div className="relative" style={{ width, height }}>
                      <img
                        ref={imageRef}
                        className="image first absolute z-20 w-full h-full"
                        src={image1}
                        alt="First"
                      />
                      <img
                        className="image second absolute z-10 w-full h-full"
                        src={image2}
                        alt="Second"
                      />
                      <div
                        ref={overlayRef}
                        className="absolute z-30 w-full h-full pointer-events-none"
                        style={{
                          backgroundColor: 'black',
                          maskImage: `radial-gradient(circle ${holeRadius}px at 70% 50%, transparent 0%, black 100%)`,
                          WebkitMaskImage: `radial-gradient(circle ${holeRadius}px at 70% 50%, transparent 0%, black 100%)`,
                        }}
                      />
                      {showBar && (
                        <div
                          className="black-bar"
                          style={getBarStyle()}
                        />
                      )}
                    </div>
                  </Tween>
                </Timeline>
              </div>
            );
          }}
        </Scene>
      </div>
    </Controller>
  );
};

export default ChangeFilter;
