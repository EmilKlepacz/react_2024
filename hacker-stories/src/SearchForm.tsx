import {InputWithLabel} from "./InputWithLabel.tsx";

type SearchFormProps = {
    searchTerm: string,
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}: SearchFormProps) => (
    <form onSubmit={onSearchSubmit}>
        <InputWithLabel id="search"
                        value={searchTerm}
                        isFocused={true}
                        onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithLabel>

        &nbsp;&nbsp;&nbsp;

        <button type="submit" disabled={!searchTerm}>
            Submit
        </button>
    </form>
)

export {SearchForm};