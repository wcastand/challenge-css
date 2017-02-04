const renderer = initRenderer()
const camera = initCamera(false)
const scene = initScene()
const cubes = createCubes()
scene.add(cubes)

const updateX = (rotation) => () => cubes.rotation.x = rotation.value * Math.PI / 180
const updateY = (rotation) => () => cubes.rotation.y = rotation.value * Math.PI / 180
const updateZ = (rotation) => () => cubes.rotation.z = rotation.value * Math.PI / 180

const f = createTween(updateY, (rotation) => () => { rotation.value = 0; cubes.rotation.set(0, 0, 0); })
const s = createTween(updateX, (rotation) => () => { rotation.value = 0; cubes.rotation.set(0, 0, 0); })
const t = createTween(updateZ, (rotation) => () => { rotation.value = 0; cubes.rotation.set(0, 0, 0); })
f.chain(s)
s.chain(t)
t.chain(f)

f.start()

function createTween(update, c) {
  let rotation = { value: 0 }
  const target = { value: 90 }
  return new TWEEN.Tween(rotation)
    .to(target, 1200)
    .delay(400)
    .easing(TWEEN.Easing.Quintic.In)
    .onUpdate(update(rotation))
    .onComplete(c(rotation))
}

animate()
function render() { renderer.render( scene, camera ) }
function animate() {
  render()
	requestAnimationFrame( animate )
  TWEEN.update()
}

function createCubes(withAxis = false) {
  const cubes = new THREE.Group()
  for(let y = -2;y < 3;y++) {
    for(let x = -2;x < 3;x++) {
      for(let z = -2;z < 3;z++) {
        const sphere = createSphere(y !== -2 && y !== 2 && x !== -2 && x !== 2 && z !== -2 && z !== 2)
        sphere.position.set(x*16, y*16, z*16)
        cubes.add(sphere)
      }
    }
  }
  if(withAxis) {
    const axis = new THREE.AxisHelper( 50 )
    cubes.add(axis)
  }
  return cubes
}

function createSphere(isWhite = false) {
  const geometry = new THREE.SphereGeometry( 5, 64, 64 )
  const material = new THREE.MeshLambertMaterial ({ color: isWhite ? 0xFAFAFA : 0x232323, shading:THREE.FlatShading })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

function initScene() {
  const scene = new THREE.Scene()
  initLights(scene)
  return scene
}

function initRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true  })
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize( 500, 500 )
  renderer.setClearColor( 0xFAFAFA )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true
  document.body.appendChild( renderer.domElement )
  return renderer
}

function initCamera(withControls = false) {
  const camera = new THREE.OrthographicCamera( -150, 150, -150, 150, -100, 1000 )
  camera.position.set(250, -250, 250)
  camera.lookAt(new THREE.Vector3(0,0,0))
  if(withControls)
    var controls = new OrbitControls(camera)
  return camera
}

function initLights(scene){
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

  const shadowLight = new THREE.DirectionalLight(0xffffff, .8)
  shadowLight.position.set(200, 200, 200)
  shadowLight.castShadow = true
  shadowLight.shadow.mapSize.width = 1024
  shadowLight.shadow.mapSize.height = 1024

  const backLight = new THREE.DirectionalLight(0xffffff, .4)
  backLight.position.set(-100, 200, 50)
  backLight.castShadow = true
  backLight.shadow.mapSize.width = 1024
  backLight.shadow.mapSize.height = 1024

  scene.add(backLight)
  scene.add(light)
  scene.add(shadowLight)
}
