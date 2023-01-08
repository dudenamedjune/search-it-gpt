import { For, createEffect, createSignal } from "solid-js";
import { AxiosResponse } from "axios";
import { CreateCompletionResponse } from "openai";
import type { JSX } from "solid-js";
export interface ISearchRepository {
    search(arg0: string): Promise<AxiosResponse<CreateCompletionResponse, string>>
}
type SearchValues = {
    term: string,
    response: string
}
type EventHandler = JSX.EventHandler<HTMLInputElement, InputEvent>
const defaultSearchValue: SearchValues = {
    term: "",
    response: ""
}
function Search({
    client
}: {
    client: ISearchRepository
}) {
    const [loadingIndexMap, setLoadingIndexHashMap] = createSignal({} as Record<number, boolean>);
    const [searchValues, setSearchValues] = createSignal([defaultSearchValue] as SearchValues[]);
    const [focusedIndex, setFocusedIndex] = createSignal(0);
    let lastInput: HTMLInputElement
    const updateSearchValues = async (index: number, term: string) => {
        const newSearchValues = [...searchValues()]
        newSearchValues[index] = {
            term,
            response: "",
        }
        const filteredNewSearchValues = newSearchValues.filter(({ term }) => term !== "")
        const response = await client.search(getPrompt(filteredNewSearchValues, index + 1, term))
        filteredNewSearchValues[index].response = response.data.choices[0].text ?? ""
        setLoadingIndexHashMap({ ...loadingIndexMap(), [index]: false })
        setSearchValues([...filteredNewSearchValues, defaultSearchValue])
    }
    createEffect((prev) => {
        if (prev !== searchValues()) {
            lastInput.focus()
            return searchValues()
        }
    }, searchValues());
    const getPrompt = (array: SearchValues[], endIndex: number, userSearch: string) => {
        const prompt = array.slice(0, endIndex).reduce((acc, { term, response }, currentPromptIndex) => {
            if (currentPromptIndex === endIndex - 1) {
                return `${acc}Human: ${userSearch}\nAI:`
            }
            return `${acc}Human: ${term}\nAI: ${response}\n`
        }, "")
        return prompt
    }
    const handleBlur = async ({ currentTarget: { value } }: { currentTarget: HTMLInputElement }, index: number) => {

        if (!value && searchValues().length > 1) {
            const newSearchValues = [...searchValues()]
            newSearchValues.splice(index, 1)
            setSearchValues(newSearchValues)
        }
        if (!value && index === 0) {
            setSearchValues([defaultSearchValue])
        }
        if (value) {
            setLoadingIndexHashMap({ ...loadingIndexMap(), [index]: true })
            updateSearchValues(index, value)
        }
    }
    const getTerm = (index: number) => {
        const term = searchValues()[index].term
        return term
    }
    return (
        <div style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "flex-end",
        }}>
            <For each={searchValues()}>{(searchValue, index) =>
                <>
                    <div
                        style={{
                            "border-radius": "10px",
                            width: "100%"
                        }}
                    >
                        <input
                            style={{
                                width: "100%",
                                "padding-left": "1rem",
                                "border-radius": "10px",
                                "font-size": index() === focusedIndex() ? "2rem" : "1rem",
                                "min-height": "60px",
                            }}
                            onBlur={(e) => {
                                handleBlur(e, index())
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleBlur(e, index())}
                            onFocus={() => {
                                setFocusedIndex(index())
                                console.log(index())
                            }}
                            value={getTerm(index())}
                            placeholder=""
                            ref={(input) => {
                                if (index() === searchValues().length - 1) {
                                    lastInput = input
                                }
                            }}
                            tabIndex={index() + 1}
                        >

                        </input>
                    </div>

                    <div
                        style={{
                            height: "100%",
                            margin: "20px",
                            "font-size": "30px",
                        }}
                        tabIndex={index() + 2}>{loadingIndexMap()[index()] ? "..." : searchValue.response.split('\n').map((res) => (
                            <>
                                <article>{res}</article>
                                <br />
                            </>
                        ))}</div>
                </>
            }
            </For>
        </div >

    )
}
export default Search

