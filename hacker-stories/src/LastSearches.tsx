import * as React from "react";

type LastSearchesProps = {
    lastSearches: string[],
    onLastSearch: (searchTerm: string) => void
};

const LastSearches = ({lastSearches, onLastSearch}: LastSearchesProps) => (
    <>
        {lastSearches.map((searchTerm, index) => (
            <button
                key={searchTerm + index}
                type="button"
                onClick={() => onLastSearch(searchTerm)}
            >
                {searchTerm}
            </button>
        ))}
    </>
)

export {LastSearches}