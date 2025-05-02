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

// Code for graph in the block who-uses

const GRAPH_CONFIG = {
	// Конфигурация графика-кольца. Данные вводить сдесь ! 
	segments: [
		{ value: 42, label: 'Криптоинвесторы', color: 'var(--color-green-light)' },
		{ value: 23, label: 'Новички', color: 'var(--color-green)' },
		{ value: 23, label: 'Опытные пользователи', color: 'var(--color-blue)' },
		{ value: 12, label: 'Стратегические партнеры', color: 'var(--color-violet)' }
	],
	baseWidth: 44,
	baseHeight: 30,
	baseGraphWidth: 174,
	labelOffset: 45
};


function initGraph() {
	document.querySelectorAll('.who-uses__graph-image-value').forEach(el => el.remove());
	document.querySelectorAll('.metrics-list__item').forEach(el => el.remove());

	updateGraphData();
	updateGraphLabels();

	const resizeObserver = new ResizeObserver(updateGraphLabels);
	resizeObserver.observe(document.querySelector('.who-uses__graph-image'));
}
function updateGraphData() {
	const graphElement = document.querySelector('.who-uses__graph');
	const metricsList = document.querySelector('.metrics-list');

	document.querySelectorAll('.who-uses__graph-image-value').forEach(el => el.remove());
	metricsList.innerHTML = '';

	GRAPH_CONFIG.segments.forEach((segment, index) => {
		graphElement.style.setProperty(`--value-${index + 1}`, segment.value);

		const valueElement = document.createElement('span');
		valueElement.className = 'who-uses__graph-image-value';
		valueElement.dataset.value = segment.value;
		graphElement.querySelector('.who-uses__graph-image').appendChild(valueElement);

		const item = document.createElement('div');
		item.className = 'metrics-list__item';

		const valueDiv = document.createElement('dt');
		valueDiv.className = 'metrics-list__value';
		valueDiv.style.background = segment.color;
		valueDiv.textContent = `${segment.value}%`;

		const labelDiv = document.createElement('dd');
		labelDiv.className = 'metrics-list__name';
		labelDiv.textContent = segment.label;

		item.append(valueDiv, labelDiv);
		metricsList.appendChild(item);
	});
}

function updateGraphLabels() {
	const graph = document.querySelector('.who-uses__graph-image');
	const graphWidth = graph.offsetWidth;
	const scaleFactor = graphWidth / GRAPH_CONFIG.baseGraphWidth;

	const graphRadius = graphWidth / 2;
	const ringInner = graphRadius * 0.48;
	const ringThickness = graphRadius * (0.70 - 0.48);

	document.querySelectorAll('.who-uses__graph-image-value').forEach((element, index) => {
		const angle = calculateSegmentAngle(index);
		const radians = angle * (Math.PI / 180);
		const radius = ringInner + ringThickness / 2 + GRAPH_CONFIG.labelOffset * scaleFactor;

		element.style.cssText = `
      width: ${GRAPH_CONFIG.baseWidth * scaleFactor}px;
      height: ${GRAPH_CONFIG.baseHeight * scaleFactor}px;
      transform: translate(
        calc(${radius * Math.cos(radians)}px - 50%), 
        calc(${radius * Math.sin(radians)}px - 50%)
      );
    `;
	});
}

function calculateSegmentAngle(index) {
	let cumulativeSum = 0;
	for (let i = 0; i < index; i++) {
		cumulativeSum += GRAPH_CONFIG.segments[i].value;
	}
	return (cumulativeSum + GRAPH_CONFIG.segments[index].value / 2) * 3.6 - 90;
}

initGraph();