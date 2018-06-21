/*
iframe[seamless]{
    background-color: transparent;
    border: 0px none transparent;
    padding: 0px;
    overflow: hidden;
}

might need more work for IE. See here: https://stackoverflow.com/a/29209248
*/
const MC = require('@kissmybutton/motorcortex');
// const MC = require('../motorcortex');

console.log(MC)

const Helper = MC.Helper;
const helper = new MC.Helper();
const Group = MC.Group;
const conf = MC.conf;

class Iframe3DContextHandler {
    /**
     * @param {object} props - an object that should contain all of the following keys:
     * - html (the html template to render)
     * - css (the css template of the isolated tree)
     * - initParams (optional / the initialisation parameteres that will be passed both on the css and the html templates in order to render)
     * - host (an Element object that will host the isolated tree)
     * - containerParams (an object that holds parameters to affect the container of the isolated tree, e.g. width, height etc)
    */
    constructor(props={}) {
        if(!helper.isObject(props)){
            helper.error(`ContextHandler expects an object on its constructor. ${typeof props} passed`);
            return false;
        }

        if(!props.hasOwnProperty('host')){
            helper.error(`ContextHandler expects the host key on its constructor properties which is missing`);
            return false;
        }
        
        this.isDOM = false;

        const ownerDocument = props.host.ownerDocument;

        if(!ownerDocument.getElementById("@kissmybutton/motorcortex/iframeContextHandler/css")){
            const seamlessCSS = `
            iframe[seamless]{
                background-color: transparent;
                border: 0px none transparent;
                padding: 0px;
                overflow: hidden;
            }
            `;
            const iframesCSS = ownerDocument.createElement('style');
            iframesCSS.id = "@kissmybutton/motorcortex/iframeContextHandler/css";
            iframesCSS.type = 'text/css';
            const Head = ownerDocument.head || ownerDocument.getElementsByTagName('head')[0];
             if (iframesCSS.styleSheet){
                iframesCSS.styleSheet.cssText = seamlessCSS;
            } else {
                iframesCSS.appendChild(ownerDocument.createTextNode(seamlessCSS));
            }

            Head.appendChild(iframesCSS);
        }

        // Create an iframe:
        let iframe = ownerDocument.createElement('iframe');
        props.host.appendChild(iframe);
        iframe.setAttribute("seamless", "seamless");
        if(props.hasOwnProperty('containerParams')){
            if(props.containerParams.hasOwnProperty('width')){
                iframe.setAttribute('width', props.containerParams.width);
            }
            if(props.containerParams.hasOwnProperty('height')){
                iframe.setAttribute('height', props.containerParams.height);
            }
        }

        // Initialise the iframe
        iframe.src = '';

        // Put it in the document (but hidden):
        let iframeDocument = (iframe.contentWindow || iframe.contentDocument);
        if(iframeDocument.document){
            iframeDocument = iframeDocument.document;
        }

        // console.log("asdfs",props.html)
        iframeDocument.write(props.html);

        const bodyFixCSS = `
        html,body {
            padding:0;
            margin:0;
        }
        `;

        const styleTag = iframeDocument.createElement('style');
        styleTag.type = 'text/css';
        if (styleTag.styleSheet){
            styleTag.styleSheet.cssText = props.css + bodyFixCSS;
        } else {
            styleTag.appendChild(ownerDocument.createTextNode(props.css + bodyFixCSS));
        }
        const head = iframeDocument.head || iframeDocument.getElementsByTagName('head')[0];
        head.appendChild(styleTag);

        this.context = {
            document: iframeDocument,
            window: iframe.contentWindow || iframe,
            rootElement: iframeDocument.body,
            unmount: function(){
                props.host.removeChild(iframe);
            },
            getElements: this.getElements.bind(this),
            getMCID: this.getMCID.bind(this),
            setMCID: this.setMCID.bind(this),
            getElementSelectorByMCID: this.getElementSelectorByMCID.bind(this)
        };

        iframeDocument.close();

    }
    
    getElements(selector){
        let elements = [];
        let key = "groups";

        if (selector.substring(0,1) === "#") { key = "id" };
        selector = selector.substring(1, selector.length);

        for (let prop in this.context.elements) {
            for (let element in this.context.elements[prop]) {
                if (this.context.elements[prop][element][key] === selector) {
                    elements.push(this.context.elements[prop][element]);
                } 
            }
        }

        return elements;
    }
    
    getMCID(element){
        return element.mcid;
    }
    
    setMCID(element, mcid){
        element.mcid = mcid;
    }
    
    getElementSelectorByMCID(mcid){
        for (let prop in this.context.elements) {
            for (let element in this.context.elements[prop]) {
                if (this.context.elements[prop][element].mcid === mcid) {
                    return (this.context.elements[prop][element].selector);
                }
            }
        }
        return null;
    }

}

module.exports = Iframe3DContextHandler;
