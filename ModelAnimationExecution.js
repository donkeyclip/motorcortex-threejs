const MC = require('@kissmybutton/motorcortex');

const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;
let prevTime = Date.now();
class MAE extends TimedIncident {
    onInitialise(attrs, incidentProps) {
        // this.animationInitialised = false;
        // this.onGetContext()
    }

    onGetContext(){    

        if(this.animationInitialised){
            return ;
        }
        for (let i in this.elements) {
            this.context.elements.mixers.push({
                id: this.id,
                object: new THREE.AnimationMixer( this.elements[i].object ),
                clip: THREE.AnimationClip.CreateFromMorphTargetSequence(
                    this.attrs.attrs.animationName,
                    this.elements[i].object.geometry.morphTargets,
                    this.attrs.attrs.animationFrames
                    )
            });
            
            const length = this.context.elements.mixers.length -1;
            const mixer = this.context.elements.mixers[length].object;
            const clip = this.context.elements.mixers[length].clip;
            mixer.clipAction( clip ).setDuration( this.attrs.attrs.singleLoopDuration ).play();    
            console.log(this.elements[i].object.geometry.morphTargets)
        }

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
        // console.log("in on progress",this)
        // console.log(progress, millisecond)
        // console.log(this)
        for( let key in this.attrs.animatedAttrs) {
            console.log(key)
            const initialValue = this.getInitialValue(key);
            
            const animatedAttr = this.attrs.animatedAttrs[key];
            
            console.log(animatedAttr, initialValue, progress)
            const time = ( ( animatedAttr - initialValue ) * progress ) + initialValue;

            const prevTime = this.attrs.attrs[key+"_previous"] || 0;

            console.log("the time", time)
            console.log("the prev time", prevTime)
            const delta = time - prevTime;

            this.attrs.attrs[key+"_previous"] = time;
            console.log("the delta",delta)
            // let update = (millisecond - this.attrs.attrs.prevTime)/1000;
            // update = update || 0.1
            // console.log(this.context.getElements("#" +this.props.id), this.props.id)
            this.context.getElements("#" +this.props.id)[0].object.update( delta/1000 );

             for (let i in this.context.elements.renders) {
                this.context.getElements(this.context.elements.renders[i].renderer)[0].object.render(
                    this.context.getElements(this.context.elements.renders[i].scene)[0].object,
                    this.context.getElements(this.context.elements.renders[i].camera)[0].object
                );
            }
        }
    }
}
module.exports = MAE;
