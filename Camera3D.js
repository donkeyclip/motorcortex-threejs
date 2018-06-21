const MC = require('@kissmybutton/motorcortex');

const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;

class Camera3D extends TimedIncident {
    onInitialise(attrs, incidentProps) {
    }

    onGetContext(){
    }
    
    getScratchValue(mcid, attribute){
        const attr = attribute.replace("_",".");
        return eval(`this.element.settings.${attr}`);
    }
    
    onProgress(progress, millisecond){
       
        const selector = this.props.selector;

        for ( let key in this.attrs.animatedAttrs) {
            const initialValue = this.getInitialValue(key);
            console.log(initialValue)
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
                    element.object.rotation.z = ((animatedAttr - initialValue) * progress) + initialValue;
                }
            }
            else if ( key === "position_x") {
                const animatedAttr = this.attrs.animatedAttrs.position_x;
                for (let element of this.context.getElements(selector)){
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
module.exports = Camera3D;
