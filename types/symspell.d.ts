// types/symspell.d.ts

declare module 'symspell' {
    export class SymSpell {
        constructor();
        loadDictionary(): void;
        lookup(term: string, maxEditDistance: number): Array<{ term: string, distance: number }>;
    }
}
