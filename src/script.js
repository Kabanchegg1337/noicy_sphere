import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";


export default class Sketch {
    constructor() {

        this.settings = {
            progress: 0,
            stage: 0,
            clicks: 0,
        }

        this.time = 0;
        this.mouse = new THREE.Vector2(0, 0);

        //Perspective camera
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	    this.camera.position.z = 4;


        //Orthographic camera
        /* let fructumSize = 1;
        let aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(fructumSize / -2, fructumSize / 2, fructumSize / 2, fructumSize / -2, -1000, 1000);
        this.camera.position.set(0, 0, 2); */


        //Scene
	    this.scene = new THREE.Scene();

        //Renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(0xcecece);
        this.canvas = document.body.appendChild( this.renderer.domElement );


        //Params
        this.height = this.canvas.offsetHeight;
        this.width = this.canvas.offsetWidth;


        //Orbit controls
        this.controls = new OrbitControls(this.camera, this.canvas);



        //this.mouseEvents();
        //this.touchEvents();
        this.addMesh();
        //this.aspect();
        //this.enableSettings();
        this.render();
    }


    enableSettings() {
        this.gui = new dat.GUI();

        this.gui.add(this.settings, "progress", 0, 1, 0.01);
    }
    mouseEvents() {
        const that = this;
        function onMouseMove( event ) {

            that.mouse.x = ( event.clientX / window.innerWidth )  - 0.5;
            that.mouse.y = - ( event.clientY / window.innerHeight ) + 0.5;

            that.material.uniforms.mouse.value = new THREE.Vector2(that.mouse.x, that.mouse.y);
        
        }
        window.addEventListener( 'mousemove', onMouseMove, false );
    }
    touchEvents() {
        const that = this
        this.canvas.addEventListener("touchmove", (e) => {
            
            e.preventDefault();
            that.mouse.x = ( e.targetTouches[0].clientX / window.innerWidth )  - 0.5;
            that.mouse.y = - ( e.targetTouches[0].clientY / window.innerHeight ) + 0.5;

            that.material.uniforms.mouse.value = new THREE.Vector2(that.mouse.x, that.mouse.y);
        }, false)
    }
    aspect() {
        this.imageAspect = 1;
        console.log(this.imageAspect)
        let a1; let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        }
        else {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        }
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;
    }
    addMesh() {
        this.geometry = new THREE.SphereBufferGeometry(1.2, 16, 16);


        //this.material = new THREE.MeshNormalMaterial({flatShading: true});

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {type: "v4", value: new THREE.Vector4()},
                mouse: {type: "v2", value: new THREE.Vector2(0, 0)},

            },
            vertexShader: vertex,
            fragmentShader: fragment,
            //depthTest: false,
            //depthWrite: false,
            //alphaTest: false,
            //side: THREE.DoubleSide
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );


        this.scene.add( this.mesh );
    }

    
    render(){
        this.time += 0.01;
	    this.renderer.render( this.scene, this.camera );
        //this.material.uniforms.time.value = this.time;
        //this.material.uniforms.progress.value = this.settings.progress;
        window.requestAnimationFrame(this.render.bind(this));
    }
}


const sketch = new Sketch();