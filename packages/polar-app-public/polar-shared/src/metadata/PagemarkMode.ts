/**
 * Denotes the 'mode' of this Pagemark.  By default a pagemark mode is 'read'
 * but we can also mark it 'ignored' to note that we're going to skip this
 * section of content.
 */
export enum PagemarkMode {

    /**
     * The user has pre-read this portion of the document in a previous app
     * or setting.  This should not count towards their daily reading progress
     * as it was done outside the app.
     */
    PRE_READ = "PRE_READ",

    /**
     * The user has read this portion of the document.  This is the default
     * pagemark type and means that the user actually sat down and read this
     * portion of the document.
     */
    READ = "READ",

    /**
     * The user has decided to ignore this portion of the document.
     */
    IGNORED = "IGNORED",

    /**
     * This is the table of contents and not really part of the readable
     * document.
     */
    TABLE_OF_CONTENTS = "TABLE_OF_CONTENTS",

    /**
     * This part of the document is the appendix and not part of the readable
     * portion of the document.
     */
    APPENDIX = "APPENDIX",

    /**
     * This part of the document holds the references (citations) and not part
     * of the readable portion of the document.
     */
    REFERENCES = "REFERENCES",

}
