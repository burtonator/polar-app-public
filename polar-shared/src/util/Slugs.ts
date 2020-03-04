import * as stopwords from 'stopword';
import { Optional } from './ts/Optional';

/**
 * Compute slugs from strings for use in file names, SEO URLs, etc.
 */
export class Slugs {

    public static calculate(text: string, lang: string = "en"): string {

        return Optional.of(text)
                // first remove long runs of whitespace
                .map(current => current.replace(/\\s+/g, ' '))
                // then split it by space
                .map(current => current.split(' '))
                // remove the stopwords
                .map(current => stopwords.removeStopwords(current))
                // then rejoin with a single hyphen
                .map(current => current.join('-'))
                .get();

    }

}
