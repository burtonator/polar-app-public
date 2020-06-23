
// TODO: place this into a polar-assets module or another module type because
// I do not want duplicate type file everywhere.

declare module "*.svg" {
    const resource: string;
    export default resource;
}

declare module "*.png" {
    const resource: string;
    export default resource;
}

declare module "*.jpg" {
    const resource: string;
    export default resource;
}

declare module "*.jpeg" {
    const resource: string;
    export default resource;
}

declare module "*.ico" {
    const resource: string;
    export default resource;
}

