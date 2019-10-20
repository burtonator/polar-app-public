
/**
 * A UUID that can support the following operations:
 *
 * - Must be time based so that if a UUID is generated in the future it has a
 *   local time component.
 *
 * - The UUIDs must be lexocographically sortable so that UUIDs that are generated
 *   later follow UUIDs that are generated earlier.
 *
 * 784c6261-e8fa-11e8-a71d-c53e6ebfc780  [first (generated earlier in time)]
 * 7d009ba0-e8fa-11e8-b8b4-29159d7e36ce  [second (generated later in time)]
 *
 */
export type UUID = string;
