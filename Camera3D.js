// const MC = require('@kissmybutton/motorcortex');
global.THREE = require('three');

// require('three/examples/js/controls/OrbitControls');
const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;

class Camera3D extends TimedIncident {
    onInitialise(attrs, incidentProps) {
        this.animationInitialised = false;
        // this.animate = this.animate.bind(this);
        // this.attrs = attrs
    }

    onGetContext(){
        // console.log("in get contex", this.elements)
        if(this.animationInitialised){
            return ;
        }

        //CSS Object
        this.channel.getCSS3Objects(this.element);
        // this.div.position.x = 0;
        // this.div.position.y = 0;
        // this.div.position.z = 0;
        // this.div.rotation.y = Math.PI;
        
        this.context.rootElement.appendChild(this.channel.CSS3DRenderer.domElement);
        // this.onPr();
        this.animationInitialised = true;
    }
    
    getScratchValue(mcid, attribute){
        return this.attrs.attrs[attribute];
    }
    
    onProgress(progress, millisecond){
        // this.div.rotation.y = ((this.attrs.animatedAttrs.camera_rotation_y - this.getInitialValue('camera_rotation_y')) * progress) + this.getInitialValue('camera_rotation_y');
        // // this.camera.position.z = ((this.attrs.animatedAttrs.camera_position_z - this.getInitialValue('camera_position_z')) * progress) + this.getInitialValue('camera_position_z');
        // this.div.rotation.z = ((this.attrs.animatedAttrs.camera_rotation_y - this.getInitialValue('camera_rotation_y')) * progress) + this.getInitialValue('camera_rotation_y');
        // let id = this.props.selector.split("=")[1]
        // id = id.replace(new RegExp('"', 'g'), '');
        // id = id.replace(new RegExp(']', 'g'), '');
        let elem = this.channel.getCSS3Objects(this.element);
        // console.log(elem)
        // console.log(this.channel.getCSS3Objects(id))
        // console.log(this.channel.CSS3Objects)
        // console.log(id.substring(0,id.length-1));
        // console.log(this.channel.CSS3Objects[id.substring(0,id.length-1)])
        for ( let key in this.attrs.animatedAttrs) {
            // console.log(key)
            if ( key === "camera_rotation_x") {
                this.channel.camera.rotation.x = ((this.attrs.animatedAttrs.camera_rotation_x - this.getInitialValue(key)) * progress) + this.getInitialValue(key);
            }
            else if ( key === "camera_rotation_y") {
                this.channel.camera.rotation.y = ((this.attrs.animatedAttrs.camera_rotation_y - this.getInitialValue(key)) * progress) + this.getInitialValue(key);
                // console.log(key, this.div.rotation.y)
            } 
            else if ( key === "camera_rotation_z") {
                this.channel.camera.rotation.z = ((this.attrs.animatedAttrs.camera_rotation_z - this.getInitialValue(key)) * progress) + this.getInitialValue(key);

            }
            else if ( key === "camera_position_x") {
                this.channel.camera.position.x = ((this.attrs.animatedAttrs.camera_position_x - this.getInitialValue(key)) * progress) + this.getInitialValue(key);

            }
            else if ( key === "camera_position_y") {
                this.channel.camera.position.y = ((this.attrs.animatedAttrs.camera_position_y - this.getInitialValue(key)) * progress) + this.getInitialValue(key);

            }
            else if ( key === "camera_position_z") {
                this.channel.camera.position.z = ((this.attrs.animatedAttrs.camera_position_z - this.getInitialValue(key)) * progress) + this.getInitialValue(key);

            }

        }
       

        this.CSS3DRenderer.render(this.channel.CSS3DScene, this.channel.camera);
        // requestAnimationFrame(this.animate);
    }
}
module.exports = Camera3D;
