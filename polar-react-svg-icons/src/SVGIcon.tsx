import * as React from "react";

/**
 * Wrapper to specify the size of an icon
 */
export const SVGIcon = (props: IProps) => {
    return (
        <div style={{
                 width: `${props.size}px`
             }}
             className="ml-auto mr-auto">
            {props.children}
        </div>
    );

};

interface IProps {
    readonly size: number;
    readonly children: any;
}
