import {IMarkdownNote} from "./IMarkdownNote";
import {IBlockReferenceNote} from "./IBlockReferenceNote";
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
                    IBlockReferenceNote |
                    ILatexNote |
                    ICodeNote |
                    ITextHighlightAnnotationNote |
                    IAreaHighlightAnnotationNote |
                    ICommentAnnotationNote |
                    IFlashcardAnnotationNote
                    ;

