import {PagemarkMode} from "./PagemarkMode";
import {IPagemark} from "./IPagemark";

export namespace PagemarkColors {

    export interface PagemarkColor {
        readonly backgroundColor: string;
        readonly opacity: number;
    }

    const PagemarkColors = {

        BLUE: {
            backgroundColor: "#00CCFF",
            opacity: 0.7
        },

        LIGHTBLUE: {
            backgroundColor: "#00CCFF",
            opacity: 0.15
        },

        GREY: {
            backgroundColor: "rgb(125, 125, 125)",
            opacity: 0.3
        }

    };

    export function toPagemarkColor(pagemark: IPagemark): PagemarkColor {

        return PagemarkColors.BLUE;

        // if (! pagemark) {
        //     return PagemarkColors.BLUE;
        // }
        //
        // if (!pagemark.mode) {
        //     return PagemarkColors.BLUE;
        // }
        //
        // switch (pagemark.mode) {
        //
        //     case PagemarkMode.IGNORED:
        //         return PagemarkColors.GREY;
        //
        //     case PagemarkMode.TABLE_OF_CONTENTS:
        //         return PagemarkColors.GREY;
        //
        //     case PagemarkMode.APPENDIX:
        //         return PagemarkColors.GREY;
        //
        //     case PagemarkMode.REFERENCES:
        //         return PagemarkColors.GREY;
        //
        //     case PagemarkMode.PRE_READ:
        //         return PagemarkColors.LIGHTBLUE;
        //
        //     default:
        //         return PagemarkColors.BLUE;
        //
        // }

    }

}
