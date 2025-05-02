'use strict';
const sphereIcon = document.querySelector('dotlottie-player.menu__link-background');
const investTablesSection = document.querySelector('.invest-indicators');
const investTableBalanceRows = investTablesSection.querySelectorAll('.calc-table__row--cash-balance');

// Code for styling sphere animation 
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

// Code for invest tables
cellPainting(investTableBalanceRows);

function cellPainting(rowsList) {
	rowsList.forEach(row => {
		const tds = row.querySelectorAll('td');
		for (let i = 1; i < tds.length; i++) {
			const cell = tds[i];
			const value = parseFloat(cell.textContent.replace(/\s/g, '').replace(',', '.'));
			if (!isNaN(value) && value < 0) {
				cell.style.cssText = "color: var(--color-red); background-color: var(--color-pink);";
			}
		}
	});
}


