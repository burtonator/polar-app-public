export class Devices {

    public static get(): Device {

        if (typeof window === 'undefined') {
            // used for node tests
            return 'desktop';
        }

        if (typeof localStorage !== "undefined") {

            const device = localStorage.getItem('device');

            switch (device) {

                case 'phone':
                case 'tablet':
                case 'desktop':
                    return device

            }

        }

        if (window.screen.width <= 450) {
            // My Galaxy S8 is 412x846
            // it's not a desktop, so it must be a phone.
            return 'phone';
        } else if (window.screen.width <= 1024) {
            // smaller displays than 1024 are tablet.
            return 'tablet';
        } else {
            // everything else is a desktop
            return 'desktop';
        }

    }

    public static isPhone(): boolean {
        return this.get() === 'phone';
    }

    public static isDesktop(): boolean {
        return this.get() === 'desktop';
    }

    public static isTablet(): boolean {
        return this.get() === 'tablet';
    }

}

export type Device = 'phone' | 'tablet' | 'desktop';
