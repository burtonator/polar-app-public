export type StripeMode = 'test' | 'live';

export interface IStripeCreateCustomerPortalRequest {
    readonly stripeMode: StripeMode;
}

export interface IStripeCreateCustomerPortalResponse {
    readonly url: string;
}
