"use strict";

export function getContent(node) {
    if("content" in document.createElement("template")) {
        return document.importNode(node.content, true);
    } else {
        var fragment = document.createDocumentFragment();
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
            fragment.appendChild(children[i].cloneNode(true));
        }
        return fragment;
    }
}
