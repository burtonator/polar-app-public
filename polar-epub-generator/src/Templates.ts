import * as ejs from 'ejs';

export namespace Templates {

    /**
     * Render an EJS template
     */
    export function render<D>(tmpl: string, data: D): string {
        return ejs.render(tmpl, data);
    }

}
