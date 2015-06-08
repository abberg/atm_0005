(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			clock = new THREE.Clock(true),
			pointLight,
			imposter,
			composer,

			init = function(){
				renderer.setClearColor(0x09181C);
				addLights();
				addMeshes();
				setupPostProcessing();
				camera.position.set(0, 0, 15);
			},
			
			addLights = function(){
				var keyLight,
					bounceLight;

				keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
				keyLight.position.set(0, 1, 0);
				scene.add(keyLight);

				bounceLight = new THREE.DirectionalLight(0xaaffff, 0.3);
				bounceLight.position.set(0, -1, 0);
				scene.add(bounceLight);

				pointLight = new THREE.PointLight(0xffffff, 0.5);
				scene.add(pointLight);

			},

			addMeshes = function(){
				var geometry,
				material,
				mesh,
				occlusionMesh,
				i;

				for(i = -1; i < 2; i++){
					
					geometry = new THREE.TorusGeometry( 5, 1.5, 12, 64);
					material = new THREE.MeshPhongMaterial( { color: 0x777777, shininess:100} );
					mesh = new THREE.Mesh( geometry, material );
					
					mesh.position.y = i * 4;
					mesh.rotation.x = Math.PI / 2;
					mesh.scale.z = 0.3;
					scene.add( mesh );

					geometry = new THREE.TorusGeometry( 6.45, 0.1, 12, 64);
					material = new THREE.MeshBasicMaterial( { color: 0xaaffff} );
					mesh = new THREE.Mesh( geometry, material );
					
					mesh.position.y = i * 4;
					mesh.rotation.x = Math.PI / 2;
					scene.add( mesh );

					geometry = new THREE.TorusGeometry( 5, 0.15, 12, 64);
					material = new THREE.MeshBasicMaterial( { color: 0xaaffff} );
					mesh = new THREE.Mesh( geometry, material );
					
					mesh.position.y = ( i * 4 ) + 0.45;
					mesh.rotation.x = Math.PI / 2;
					scene.add( mesh );
				
				}

				geometry = new THREE.IcosahedronGeometry( 1.5, 2 );
				material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
				imposter = new THREE.Mesh( geometry, material );
				scene.add(imposter);

			},

			setupPostProcessing = function(){
				renderer.autoClear = false;

				composer = new THREE.EffectComposer( renderer );
				composer.addPass( new THREE.RenderPass( scene, camera ) );

				var bloomEffect = new THREE.BloomPass(0.8);
				composer.addPass( bloomEffect );
				
				var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
  				effectFXAA.uniforms.resolution.value.set( 1 / renderer.domElement.width, 1 / renderer.domElement.height );
  				window.addEventListener('resize', function(){
					effectFXAA.uniforms.resolution.value.set( 1 / renderer.domElement.width, 1 / renderer.domElement.height );
				});
				effectFXAA.renderToScreen = true;
				composer.addPass( effectFXAA );
			},

			update = function(timestep){
				pointLight.position.y = imposter.position.y = Math.sin(clock.getElapsedTime()/2) * 6;
			},
			
			draw = function(interpolation){
				composer.render();
			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))