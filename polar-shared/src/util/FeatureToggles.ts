const PREFIX = 'feature:';

/**
 * Toggle features based on settings specific for each user.
 *
 * @Deprecated this should go away in favor of prefs - which are not bound to
 * localStorage
 */
export class FeatureToggles {

    /**
     * Get the current value of a feature toggle.
     *
     * @param name The name of the feature.
     * @param defaultValue The default value of the feature toggle.
     */
    public static get(name: string, defaultValue: boolean = false): boolean {

        const val = localStorage.getItem(PREFIX + name);

        if (val === null) {
            return defaultValue;
        }

        return val === 'true';

    }

    public static enable(name: string) {
        localStorage.setItem(PREFIX + name, 'true');
    }

    public static disable(name: string) {
        localStorage.removeItem(PREFIX + name);
    }

    public static toggle(name: string) {
        this.set(name, ! this.get(name));
    }

    public static set(name: string, value: boolean) {

        if (value) {
            this.enable(name);
        } else {
            this.disable(name);
        }

    }

}
