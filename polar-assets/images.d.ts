/**
 * This is a URL to a resource.
 */
export type ImageURLStr = string;

declare module "*.svg" {
    const content: ImageURLStr;
    export default content;
}

declare module "*.webp" {
    const content: ImageURLStr;
    export default content;
}


declare module "*.png" {
    const content: ImageURLStr;
    export default content;
}

declare module "*.jpg" {
    const content: ImageURLStr;
    export default content;
}

declare module "*.jpeg" {
    const content: ImageURLStr;
    export default content;
}

declare module "*.ico" {
    const content: ImageURLStr;
    export default content;
}
