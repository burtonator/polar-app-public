export namespace AutoFlashcards {

    export interface AutoFlashcardRequest {
        readonly query_text: string;
    }

    export interface AutoFlashcardResponse {
        readonly front: string;
        readonly back: string;
    }

    export interface AutoFlashcardError {
        readonly error: 'no-result';
    }

    export interface AutoFlashCardLengthError {
        readonly error: 'input-too-long';
    }

}
