/**
 * The type of the flashcard.
 */
export enum FlashcardType {

    CLOZE = "CLOZE",

    BASIC_FRONT_BACK = "BASIC_FRONT_BACK",

    /**
     * Create two derived views.  The front and back and then the reverse
     * (reverse with the back->front)
     */
    BASIC_FRONT_BACK_AND_REVERSE = "BASIC_FRONT_BACK_AND_REVERSE",

    /**
     * The reverse is optional
     */
    BASIC_FRONT_BACK_OR_REVERSE = "BASIC_FRONT_BACK_OR_REVERSE"

}
