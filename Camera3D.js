const MC = require('@kissmybutton/motorcortex');

const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;

class Camera3D extends TimedIncident {
    onInitialise(attrs, incidentProps) {
        this.animationInitialised = false;
        if(!this.attrs.attrs.hasOwnProperty('easing')){
            this.attrs.attrs.easing = 'linear';
        }
    }

    onGetContext(){
        if(this.animationInitialised){
            return ;
        }
        const newProps = {};
        newProps.duration = this.duration;
        newProps.easing = this.attrs.attrs.easing;
        newProps["0%"] = {};
        newProps["100%"] = {};
        for(let key in this.attrs.animatedAttrs){
            newProps["100%"][key] = String(this.attrs.animatedAttrs[key]);
            newProps["0%"][key] = String(this.getInitialValue(key));
        }
        
        const sequenceId = this.id;
        Velocity('registerSequence', sequenceId, newProps);
        this.animationInitialised = true;
    }
    
    getScratchValue(mcid, attribute){
        return Velocity(this.getElementByMCID(mcid), "style", attribute);
    }
    
    onProgress(progress, millisecond){
        const calculatedStyle = Velocity(this.elements, 'tween', progress, this.id);
        Velocity(this.elements, 'style', calculatedStyle);
    }

    
    lastWish(){
        this.stop();
        this.complete();
    }
    

}

module.exports = Animation;
