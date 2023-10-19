import { Hit } from '@algolia/client-search';
declare type QuerySuggestionsFacetValue = {
    value: string;
    count: number;
};
declare type QuerySuggestionsIndexMatch<TKey extends string> = Record<TKey, {
    exact_nb_hits: number;
    facets: {
        exact_matches: QuerySuggestionsFacetValue[];
    };
    analytics: QuerySuggestionsFacetValue[];
}>;
export declare type QuerySuggestionsHit<TIndexKey extends string = any> = Hit<{
    query: string;
    popularity: number;
    nb_words: number;
}> & QuerySuggestionsIndexMatch<TIndexKey>;
export declare type AutocompleteQuerySuggestionsHit<TIndexKey extends string = any> = QuerySuggestionsHit<TIndexKey> & {
    __autocomplete_qsCategory?: string;
};
export {};
