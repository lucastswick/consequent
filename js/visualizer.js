Visualizer = function(sketch) {

  var container;
  var camera, scene, renderer;
  var particleMaterial;
  var radius = 600;
  var theta = 0;

  var objects = [];

  init();
  animate();


  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.rotation.set(-Math.PI / 2, -1 , -.5);
    camera.position.set( -539, 112, 350 );
    window.camera = camera;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x000000 ) );


    
    pointLight = new THREE.PointLight( 0xff9900, 2, 50 );
    scene.add( pointLight );
    
    
    //
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );


    //

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }



  //

  function animate() {

    requestAnimationFrame( animate );

    render();

  }



  function render() {

    theta += 1;

    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    // camera.position.x = 10 * Math.cos( theta );
    // camera.position.z = 100 * Math.sin( theta );

    // camera.rotation.x = .1 * Math.sin( THREE.Math.degToRad( theta ) );
    // camera.rotation.z = .1 * Math.sin( THREE.Math.degToRad( theta ) );
    
    camera.lookAt( scene.position );


    renderer.render( scene, camera );

  }



  sketch.createCube = function(initObj, i, j) {

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );

    var material = new THREE.MeshBasicMaterial( initObj );
    // var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  );

    var object = new THREE.Mesh( geometry, material );
    object.position.x = i * 100 - 500;
    object.position.z = j * 100 - 500;

    // object.position.x = Math.random() * 800 - 400;
    // object.position.y = Math.random() * 800 - 400;
    // object.position.z = Math.random() * 800 - 400;


    object.rotation.x = 0;//1 * Math.PI;
    object.rotation.y = 0;//Math.random() * 2 * Math.PI;
    object.rotation.z = 0;//Math.random() * 2 * Math.PI;



    scene.add( object );


    objects.push( object );

    return object;

    

    
  }

}