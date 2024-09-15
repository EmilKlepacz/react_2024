import * as React from "react";


type InputWithLabelProps = {
    id: string
    type?: string,
    // label: string,
    value: string,
    isFocused: boolean
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    children: React.ReactNode
};

const InputWithLabel = ({id, type = 'text', value, isFocused, onInputChange, children}: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label> &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                autoFocus={isFocused}
                onChange={onInputChange}
            />
        </>
    )
}

export {InputWithLabel}

export type {InputWithLabelProps}