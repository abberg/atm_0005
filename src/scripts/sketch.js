(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			occlusionScene = new THREE.Scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			clock = new THREE.Clock(true),
			pointLight,
			imposter,
			occlusionLight,
			occlusionComposer,
			finalComposer,
			godRays,
			additiveBlend,
			lightScreenPosition = new THREE.Vector3(),

			init = function(){
				addLights();
				addMeshes();
				setupPostProcessing();
				camera.position.set(0, 0, 15);
			},
			
			addLights = function(){
				var keyLight,
					bounceLight;

				keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
				keyLight.position.set(0, 1, 0);
				scene.add(keyLight);

				bounceLight = new THREE.DirectionalLight(0xaaffff, 0.3);
				bounceLight.position.set(0, -1, 0);
				scene.add(bounceLight);

				pointLight = new THREE.PointLight(0xffffff, 0.4);
				scene.add(pointLight);

			},

			addMeshes = function(){
				var geometry,
				material,
				mesh,
				occlusionMesh,
				i,
				points = [
					new THREE.Vector3( 3.7, 0, -0.2),
					new THREE.Vector3( 4.2, 0, -0.5),
					new THREE.Vector3( 4.7, 0, -0.5),
					new THREE.Vector3( 4.9, 0, -0.3),
					new THREE.Vector3( 5.1, 0, -0.3),
					new THREE.Vector3( 5.3, 0, -0.5),
					new THREE.Vector3( 6.45, 0, -0.2),
					new THREE.Vector3( 6.45, 0, 0.2),
					new THREE.Vector3( 4.2, 0, 0.5),
					new THREE.Vector3( 3.7, 0, 0.2),
					new THREE.Vector3( 3.7, 0, -0.2),
				]

				for(i = -1; i < 2; i++){
					
					
					geometry = new THREE.LatheGeometry(points, 256);
					material = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, shininess:50, shading: THREE.FlatShading} );
					mesh = new THREE.Mesh( geometry, material );
					
					mesh.position.y = i * 4;
					mesh.rotation.x = Math.PI / 2;
					scene.add( mesh );
					//scene.add(new THREE.FaceNormalsHelper( mesh, 0.3, 0x00ff00, 1 ));

					occlusionMesh = mesh.clone();
					occlusionMesh.material = new THREE.MeshBasicMaterial({color:0x000000});
   					occlusionScene.add(occlusionMesh);

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

				geometry = new THREE.IcosahedronGeometry(2.5, 2);
				material = new THREE.MeshBasicMaterial( { color: 0x6699ff} );
				occlusionLight = new THREE.Mesh( geometry, material );
				occlusionScene.add(occlusionLight);

			},

			setupPostProcessing = function(){

				/*
				var width = window.innerWidth,
				height = window.innerHeight,
				halfWidth = width * 0.5,
				halfHeight = height * 0.5,
				occlusionRender,
				horizontalBlur,
				verticalBlur,
				blurSize,				
				occlusionRenderTarget,
				sceneRender;
 
			occlusionRender = new THREE.RenderPass( occlusionScene, camera );

			horizontalBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
			verticalBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
				
			blurSize = 3;
			 
			horizontalBlur.uniforms.h.value = blurSize / width;
			verticalBlur.uniforms.v.value = blurSize / height;
			 
			godRays = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
			 
			occlusionRenderTarget = new THREE.WebGLRenderTarget( halfWidth, halfHeight, { minFilter: THREE.LinearFilter } );

			occlusionComposer = new THREE.EffectComposer( renderer, occlusionRenderTarget );
			occlusionComposer.addPass( occlusionRender );
			occlusionComposer.addPass( horizontalBlur );
			occlusionComposer.addPass( verticalBlur );
			occlusionComposer.addPass( horizontalBlur );
			occlusionComposer.addPass( verticalBlur );
			occlusionComposer.addPass( godRays );

			sceneRender = new THREE.RenderPass( scene, camera );
			 
			add = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
			add.renderToScreen = true;
			 
			finalComposer = new THREE.EffectComposer( renderer );
			finalComposer.addPass( sceneRender );
			finalComposer.addPass( add );
				*/

				var width = window.innerWidth,
					height = window.innerHeight,
					halfWidth = width * 0.5,
					halfHeight = height * 0.5,
					occlusionRender,
					horizontalBlur,
					verticalBlur,
					blurSize,				
					occlusionRenderTarget,
					sceneRender,
					bloom,
					FXAA;


				occlusionRender = new THREE.RenderPass( occlusionScene, camera );

				horizontalBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
				verticalBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
				blurSize = 3; 
				horizontalBlur.uniforms.h.value = blurSize / width;
				verticalBlur.uniforms.v.value = blurSize / height;
				 
				godRays = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
				 
				occlusionRenderTarget = new THREE.WebGLRenderTarget( halfWidth, halfHeight, { minFilter: THREE.LinearFilter } );

				occlusionComposer = new THREE.EffectComposer( renderer, occlusionRenderTarget );
				occlusionComposer.addPass( occlusionRender );
				occlusionComposer.addPass( horizontalBlur );
				occlusionComposer.addPass( verticalBlur );
				occlusionComposer.addPass( horizontalBlur );
				occlusionComposer.addPass( verticalBlur );
				occlusionComposer.addPass( godRays );

				renderer.autoClear = false;

				sceneRender = new THREE.RenderPass( scene, camera );

				additiveBlend = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
				additiveBlend.uniforms.tAdd.value = occlusionComposer.renderTarget1;

				bloom = new THREE.BloomPass(0.8);
				
				FXAA = new THREE.ShaderPass( THREE.FXAAShader );
  				FXAA.uniforms.resolution.value.set( 1 / renderer.domElement.width, 1 / renderer.domElement.height );

				finalComposer = new THREE.EffectComposer( renderer );
				finalComposer.addPass( sceneRender );
				finalComposer.addPass( bloom );
				finalComposer.addPass( additiveBlend );
				finalComposer.addPass( FXAA );
				FXAA.renderToScreen = true;

				window.addEventListener('resize', function(){

					width = window.innerWidth;
					height = window.innerHeight;
					halfWidth = width * 0.5;
					halfHeight = height * 0.5;

					horizontalBlur.uniforms.h.value = blurSize / width;
					verticalBlur.uniforms.v.value = blurSize / height;

					occlusionRenderTarget = new THREE.WebGLRenderTarget( halfWidth, halfHeight, { minFilter: THREE.LinearFilter } );

					FXAA.uniforms.resolution.value.set( 1 / renderer.domElement.width, 1 / renderer.domElement.height );
				});
			},

			update = function(timestep){
				pointLight.position.y = imposter.position.y = occlusionLight.position.y = Math.sin(clock.getElapsedTime()/2) * 6;
				
				lightScreenPosition.copy(pointLight.position);
				lightScreenPosition.project( camera );
			
				godRays.uniforms.fX.value = ( lightScreenPosition.x + 1 ) - 0.5;
				godRays.uniforms.fY.value = ( lightScreenPosition.y + 1 ) - 0.5;

				additiveBlend.uniforms.tAdd.value = occlusionComposer.renderTarget1;
			},
			
			draw = function(interpolation){
				renderer.setClearColor(0x000000);
				occlusionComposer.render();
				renderer.setClearColor(0x080f18);
				finalComposer.render();
			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))