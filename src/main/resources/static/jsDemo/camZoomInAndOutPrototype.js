

// let TrackballControls = require('three-trackballcontrols');

let earthOrbitRadius = 8,
    earthOrbitAngle = 0,
    earthOrbitSpeed = - 0.2,

    moonOrbitRadius = 2.5,
    moonOrbitAngle = 0,
    moonOrbitSpeed = -2;

// Renderer
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias: true});
renderer.setClearColor(0xffffe0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500 );
// camera.position.set(0, 0, 12);
camera.position.set(0, 0, 30);
// camera.rotation.x = - Math.PI / 8;
// let cameraRotation =0;
// let cameraRotationSpeed =0.1;
// let cameraAutoRotation =true;
// let orbitControls = new THREE.OrbitControls(camera);

// Scene
let scene = new THREE.Scene();

// Lights
scene.add(new THREE.AmbientLight(0x222222));

// let light = new THREE.SpotLight(0xffffff, 1, 10000, 10, 0.5, 1);
// let light = new THREE.DirectionalLight(0xffffff, 0.6);
let light = new THREE.PointLight(0xffffff, 0.75, 0);
light.position.set(0, 0, 0);

// Init. TextureLoader
let textureLoader = new THREE.TextureLoader();

// Earth
let earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshPhongMaterial({
            map: textureLoader.load(
                '../images/2_no_clouds_4k.jpg'
                // '../images/earthmap1k.jpg'
            ),
            bumpScale: 0.05,
            bumpMap : textureLoader.load(
                '../images/earthbump1k.jpg'
                // '../images/elev_bump_4k.jpg'
            ),
            specular: new THREE.Color('grey'),
            specularMap : textureLoader.load(
                // '../images/earthspec1k.jpg'
                '../images/water_4k.png'
            )
        }
    )
);

// Earth_Atmosphere
let atmosphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.008, 32, 32),
    new THREE.MeshPhongMaterial({
            map: textureLoader.load(
                '../images/fair_clouds_4k.png'
            ),
            transparent: true
        }
    )
);

// Moon
let moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 32),
    new THREE.MeshPhongMaterial({
            map: textureLoader.load(
                '../images/moonmap2k.jpg'
                // '../images/earthmap1k.jpg'
            ),
            bumpScale: 0.05,
            bumpMap : textureLoader.load(
                '../images/moonmap2k.jpg'
                // '../images/elev_bump_4k.jpg'
            )
        }
    )
);

// Sun
let sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    // new THREE.MeshPhongMaterial({
    //         // map: textureLoader.load(
    //         //     '../images/sunmap.jpg'
    //         //     // '../images/earthmap1k.jpg'
    //         // ),
    //         color: 0xffffe0
    //     }
    // )
    new THREE.MeshBasicMaterial({
        color: 'yellow'
    })
);



// Star field
let starMesh = new THREE.Mesh(
    new THREE.SphereGeometry(90, 64, 64),
    new THREE.MeshBasicMaterial({
            map: textureLoader.load(
                '../images/galaxy_starfield.png'
            ),
            side: THREE.BackSide
        }
    )
);

// Pivots
let pivot_sun_to_earth = new THREE.Object3D();
let pivot_earth_self = new THREE.Object3D();
let pivot_earth_to_moon = new THREE.Object3D();
let pivot_moon = new THREE.Object3D();

// pivot_earth_self.add(pivot_moon);
pivot_earth_to_moon.add(pivot_moon);
pivot_sun_to_earth.add(pivot_earth_self);
pivot_sun_to_earth.add(pivot_earth_to_moon);

// Axis helper, used to visualize axis
let sunAxes = new THREE.AxisHelper(0.5);
let earthAxes = new THREE.AxisHelper(2);
let moonAxes = new THREE.AxisHelper(0.5);
pivot_earth_self.add(earthAxes);
pivot_moon.add(moonAxes);
pivot_sun_to_earth.add(sunAxes);

// Apply mesh to pivot
pivot_sun_to_earth.add(sunMesh);

pivot_earth_self.add(earthMesh);
pivot_earth_self.add(atmosphereMesh);
pivot_earth_self.position.x = 8;
pivot_earth_to_moon.position.x = 8;
// Earth axial tilt
pivot_earth_self.rotateZ(2 * Math.PI / 15);

pivot_moon.add(moonMesh);
pivot_moon.position.x = 2.5;
// pivot_moon.position.y = - 1.2;



// Apply to the scene
scene.add(starMesh);
scene.add(light);
scene.add(pivot_sun_to_earth);
// scene.add(camera);

// let controls = new THREE.TrackballControls(camera);

/**
 * Variables added for camera control
 */
let CAM_TO_EARTH, distance;
CAM_TO_EARTH = camera.position.distanceTo(pivot_earth_self.position);
distance = CAM_TO_EARTH;
let cameraDirection = new THREE.Vector3();
let sign = -1;

let animate = function () {

    requestAnimationFrame( animate );
    // Rotations
    // earthMesh.rotation.y += 0.02;
    // atmosphereMesh.rotation.y += 0.0035;
    // moonMesh.rotation.y +=0.06;
    earthMesh.rotateY(0.02);
    atmosphereMesh.rotateY(0.0035);
    moonMesh.rotateY(0.06);

    // Revolutions
    // pivot_moon.rotation.y +=0.05;
    // pivot_earth_self.rotation.y +=0.0055;
    // pivot_sun_to_earth.rotation.y += 0.0015;
    pivot_moon.rotateY(0.05);
    pivot_earth_self.rotateY(0.0055);
    pivot_earth_to_moon.rotateY(0.0055);
    // pivot_sun_to_earth.rotateY(0.0015);

    earthOrbitAngle += earthOrbitSpeed;
    let radians = earthOrbitAngle * Math.PI / 180;
    pivot_earth_self.position.x = Math.cos(radians) * earthOrbitRadius;
    pivot_earth_to_moon.position.x = Math.cos(radians) * earthOrbitRadius;
    pivot_earth_self.position.z = Math.sin(radians) * earthOrbitRadius;
    pivot_earth_to_moon.position.z = Math.sin(radians) * earthOrbitRadius;
    //
    // moonOrbitAngle += moonOrbitSpeed;
    // let moonRadians = moonOrbitAngle * Math.PI / 180;
    // pivot_moon.position.x = Math.cos(moonRadians) * moonOrbitRadius;
    // pivot_moon.position.z = Math.sin(moonRadians) * moonOrbitRadius;

    // Background
    // starMesh.rotation.y += 0.0002;
    // var worldCoords = pivot_earth_self.localToWorld(pivot_earth_self.position);


    /**
     * Keep the earth in the center of the screen,
     * zoom in and zoom out alternately
     */
    camera.lookAt(pivot_earth_self.position);
    camera.getWorldDirection(cameraDirection); // get the direction camera is looking at

    // If camera is too close to the earth, increase distance; vise versa
    if (Math.abs(distance - 4) < 0.05 || Math.abs(distance - CAM_TO_EARTH) < 0.05) {
        sign *= -1;
    }

    // The speed that the camera is approaching or escaping from the earth
    var speed = 0.1;
    distance -= sign * speed;

    let newCamPosition = new THREE.Vector3(0, 0, 0);
    newCamPosition.x = pivot_earth_self.position.x - cameraDirection.x * distance;
    newCamPosition.y = pivot_earth_self.position.y - cameraDirection.y * distance;
    newCamPosition.z = pivot_earth_self.position.z - cameraDirection.z * distance;

    camera.position.set(newCamPosition.x, newCamPosition.y, newCamPosition.z);

    renderer.render(scene, camera);

};

animate();