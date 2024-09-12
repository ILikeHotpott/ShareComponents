import React, {useRef, useState, useEffect} from 'react';
import {Controller, Scene} from 'react-scrollmagic';
import {Tween, Timeline} from 'react-gsap';

const ChangeFilter = ({
                          width = '50vh',
                          height = '50vh',
                          duration = 1000,
                          image1,
                          image2,
                          direction = 'left'
                      }) => {
    const imageRef = useRef(null);
    const [clipPathValue, setClipPathValue] = useState(0);

    const updateClipPath = (progress) => {
        const newClipValue = Math.min(progress * 100, 100);
        setClipPathValue(newClipValue);
    };

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

    return (
        <Controller>
            <div>
                <Scene
                    triggerHook="onLeave"
                    duration={duration}
                    pin
                >
                    {(progress) => {
                        updateClipPath(progress);
                        return (
                            <div className="h-[100vh] w-full bg-white flex justify-center items-center">
                                <Timeline totalProgress={progress} paused>
                                    <Tween>
                                        <div className="relative" style={{width, height}}>
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
