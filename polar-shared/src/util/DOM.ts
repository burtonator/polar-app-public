import {Arrays} from "./Arrays";

export type XMLNamespaceStr = string;

export class DOM {

    public static removeChildNodes(element: HTMLElement) {

        for (const node of Array.from(element.childNodes)) {
            element.removeChild(node);
        }

    }

    public static appendChildNodes(source: HTMLElement, target: HTMLElement) {

        for (const sourceNode of Array.from(source.childNodes)) {
            // target.appendChild(sourceNode.cloneNode(true));
            target.appendChild(sourceNode);
        }

    }

    public static toText(element: Element, elementName: string): string | undefined {

        const childElements = element.getElementsByTagName(elementName);

        if (childElements.length > 1) {
            throw new Error(`Too many child elements ${elementName}: ` + childElements.length);
        }

        return this.elementText(Arrays.first(Array.from(childElements)));

    };


    public static toTextNS(element: Element,
                           namespace: XMLNamespaceStr,
                           elementName: string): string | undefined {

        const childElements = element.getElementsByTagNameNS(namespace, elementName);

        if (childElements.length > 1) {
            throw new Error(`Too many child elements ${elementName}: ` + childElements.length);
        }

        return this.elementText(Arrays.first(Array.from(childElements)));

    };

    public static elementText(element: Element | undefined): string | undefined {

        if (element) {
            return element.textContent || undefined;
        } else {
            return undefined;
        }

    }

}
