import * as stopwords from 'stopword';
import { Optional } from './ts/Optional';

/**
 * A slug string which contains no newlines, spacing, etc.
 */
export type SlugStr = string;

/**
 * Compute slugs from strings for use in file names, SEO URLs, etc.
 */
export class Slugs {

    public static calculate(text: string, lang: string = "en"): SlugStr {

        // TODO: we are NOT using the lang and should in the future.

        return Optional.of(text)
                // first remove long runs of whitespace
                .map(current => current.replace(/[^a-zA-Z0-9]+/g, ' '))
                // trim the string now
                .map(current => current.trim())
                // then split it by space
                .map(current => current.split(' '))
                // remove the stopwords
                .map(current => stopwords.removeStopwords(current))
                // then rejoin with a single hyphen
                .map(current => current.join('-'))
                .get();

    }

}
