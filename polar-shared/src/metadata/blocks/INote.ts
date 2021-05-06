import {IMarkdownNote} from "./IMarkdownNote";
import {ICodeNote} from "./ICodeNote";
import {INamedNote} from "./INamedNote";
import {ILatexNote} from "./ILatexNote";
import {
    IAreaHighlightAnnotationNote,
    ICommentAnnotationNote,
    IFlashcardAnnotationNote,
    ITextHighlightAnnotationNote
} from "./IAnnotationNote";

export type INote = IMarkdownNote |
                    INamedNote |
                    ILatexNote |
                    ICodeNote |
                    ITextHighlightAnnotationNote |
                    IAreaHighlightAnnotationNote |
                    ICommentAnnotationNote |
                    IFlashcardAnnotationNote
                    ;

