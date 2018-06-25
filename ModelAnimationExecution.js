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
            console.log(this)
            this.context.elements.mixers.push({
                id: this.id,
                object: new THREE.AnimationMixer( this.element.object ),
                clip: THREE.AnimationClip.CreateFromMorphTargetSequence(
                    this.attrs.attrs.animationName,
                    this.element.object.geometry.morphTargets,
                    this.attrs.attrs.animationFrames
                    )
            });
            
            const length = this.context.elements.mixers.length -1;
            const mixer = this.context.elements.mixers[length].object;
            const clip = this.context.elements.mixers[length].clip;
            mixer.clipAction( clip ).setDuration( this.attrs.attrs.singleLoopDuration/1000 ).play();    
            // console.log(this.element.object.geometry.morphTargets)

    }
    
    getScratchValue(mcid, attribute){
        const attr = attribute;
        this.element.animations = this.element.animations || {};
        this.element.animations[attr+"_previous"] = this.element.animations[attr+"_previous"] || 0
        return this.element.animations[attr+"_previous"];
    }
    
    onProgress(progress, millisecond){
        // console.log("in on progress",this)
        // console.log(progress, millisecond)
        // console.log(this)
        for( let key in this.attrs.animatedAttrs) {
            // console.log(key)
            // console.log(this)
            const initialValue = this.getInitialValue(key);
            const animatedAttr = this.attrs.animatedAttrs[key];
            
            // console.log(animatedAttr, initialValue, progress)
            const time = Math.floor(animatedAttr * progress) + initialValue;
            // this.element.animations = this.element.animations || {};
            const prevTime = this.element.animations[key+"_previous"] ;
            // console.log(this.attrs.attrs[key+ "_previous"])
            const delta = time - prevTime;

            this.element.animations[key+"_previous"] = time;
if (this.props.selector === "#horse") {
                console.log("the initial", initialValue)
                console.log("the time", time)
            console.log("the prev time", prevTime)
            console.log("the delta",delta)

}            // let update = (millisecond - this.attrs.attrs.prevTime)/1000;
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
