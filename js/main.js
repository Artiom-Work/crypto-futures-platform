'use strict';
const sphereIcon = document.querySelector('dotlottie-player.menu__link-background');

// for sphere animation 
function waitForShadowRoot(element, callback, interval = 100, timeout = 5000) {
	const start = Date.now();
	(function check() {
		if (element.shadowRoot) {
			callback(element.shadowRoot);
		} else if (Date.now() - start < timeout) {
			setTimeout(check, interval);
		} else {
			console.warn('shadowRoot did not appear within the allotted time');
		}
	})();
}

waitForShadowRoot(sphereIcon, (shadowRoot) => {
	const animationContainer = shadowRoot.getElementById('animation-container');
	if (animationContainer) {
		animationContainer.style.cssText = "width: 200% ; height: 200%; left: -50%; top: -50%;";
	} else {
		console.warn('animation container not found in Shadow DOM');
	}
});



