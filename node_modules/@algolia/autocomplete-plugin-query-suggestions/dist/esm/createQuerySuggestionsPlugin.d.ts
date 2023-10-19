import { AutocompleteState, AutocompleteSource, AutocompletePlugin } from '@algolia/autocomplete-js';
import { SearchOptions } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';
import { AutocompleteQuerySuggestionsHit, QuerySuggestionsHit } from './types';
export declare type CreateQuerySuggestionsPluginParams<TItem extends QuerySuggestionsHit> = {
    /**
     * The initialized Algolia search client.
     *
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-searchclient
     */
    searchClient: SearchClient;
    /**
     * The index name.
     *
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-indexname
     */
    indexName: string;
    /**
     * A function returning [Algolia search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/).
     *
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-getsearchparams
     */
    getSearchParams?(params: {
        state: AutocompleteState<TItem>;
    }): SearchOptions;
    /**
     * A function to transform the provided source.
     *
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-transformsource
     */
    transformSource?(params: {
        source: AutocompleteSource<TItem>;
        state: AutocompleteState<TItem>;
        onTapAhead(item: TItem): void;
    }): AutocompleteSource<TItem>;
    /**
     * The attribute or attribute path to display categories for.
     *
     * @example ["instant_search", "facets", "exact_matches", "categories"]
     * @example ["instant_search", "facets", "exact_matches", "hierarchicalCategories.lvl0"]
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-categoryattribute
     */
    categoryAttribute?: string | string[];
    /**
     * How many items to display categories for.
     *
     * @default 1
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-itemswithcategories
     */
    itemsWithCategories?: number;
    /**
     * The number of categories to display per item.
     *
     * @default 1
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/#param-categoriesperitem
     */
    categoriesPerItem?: number;
};
export declare function createQuerySuggestionsPlugin<TItem extends AutocompleteQuerySuggestionsHit>(options: CreateQuerySuggestionsPluginParams<TItem>): AutocompletePlugin<TItem, undefined>;
