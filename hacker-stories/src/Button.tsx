import * as React from "react";

type ButtonProps = {
    text: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({text, onClick}: ButtonProps) => (
    <button type="button" onClick={onClick}>{text}</button>
);

export {Button}