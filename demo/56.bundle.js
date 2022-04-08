"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[56],{56:(e,t,n)=>{n.r(t),n.d(t,{retarget:()=>r,retargetClip:()=>i,getHelperFromSkeleton:()=>s,getSkeletonOffsets:()=>a,renameBones:()=>l,getBones:()=>p,getBoneByName:()=>c,getNearestBone:()=>m,findBoneTrackData:()=>u,getEqualsBonesNames:()=>f,clone:()=>x});var o=n(412);function r(e,t,n={}){const r=new o.Vector3,i=new o.Quaternion,s=new o.Vector3,a=new o.Matrix4,l=new o.Matrix4,m=new o.Matrix4;n.preserveMatrix=void 0===n.preserveMatrix||n.preserveMatrix,n.preservePosition=void 0===n.preservePosition||n.preservePosition,n.preserveHipPosition=void 0!==n.preserveHipPosition&&n.preserveHipPosition,n.useTargetMatrix=void 0!==n.useTargetMatrix&&n.useTargetMatrix,n.hip=void 0!==n.hip?n.hip:"hip",n.names=n.names||{};const u=t.isObject3D?t.skeleton.bones:p(t),f=e.isObject3D?e.skeleton.bones:p(e);let x,d,h,M,v;if(e.isObject3D?e.skeleton.pose():(n.useTargetMatrix=!0,n.preserveMatrix=!1),n.preservePosition){v=[];for(let e=0;e<f.length;e++)v.push(f[e].position.clone())}if(n.preserveMatrix){e.updateMatrixWorld(),e.matrixWorld.identity();for(let t=0;t<e.children.length;++t)e.children[t].updateMatrixWorld(!0)}if(n.offsets){x=[];for(let e=0;e<f.length;++e)d=f[e],h=n.names[d.name]||d.name,n.offsets&&n.offsets[h]&&(d.matrix.multiply(n.offsets[h]),d.matrix.decompose(d.position,d.quaternion,d.scale),d.updateMatrixWorld()),x.push(d.matrixWorld.clone())}for(let t=0;t<f.length;++t){if(d=f[t],h=n.names[d.name]||d.name,M=c(h,u),m.copy(d.matrixWorld),M){if(M.updateMatrixWorld(),n.useTargetMatrix?l.copy(M.matrixWorld):(l.copy(e.matrixWorld).invert(),l.multiply(M.matrixWorld)),s.setFromMatrixScale(l),l.scale(s.set(1/s.x,1/s.y,1/s.z)),m.makeRotationFromQuaternion(i.setFromRotationMatrix(l)),e.isObject3D){const t=f.indexOf(d),n=x?x[t]:a.copy(e.skeleton.boneInverses[t]).invert();m.multiply(n)}m.copyPosition(l)}d.parent&&d.parent.isBone?(d.matrix.copy(d.parent.matrixWorld).invert(),d.matrix.multiply(m)):d.matrix.copy(m),n.preserveHipPosition&&h===n.hip&&d.matrix.setPosition(r.set(0,d.position.y,0)),d.matrix.decompose(d.position,d.quaternion,d.scale),d.updateMatrixWorld()}if(n.preservePosition)for(let e=0;e<f.length;++e)d=f[e],h=n.names[d.name]||d.name,h!==n.hip&&d.position.copy(v[e]);n.preserveMatrix&&e.updateMatrixWorld(!0)}function i(e,t,n,i={}){i.useFirstFramePosition=void 0!==i.useFirstFramePosition&&i.useFirstFramePosition,i.fps=void 0!==i.fps?i.fps:30,i.names=i.names||[],t.isObject3D||(t=s(t));const a=Math.round(n.duration*(i.fps/1e3)*1e3),l=1/i.fps,m=[],u=new o.AnimationMixer(t),f=p(e.skeleton),x=[];let d,h,M,v,y;u.clipAction(n).play(),u.update(0),t.updateMatrixWorld();for(let n=0;n<a;++n){const o=n*l;r(e,t,i);for(let e=0;e<f.length;++e)y=i.names[f[e].name]||f[e].name,M=c(y,t.skeleton),M&&(h=f[e],v=x[e]=x[e]||{bone:h},i.hip===y&&(v.pos||(v.pos={times:new Float32Array(a),values:new Float32Array(3*a)}),i.useFirstFramePosition&&(0===n&&(d=h.position.clone()),h.position.sub(d)),v.pos.times[n]=o,h.position.toArray(v.pos.values,3*n)),v.quat||(v.quat={times:new Float32Array(a),values:new Float32Array(4*a)}),v.quat.times[n]=o,h.quaternion.toArray(v.quat.values,4*n));u.update(l),t.updateMatrixWorld()}for(let e=0;e<x.length;++e)v=x[e],v&&(v.pos&&m.push(new o.VectorKeyframeTrack(".bones["+v.bone.name+"].position",v.pos.times,v.pos.values)),m.push(new o.QuaternionKeyframeTrack(".bones["+v.bone.name+"].quaternion",v.quat.times,v.quat.values)));return u.uncacheAction(n),new o.AnimationClip(n.name,-1,m)}function s(e){const t=new o.SkeletonHelper(e.bones[0]);return t.skeleton=e,t}function a(e,t,n={}){const r=new o.Vector3,i=new o.Vector3,a=new o.Vector3,l=new o.Vector3,u=new o.Vector2,f=new o.Vector2;n.hip=void 0!==n.hip?n.hip:"hip",n.names=n.names||{},t.isObject3D||(t=s(t));const x=Object.keys(n.names),d=Object.values(n.names),h=t.isObject3D?t.skeleton.bones:p(t),M=e.isObject3D?e.skeleton.bones:p(e),v=[];let y,b,g,w;for(e.skeleton.pose(),w=0;w<M.length;++w)if(y=M[w],g=n.names[y.name]||y.name,b=c(g,h),b&&g!==n.hip){const e=m(y.parent,x),t=m(b.parent,d);e.updateMatrixWorld(),t.updateMatrixWorld(),r.setFromMatrixPosition(e.matrixWorld),i.setFromMatrixPosition(y.matrixWorld),a.setFromMatrixPosition(t.matrixWorld),l.setFromMatrixPosition(b.matrixWorld),u.subVectors(new o.Vector2(i.x,i.y),new o.Vector2(r.x,r.y)).normalize(),f.subVectors(new o.Vector2(l.x,l.y),new o.Vector2(a.x,a.y)).normalize();const n=u.angle()-f.angle(),s=(new o.Matrix4).makeRotationFromEuler(new o.Euler(0,0,n));y.matrix.multiply(s),y.matrix.decompose(y.position,y.quaternion,y.scale),y.updateMatrixWorld(),v[g]=s}return v}function l(e,t){const n=p(e);for(let e=0;e<n.length;++e){const o=n[e];t[o.name]&&(o.name=t[o.name])}return this}function p(e){return Array.isArray(e)?e:e.bones}function c(e,t){for(let n=0,o=p(t);n<o.length;n++)if(e===o[n].name)return o[n]}function m(e,t){for(;e.isBone;){if(-1!==t.indexOf(e.name))return e;e=e.parent}}function u(e,t){const n=/\[(.*)\]\.(.*)/,o={name:e};for(let r=0;r<t.length;++r){const i=n.exec(t[r].name);i&&e===i[1]&&(o[i[2]]=r)}return o}function f(e,t){const n=p(e),o=p(t),r=[];e:for(let e=0;e<n.length;e++){const t=n[e].name;for(let e=0;e<o.length;e++)if(t===o[e].name){r.push(t);continue e}}return r}function x(e){const t=new Map,n=new Map,o=e.clone();return d(e,o,(function(e,o){t.set(o,e),n.set(e,o)})),o.traverse((function(e){if(!e.isSkinnedMesh)return;const o=e,r=t.get(e),i=r.skeleton.bones;o.skeleton=r.skeleton.clone(),o.bindMatrix.copy(r.bindMatrix),o.skeleton.bones=i.map((function(e){return n.get(e)})),o.bind(o.skeleton,o.bindMatrix)})),o}function d(e,t,n){n(e,t);for(let o=0;o<e.children.length;o++)d(e.children[o],t.children[o],n)}}}]);