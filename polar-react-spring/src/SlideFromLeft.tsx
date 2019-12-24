import {animated, useSpring} from "react-spring";
import * as React from "react";

const SlideFromLeft = (props: any) => {

    const style = useSpring({
        opacity: 1,
        from: {
            transform: 'translateX(-100%)'
        },
        to: {
            transform: 'translateX(0%)'
        }
    });

    return <animated.div style={style}>
        {props.children}
    </animated.div>;

};

interface IProps {
    readonly render: (style: React.CSSProperties) => React.ReactElement;
}
