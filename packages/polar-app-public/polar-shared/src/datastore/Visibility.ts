export enum Visibility {

    /**
     * Only visible for the user.
     */
    PRIVATE = 'private', /* or 0 */

    /**
     * Only to users that this user is following.
     */
    FOLLOWING = 'following', /* or 1 */

    /**
     * To anyone on the service.
     */
    PUBLIC = 'public' /* or 2 */

}
