import * as React from "react";

type DrinkRadioButtonProps = {
    value: string,
    id: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const DrinkRadioButton = ({value, id, onChange}: DrinkRadioButtonProps) => (
    <label>
        <input
            type="radio"
            name="drink"
            value={value}
            id={id}
            onChange={onChange}
        /> {value}
    </label>
)

export {DrinkRadioButton}