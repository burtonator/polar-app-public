/**
 * A Backend allows us to isolate storage of various data types.  For example,
 * we could store video on a video hosting service or images on a specific
 * service.
 */
export enum Backend {

    // these two are public buckets which aren't blinded for the user.
    PUBLIC = 'public',
    CACHE = 'cache',

    // these are all public buckets but are blinded by the user ID so are secure in
    // that you can't compute the path without testing the full hash space.
    VIDEO = 'video',
    IMAGE = 'image',
    STASH = 'stash'

}
