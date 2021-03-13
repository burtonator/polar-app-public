import {IMarkdownNote} from "./IMarkdownNote";
import {IBlockEmbedNote} from "./IBlockEmbedNote";
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
                    IBlockEmbedNote |
                    ILatexNote |
                    ICodeNote |
                    ITextHighlightAnnotationNote |
                    IAreaHighlightAnnotationNote |
                    ICommentAnnotationNote |
                    IFlashcardAnnotationNote
                    ;

