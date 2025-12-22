var ad1 = null;
window.showAd1 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');	
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = '2%';
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '728x90');
}
window.showAd2 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = '33%';
	ad1.style.marginTop = "0";
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';	
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '320x50');
}

window.showAd3 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = "0";
     ad1.style.marginTop = "-20%";
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';	
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '320x50');
}


window.setPositionLandscape=function(){
	if(ad1){
	 ad1.style.bottom = "0";
     ad1.style.marginTop = "-20%";
	}
}

window.setPositionPortrait=function(){
	if(ad1){
	ad1.style.bottom = "15%";
	ad1.style.marginTop = "0";
	}
}

window.destroyAd1 = function(){
	if(ad1){
		PokiSDK.destroyAd(ad1);
		ad1 = null;
	}
}









const scriptsInEvents = {

		async Homee_Event23_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStart();
		},

		async Homee_Event24_Act2(runtime, localVars)
		{
			  PokiSDK.commercialBreak()
			   .then(() => {
			   PokiSDK.gameplayStart();
			   });
		},

		async Homee_Event58_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStart();
		},

		async Homee_Event59_Act2(runtime, localVars)
		{
			  PokiSDK.commercialBreak()
			   .then(() => {
			   PokiSDK.gameplayStart();
			   });
		},

		async Starte_Event2_Act2(runtime, localVars)
		{
			PokiSDK.init();
		},

		async Globale_Event7_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStop();
		},

		async Globale_Event7_Act2(runtime, localVars)
		{
			window.destroyAd1();
		},

		async Globale_Event8_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStop();
		},

		async Globale_Event8_Act2(runtime, localVars)
		{
			window.destroyAd1();
		},

		async Globale_Event12_Act3(runtime, localVars)
		{
			PokiSDK.gameplayStop();
		},

		async Globale_Event12_Act4(runtime, localVars)
		{
			 PokiSDK.rewardedBreak().then(
			 
			        (withReward) => {
			            if(withReward){
			               
			                //resume game
							runtime.callFunction("rewardedSuccessful");
							PokiSDK.gameplayStart();
			            }else{
						runtime.callFunction("unpauseGame");
						PokiSDK.gameplayStart();
						}
			        }
			
			    )
		},

		async Globale_Event30_Act2(runtime, localVars)
		{
			PokiSDK.gameplayStop();
		},

		async Globale_Event30_Act3(runtime, localVars)
		{
			 PokiSDK.rewardedBreak().then(
			 
			        (withReward) => {
			            if(withReward){
			               
			                //resume game
							runtime.callFunction("rewardedSuccessful");
							PokiSDK.gameplayStart();
			            }else{
						runtime.callFunction("unpauseGame");
						PokiSDK.gameplayStart();
						}
			        }
			
			    )
		},

		async Globale_Event39_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStop();
		},

		async Globale_Event43_Act1(runtime, localVars)
		{
			window.showAd2();
			window.setPositionPortrait();
		},

		async Globale_Event44_Act1(runtime, localVars)
		{
			window.showAd3();
			window.setPositionLandscape();
		},

		async Globale_Event46_Act1(runtime, localVars)
		{
			window.showAd3();
			
		},

		async Globale_Event47_Act1(runtime, localVars)
		{
			window.showAd1();
		},

		async Globale_Event53_Act1(runtime, localVars)
		{
			window.destroyAd1();
		},

		async Globale_Event124_Act2(runtime, localVars)
		{
			  PokiSDK.commercialBreak()
			   .then(() => {
			   runtime.callFunction("pokiCommercial"); 
			   runtime.callFunction("unpauseGame");
			   window.destroyAd1();
			   PokiSDK.gameplayStart();
			   });
		},

		async Globale_Event139_Act2(runtime, localVars)
		{
			  PokiSDK.commercialBreak()
			   .then(() => {
			   runtime.callFunction("pokiCommercial"); 
			   runtime.callFunction("unpauseGame");
			   window.destroyAd1();
			   PokiSDK.gameplayStart();
			   });
		},

		async Levelselecte_Event6_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStart();
		},

		async Levelselecte_Event13_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStart();
		}

};

self.C3.ScriptsInEvents = scriptsInEvents;

