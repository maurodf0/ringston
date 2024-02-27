import './style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import SplitType from 'split-type';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';


const loader = new GLTFLoader();
let ring = null;
let contactRotation = false;
let renderer,scene,camera;

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

function initThreeJS() {
    //Debug
    const gui = new dat.GUI();
    dat.GUI.toggleHide();

    //canvas
    const canvas = document.querySelector('canvas.webgl');

    //Scene
    scene = new THREE.Scene();

    loader.load('/ring.glb', function(gltf){
         ring = gltf.scene;
       
        ring.position.set(0,0,0);
        ring.scale.set(0.5,0.5,0.5);
        scene.add(ring);

        const ringFolder = gui.addFolder('Ring');
        ringFolder.add(ring.position, 'x').min(-10).max(10).step(0.01).name('Position X');

        const tl = gsap.timeline({
            ScrollTrigger: {
                trigger: 'section.details',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }, defaults: {
                ease: 'power3.out',
                duration: 3
            }
        });

        tl.to(ring.position, {
            z: 2.5,
            y: -0.34
        })
        .to(ring.rotation, {
            z:1
        }, '<');

    });

    //Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
    
        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    })

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

}

function initRenderLoop(){

    const clock = new THREE.Clock();
    
    const tick = () => {

        const elapsedTime = clock.getElapsedTime();

        //Update Object
        if(ring){
            if(!contactRotation){
                ring.rotation.y = .5 * elapsedTime;
                ring.roation.x = 0;
                ring.roation.y = 0;
            } else {
                ring.rotation.y = 0;
                ring.roation.x = .2 * elapsedTime;
                ring.roation.y = .2 * elapsedTime;
            }
        }

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    }
    tick();
}

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initRenderLoop();
})