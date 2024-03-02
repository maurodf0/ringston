import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import SplitType from 'split-type';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

preloadFiles(['ring.glb','images/rings.avif','images/slide1.jpeg','images/slide2.jpeg','images/slide3.jpeg','hands.mp4']);


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

     // Function to toogle the wireframe
     function toggleWireframe(model, isWireframe, opacity){
          model.traverse(function(child){
               if(child.isMesh && child.material){
                    child.material.wireframe = isWireframe;
                    child.material.opacity = opacity;
                    child.material.transparent = true;
               }
          });
     }

     const contactTl = gsap.timeline({
          scrollTrigger: {
               trigger: 'section.contact',
               start: 'top 20%',
               end: 'bottom center',
               toggleActions: 'play none none reverse',
               scrub:true,
               markers:true,
               onEnter: () => {
                    toggleWireframe(ring, true, 1)
                    contactRotation = true
               }
          ,
          onEnterBack: () => {
               toggleWireframe(ring, true, 0.1)
               contactRotation = true
          },
          onLeaveBack: () => {
               toggleWireframe(ring, false, 1)
               contactRotation = false
          },
          onLeave: () => {
               toggleWireframe(ring, false, 0.1)
               contactRotation = false
          }
     }
     });

     contactTl.to(ring.position, {
          z: .3,
          x: .4,
          y:-.23
     })

  

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


// Preloading

function preloadFile(url) {
     return new Promise((resolve, reject) => {
       const fileType = url.split('.').pop().toLowerCase();
   
       if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif') {
         // Preload images
         const img = new Image();
         img.src = url;
         img.onload = resolve;
         img.onerror = reject;
       } else if (fileType === 'mp4' || fileType === 'webm') {
         // Preload videos
         const video = document.createElement('video');
         video.src = url;
         video.onloadeddata = resolve;
         video.onerror = reject;
       } else {
         // Preload other file types (like GLB)
         fetch(url)
           .then(response => response.blob())
           .then(resolve)
           .catch(reject);
       }
     });
   }
   
   
   function preloadFiles(urls) {
     const promises = urls.map(url => preloadFile(url));
     
     Promise.all(promises)
       .then(() => {
         console.log('All files preloaded');
         // Hide loading screen and show the UI
         document.querySelector('.loading-screen').classList.add('hide-loader')
         //document.querySelector('.loading-screen').style.display = 'block'
   
         //document.getElementById('mainUI').style.display = 'block';
       })
       .catch(error => console.error('Error preloading files:', error));
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
          currentIndex = (currentIndex + 1) % words.length;
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

function inspectionSection(){
     const tl = gsap.timeline({
          scrollTrigger: {
               trigger: '.inspection',
               start: 'top bottom',
               end: 'bottom top',
               scrub: true
          }
     });

     tl.to('.inspection h2', {
          y:-300
     })
     .to('.ring-bg', {
          y: -100,
          height:300
     }, '<');

     gsap.to('.marquee h3', {
         scrollTrigger: {
          trigger: '.marquee h3',
          start: 'top 70%',
          end: 'bottom top',
          scrub: true,
         }, 
         x:500,
     });

   
}

function sliderSection(){
     
     // let mm = gsap.matchMedia();

     // mm.add('(min-width:768px)', () => {
          let slider = document.querySelector('.slider');
          let sliderSection = gsap.utils.toArray('.slide');

          const sliderTl = gsap.timeline({
               defaults: {
                    ease: 'none'
               },
                    scrollTrigger: {
                         trigger: slider,
                         pin: true,
                         scrub: 1,
                         end: () => '+=' + slider.offsetWidth
                    }
          
          });

          sliderTl.to(slider, {
               xPercent: -66
          }, '<')
          .to('.progress', {
               width: '100%'
          }, '<');

          sliderSection.forEach((slide, index) => {
               const slideText = new SplitType(slide.querySelector('.slide p'), {types: 'chars'});

               sliderTl.from(slideText.chars, {
                    opacity:0,
                    yPercent:-100,
                    stagger: 0.07,
                    scrollTrigger: {
                         trigger: slide.querySelector('.slide p'),
                         start: 'top bottom',
                         end: 'bottom center',
                         containerAnimation: sliderTl,
                         scrub: true,
                    }
               })
          })


     };

     function contactSection() {
          gsap.set('h4, .inner-contact span', {
               yPercent: 100
          });
          gsap.set('.inner-contact p', {
               opacity: 0
          });

          const tl = gsap.timeline({
               scrollTrigger: {
                    trigger: '.inner-contact',
                    start: '-20% center',
                    end: '10% 40%',
                    scrub: true
               }
          });

          tl.to('.line-top, .line-bottom', {
               width: '100%'
          })
          .to('h4, .inner-contact span', {
               yPercent: 0
          })
          .to('.inner-contact p', {
               opacity:1
          })




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
    inspectionSection();
    setupSmoothScroll();
    sliderSection();
    contactSection();

});