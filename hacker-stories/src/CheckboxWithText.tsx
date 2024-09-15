import * as React from "react";

type CheckboxProps = {
    text: string,
    onClick: (event: React.MouseEvent<HTMLInputElement>) => void
}

const CheckboxWithText = ({text, onClick}: CheckboxProps) => (
    <div>
        <label>
            <input type="checkbox" onClick={onClick}/>
            {text}
        </label>
    </div>
)

export {CheckboxWithText}