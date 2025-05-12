// lib/spellCheck.ts
import { SymSpell } from 'symspell';

// Initialize SymSpell
const symSpell = new SymSpell();

// Function to load the dictionary (you can load a large dictionary here)
const loadDictionary = (): void => {
    // Optionally, you can load a large dictionary file, or use the built-in one
    symSpell.loadDictionary(); // symSpell.loadDictionary() is enough for basic usage
};

// Function to correct an array of words without predefined data
export const correctSpellingArray = (words: string[]): string[] => {
    // Load dictionary (you can add your own custom dictionary here)
    loadDictionary();

    // Correct the spelling for each word
    return words.map((word) => {
        const suggestions = symSpell.lookup(word, 2);  // Max 2 edits
        return suggestions.length > 0 ? suggestions[0].term : word;
    });
};

