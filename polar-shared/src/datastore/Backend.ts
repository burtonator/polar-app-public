/**
 * A Backend allows us to isolate storage of various data types.  For example,
 * we could store video on a video hosting service or images on a specific
 * service.
 */
export enum Backend {

    PUBLIC = 'public',
    VIDEO = 'video',
    IMAGE = 'image',
    STASH = 'stash'

}
