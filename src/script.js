import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

import vertexPoints from "./shaders/points/vertex.glsl";
import fragmentPoints from "./shaders/points/fragment.glsl";

import vertexEdges from "./shaders/edges/vertex.glsl";
import fragmentEdges from "./shaders/edges/fragment.glsl";

import vertexBackground from "./shaders/background/vertex.glsl";
import fragmentBackground from "./shaders/background/fragment.glsl";


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
        if (window.innerWidth < 600) {
            this.camera.position.z = 7;
        }


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
        this.renderer.setClearColor(0x111111);
        this.canvas = document.body.appendChild( this.renderer.domElement );


        //Params
        this.height = this.canvas.offsetHeight;
        this.width = this.canvas.offsetWidth;


        //Orbit controls
        this.controls = new OrbitControls(this.camera, this.canvas);



        //this.mouseEvents();
        //this.touchEvents();
        this.addMesh();
        this.addPoints();
        this.addEdges();
        //this.aspect();
        //this.enableSettings();
        this.render();
        this.handleResize();
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
        this.geometry = new THREE.IcosahedronBufferGeometry(1.6, 12);


        //this.material = new THREE.MeshNormalMaterial({flatShading: true});

        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
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
        this.keke = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial({transparent: true, opacity: 0.9}));


        this.scene.add( this.mesh );
        this.scene.add( this.keke );
    }

    addPoints() {


        //this.material = new THREE.MeshNormalMaterial({flatShading: true});

        this.pointsMaterial = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {type: "v4", value: new THREE.Vector4()},
                mouse: {type: "v2", value: new THREE.Vector2(0, 0)},

            },
            vertexShader: vertexPoints,
            fragmentShader: fragmentPoints,
            //depthTest: false,
            //depthWrite: false,
            //alphaTest: false,
            //side: THREE.DoubleSide
        })
        this.backgroundMaterial = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {type: "v4", value: new THREE.Vector4()},
                mouse: {type: "v2", value: new THREE.Vector2(0, 0)},

            },
            vertexShader: vertexBackground,
            fragmentShader: fragmentBackground,
            transparent: true,
            //depthTest: false,
            //depthWrite: false,
            //alphaTest: false,
            //side: THREE.DoubleSide
        })


        this.points = new THREE.Points( this.geometry, this.pointsMaterial );
        this.background = new THREE.Points( this.geometry, this.backgroundMaterial );

        this.points.scale.set(1.001, 1.001, 1.001);
        this.background.scale.set(2, 2, 2);
        this.scene.add( this.points );
        this.scene.add( this.background );
    }

    addEdges() {

        this.edgesMaterial = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {type: "v4", value: new THREE.Vector4()},
                mouse: {type: "v2", value: new THREE.Vector2(0, 0)},

            },
            vertexShader: vertexEdges,
            fragmentShader: fragmentEdges,
            transparent: true,
            //depthTest: false,
            //depthWrite: false,
            //alphaTest: false,
            //side: THREE.DoubleSide
        })

        const edges = new THREE.EdgesGeometry( this.geometry );
        this.lines = new THREE.LineSegments( edges, this.edgesMaterial );
        this.lines.scale.set(1.001, 1.001, 1.001);


        this.scene.add(this.lines)

    }
    
    render(){
        this.time += 0.01;
	    this.renderer.render( this.scene, this.camera );


        this.material.uniforms.time.value = this.time;

        this.pointsMaterial.uniforms.time.value = this.time;

        this.edgesMaterial.uniforms.time.value = this.time;


        this.backgroundMaterial.uniforms.time.value = this.time / 4;


        this.scene.rotation.x = 0.05 * Math.sin(this.time*0.5*Math.PI);
        this.scene.rotation.y = this.time / 2;
        this.scene.rotation.z = 0.15 * Math.sin(this.time*0.5*Math.PI);


        window.requestAnimationFrame(this.render.bind(this));
    }
    handleResize() {
        const that = this;
        window.addEventListener('resize', handle);

        function handle() {
            that.camera.aspect = window.innerWidth / window.innerHeight
            that.camera.updateProjectionMatrix()
            that.renderer.setSize(window.innerWidth, window.innerHeight)
        }

    }
}


const sketch = new Sketch();