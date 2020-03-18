/**
 * Compute a ID from a name.  The name can be a human readable string
 * but we then compute a unix-compatible identifier that can be used to to
 * represent the item without any escaping issues.
 * @param name
 */
export function toIdentifier(name: string) {

    return name.toLowerCase()
        // all non-alphanumeric to hyphen
        .replace(/[^a-z0-9]/g, "-")
        // now remove duplicate concurrent hyphens
        .replace(/[-]+/g, '-')
        // now remove prefix hyphens
        .replace(/^-/, '')
        // now remove suffix hyphens
        .replace(/-$/, '')
        ;

}
