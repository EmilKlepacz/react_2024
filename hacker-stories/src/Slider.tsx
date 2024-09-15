import styled from "styled-components";
import * as React from "react";

const StyledSlider = styled.div`
    position: relative;
    border-radius: 3px;
    background: #dddddd;
    height: 15px;
`;

const StyledThumb = styled.div`
    width: 10px;
    height: 25px;
    border-radius: 3px;
    position: relative;
    top: -5px;
    opacity: 0.5;
    background: #823eb7;
    cursor: pointer;
`;


const getPercentage = (current: number, max: number) => (100 * current) / max;

const getLeft = (percentage: number) => `calc(${percentage}% - 5px)`;

const Slider = () => {
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);

    const diff = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent) => {
        let newX =
            event.clientX -
            diff.current -
            sliderRef.current.getBoundingClientRect().left;

        const end = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;

        const start = 0;

        if (newX < start) {
            newX = 0;
        }

        if (newX > end) {

            newX = end;
        }

        const newPercentage = getPercentage(newX, end);

        thumbRef.current.style.left = getLeft(newPercentage);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        diff.current =
            event.clientX - thumbRef.current.getBoundingClientRect().left;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            <StyledSlider ref={sliderRef}>
                <StyledThumb ref={thumbRef} onMouseDown={handleMouseDown}/>
            </StyledSlider>
        </>
    );
};

export {Slider}