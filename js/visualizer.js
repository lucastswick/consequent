Visualizer = function(sketch) {

  var container;
  var camera, scene, renderer;
  var particleMaterial;
  var radius = 600;
  var theta = 0;

  var raycaster;

  var objects = [];

  init();
  animate();


  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.rotation.set(-Math.PI / 2, 0 , Math.PI / 2);
    camera.position.set( 400, 537, 0 );
    window.camera = camera;

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    pointLight = new THREE.PointLight( 0xffffff, 2 );
    scene.add( pointLight );

    

    
    
    //
    
    raycaster = new THREE.Raycaster();

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );



    // document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3();
    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    vector.unproject( camera );

    raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

      intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

      var particle = new THREE.Sprite( particleMaterial );
      particle.position.copy( intersects[ 0 ].point );
      particle.scale.x = particle.scale.y = 16;
      scene.add( particle );

    }

    /*
    // Parse all the faces
    for ( var i in intersects ) {

      intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

    }
    */
  }

  //

  function animate() {

    requestAnimationFrame( animate );

    render();

  }



  function render() {

    theta += 1;

    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    // camera.position.x = 10 * Math.cos( theta );
    // camera.position.z = 100 * Math.sin( theta );

    camera.rotation.z = .1 * Math.sin( THREE.Math.degToRad( theta ) );
    
    // camera.lookAt( scene.position );


    renderer.render( scene, camera );

  }

  sketch.createVisual = function(ojb, objFollow, initObj, index) {

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );


    var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( initObj ) );
    object.position.x = index * 100 - 800
    // object.position.x = Math.random() * 800 - 400;
    // object.position.y = Math.random() * 800 - 400;
    // object.position.z = Math.random() * 800 - 400;

    // object.scale.x = Math.random() * 2 + 1;
    // object.scale.y = Math.random() * 2 + 1;
    // object.scale.z = Math.random() * 2 + 1;

    object.rotation.x = 0;//Math.random() * 2 * Math.PI;
    object.rotation.y = 0;//Math.random() * 2 * Math.PI;
    object.rotation.z = 0;//Math.random() * 2 * Math.PI;

    pointLight.add( object );

    scene.add( object );


    // objects.push( object );

    return object;

  }

  sketch.createCube = function(initObj, index) {

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );


    var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( initObj ) );
    object.position.x = index * 100 - 800;
    object.position.y = -100;

    // object.position.x = Math.random() * 800 - 400;
    // object.position.y = Math.random() * 800 - 400;
    // object.position.z = Math.random() * 800 - 400;

    object.scale.x = .1
    object.scale.y = .1
    // object.scale.z = Math.random() * 2 + 1;

    object.rotation.x = 2 * Math.PI;
    object.rotation.y = 0;//Math.random() * 2 * Math.PI;
    object.rotation.z = 0;//Math.random() * 2 * Math.PI;

    pointLight.add( object );

    scene.add( object );


    objects.push( object );

    return object;

    

    
  }

}