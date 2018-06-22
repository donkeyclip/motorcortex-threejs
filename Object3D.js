const MC = require('@kissmybutton/motorcortex');

const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;

class Object3D extends TimedIncident {
    onInitialise(attrs, incidentProps) {
    }

    onGetContext(){
    }
    
    getScratchValue(mcid, attribute){
        const attr = attribute.replace("_",".");
        try {
            return eval(`this.element.settings.${attr}`) || 0;
        } catch(e) {
            try {
                return eval(`this.element.object.${attr}`) || 0;
            } catch (e) {
                return 0;
            }
        }
    }
    
    onProgress(progress, millisecond){
       
        const selector = this.props.selector;
        // console.log(this.element)
        for ( let key in this.attrs.animatedAttrs) {
            // console.log(key)
            const initialValue = this.getInitialValue(key);
            if ((this.attrs.attrs || {}).keepLookAt){
                for (let element of this.context.getElements(selector)){
                    element.object.lookAt(...this.attrs.attrs.keepLookAt)
                }
            }
            if ( key === "rotation_x") {
                const animatedAttr = this.attrs.animatedAttrs.rotation_x;
                for (let element of this.context.getElements(selector)){
                    element.object.rotation.x = ((animatedAttr - initialValue) * progress) + initialValue;
                }
            }
            else if ( key === "rotation_y") {
                const animatedAttr = this.attrs.animatedAttrs.rotation_y;
                for (let element of this.context.getElements(selector)){
                    element.object.rotation.y = ((animatedAttr - initialValue) * progress) + initialValue;
                }   
            } 
            else if ( key === "rotation_z") {
                const animatedAttr = this.attrs.animatedAttrs.rotation_z;
                for (let element of this.context.getElements(selector)){
                    // console.log(element)
                    element.object.rotation.z = ((animatedAttr - initialValue) * progress) + initialValue;
                }
            }
            else if ( key === "position_x") {
                const animatedAttr = this.attrs.animatedAttrs.position_x;
                // console.log(selector, this.context.getElements(selector))
                for (let element of this.context.getElements(selector)){
                    // console.log(element)
                    element.object.position.x = ((animatedAttr - initialValue) * progress) + initialValue;


                }
            }
            else if ( key === "position_y") {
                const animatedAttr = this.attrs.animatedAttrs.position_y;
                for (let element of this.context.getElements(selector)){
                    element.object.position.y = ((animatedAttr - initialValue) * progress) + initialValue;
                }
            }
            else if ( key === "position_z") {
                const animatedAttr = this.attrs.animatedAttrs.position_z;
                for (let element of this.context.getElements(selector)){
                    element.object.position.z = ((animatedAttr - initialValue) * progress) + initialValue;
                }
            }
        }
       
        for (let i in this.context.elements.renders) {
            this.context.getElements(this.context.elements.renders[i].renderer)[0].object.render(
                this.context.getElements(this.context.elements.renders[i].scene)[0].object,
                this.context.getElements(this.context.elements.renders[i].camera)[0].object
            );
        }
    }
}
module.exports = Object3D;
