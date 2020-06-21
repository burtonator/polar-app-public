import {AnnotationType} from 'src/metadata/AnnotationType';
import {IDocInfo} from "src/metadata/IDocInfo";
import {IDocMeta} from "src/metadata/IDocMeta";
import {IPageInfo} from "src/metadata/IPageInfo";
import {IComment} from "src/metadata/IComment";
import {IFlashcard} from "src/metadata/IFlashcard";
import {ITextHighlight} from "src/metadata/ITextHighlight";
import {IAreaHighlight} from "src/metadata/IAreaHighlight";
import {AnnotationHolder} from "src/metadata/AnnotationHolder";

export class AnnotationHolders {

    public static fromDocMeta(docMeta: IDocMeta): ReadonlyArray<AnnotationHolder> {

        const result: AnnotationHolder[] = [];

        for (const pageMeta of Object.values(docMeta.pageMetas || {})) {

            const pageInfo = pageMeta.pageInfo;
            const docInfo = docMeta.docInfo;

            result.push(...Object.values(pageMeta.areaHighlights || {})
                .map(current => this.fromAreaHighlight(current, pageInfo, docInfo)));

            result.push(...Object.values(pageMeta.textHighlights || {})
                .map(current => this.fromTextHighlight(current, pageInfo, docInfo)));

            result.push(...Object.values(pageMeta.comments || {})
                .map(current => this.fromComment(current, pageInfo, docInfo)));

            result.push(...Object.values(pageMeta.flashcards || {})
                .map(current => this.fromFlashcard(current, pageInfo, docInfo)));

        }

        return result;

    }

    public static fromAreaHighlight(value: IAreaHighlight, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {annotationType: AnnotationType.AREA_HIGHLIGHT, original: value, docInfo, pageInfo};
    }


    public static fromTextHighlight(value: ITextHighlight, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {annotationType: AnnotationType.TEXT_HIGHLIGHT, original: value, docInfo, pageInfo};
    }

    public static fromComment(value: IComment, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {annotationType: AnnotationType.COMMENT, original: value, docInfo, pageInfo};
    }

    public static fromFlashcard(value: IFlashcard, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {annotationType: AnnotationType.FLASHCARD, original: value, docInfo, pageInfo};
    }

}
