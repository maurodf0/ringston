import './style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import SplitType from 'split-type';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
const loader = new GLTFLoader();
let ring = null;
let contactRotation = false;
let renderer,scene,camera;

function initThreeJS(){
    const gui = new dat.GUI();
    //nasconde l'ui del controllo
   // dat.GUI.toggleide();

   //CANVAS
   const canvas = document.querySelector('canvas.webgl');

   // SCENE
   scene = new THREE.Scene();

   //load the ring 3d file
   loader.load('ring.glb', function(gltf){
     ring = gltf.scene;
     ring.position.set(0,0,0);
     ring.scale.set(0.5,0.5,0.5);
     scene.add(ring);

     const tl = gsap.timeline({
          scrollTrigger: {
               trigger: 'section.details',
               start: 'top bottom',
               end: 'bottom top',
               scrub: true,
               markers: true
          }, 
               defaults: {
                    ease: 'power3.inOut',
                    duration: 3
               }
          
     });

     tl.to(ring.position, {
          z:3.5,
          y:-0.34
     })
     .to(ring.rotation, {
          z:1
     }, '<');

     const directionalLight = new THREE.DirectionalLight('lightblue, 10');
     directionalLight.position.z = 8;
     scene.add(directionalLight);

   });

   // SIZES
   const sizes = {
          width: window.innerWidth,
          height: window.innerHeight
   }

   window.addEventListener('resize', () => {
        // UPDATE SIZE
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        //Update Camera
        camera.aspect = window.width / sizes.height;
        camera.updateProjectionMatrix();

        //Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRation, 2));
   });

   // CAMERA
   // Base camera
   camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
   camera.position.x = 0
   camera.position.y = 0
   camera.position.z = 2
   scene.add(camera)
   
   // Controls
   // const controls = new OrbitControls(camera, canvas)
   // controls.enableDamping = true
   
   //RENDERER
   renderer = new THREE.WebGLRenderer({
       canvas: canvas,
       alpha: true
   })
   renderer.setSize(sizes.width, sizes.height)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function animateWords() {
     const words = ['Romance', 'Rings', 'Relationship'];
     let currentIndex = 0;
     let split
     const textElement = document.querySelector('.primary-h1 span');

     function updateText(){
          textElement.textContent = words[currentIndex];
          split = new SplitType(textElement, {
               type: 'chars'
          });
          animateChars(split.chars);
          currentIndex = (currentIndex +1) % words.length;
     }

     function animateChars(chars){
          gsap.from(chars, {
               yPercent: 100,
               opacity:0,
               stagger: 0.08,
               duration: 1.5,
               ease: 'power4.inOut',
               onComplete: () => {
                    if(split){
                         split.revert();
                    }
               }
          })
     }

     setInterval(updateText, 3000);
}


function initRenderLoop(){
     const clock = new THREE.Clock();

     const tick = () => {
          const elapsedTime = clock.getElapsedTime();

          //update object
          if(ring){
               if(!contactRotation){
                    ring.rotation.y = .5 * elapsedTime;
                    ring.rotation.x = 0;
                    ring.rotation.z = 0;
               } else {
                    ring.rotation.y = 0;
                    ring.rotation.x = .2 * elapsedTime;
                    ring.rotation.z = 0 * elapsedTime;
               }
          }

          //Render
          renderer.render(scene, camera);

          window.requestAnimationFrame(tick);
     }
     tick();
}

function setupSmoothScroll() {
     const lenis = new Lenis();
     function raf(time){
          lenis.raf(time);
          requestAnimationFrame(raf);
     }
     requestAnimationFrame(raf);
}

document.addEventListener('DOMContentLoaded', () => {

    initThreeJS();
    initRenderLoop();
    animateWords();
    setupSmoothScroll();

});