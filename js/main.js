'use strict';

const sphereIcon = document.querySelector('dotlottie-player.menu__link-background');
const preloader = document.querySelector('.preloader');
const contentWrapper = document.querySelector('.body__container');
const creatingTablesForm = document.getElementById('create-tables-form');
const creatingTablesFormInput = document.getElementById('create-tables-password');

const passwordToSeeNumbers = 12345678;
let mutationObserver;

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

// Code for translate page ( Google Translate Widget )

const languages = {
	ru: () => {
		localStorage.setItem("language", "ru");
		setLanguage('ru');
	},
	en: () => {
		localStorage.setItem("language", "en");
		setLanguage('en');
	},
	ar: () => {
		localStorage.setItem("language", "en");
		setLanguage('ar');
	},
	cn: () => {
		localStorage.setItem("language", "en");
		setLanguage('zh-CN');
	}
};

window.addEventListener('load', () => {
	const lang = localStorage.getItem('language') || 'en';
	showPreloader();
	if (!localStorage.getItem('language')) {
		document.getElementById('translate-to-english').click();
	} else {
		setTimeout(() => {
			hidePreloader();
		}, 3000);
	}
});

function setLanguage(lang) {
	contentWrapper.classList.add('hide-content');

	setTimeout(() => {
		showPreloader();
		document.cookie = "googtrans=/ru/" + lang;
		window.location.reload();
	}, 400);
}

document.getElementById('translate-to-english').addEventListener('click', languages.en);
document.getElementById('translate-to-arabic').addEventListener('click', languages.ar);
document.getElementById('translate-to-russian').addEventListener('click', languages.ru);
document.getElementById('translate-to-chinese').addEventListener('click', languages.cn);

// Code for plreloader and load page
function showPreloader() {
	preloader.classList.remove('visually-hidden');

	if (!contentWrapper.classList.contains('hide-content')) {
		contentWrapper.classList.add('hide-content');
	}
	if (mutationObserver) {
		mutationObserver.disconnect();
	}

	mutationObserver = new MutationObserver(() => {
		hidePreloader();
		mutationObserver.disconnect();
	});

	mutationObserver.observe(contentWrapper, { childList: true, subtree: true, characterData: true });
}

function hidePreloader() {
	preloader.classList.add('fade-out');

	setTimeout(() => {
		preloader.classList.add('visually-hidden');
		contentWrapper.classList.remove('hide-content');
	}, 400);
}

// Code for creating secret tables ( form in block originality )
creatingTablesForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// const input = document.getElementById('create-tables-password');
	const inputValue = creatingTablesFormInput.value.trim();

	if (inputValue === '') {
		creatingTablesFormInput.setCustomValidity('The password is too short');
		creatingTablesFormInput.reportValidity();
		creatingTablesFormInput.style.cssText = "background-color: var(--color-pink);";
		setTimeout(() => creatingTablesFormInput.removeAttribute('style'), 2000);
	}
	else if (Number(inputValue) !== passwordToSeeNumbers) {
		creatingTablesFormInput.setCustomValidity('The password is incorrect, try again...');
		creatingTablesFormInput.reportValidity();
		creatingTablesFormInput.style.cssText = "background-color: var(--color-pink);";
		setTimeout(() => creatingTablesFormInput.removeAttribute('style'), 2000);
	}
	else {
		addTablesToHtml();
		creatingTablesFormInput.value = '';
	}
});

creatingTablesFormInput.addEventListener('input', () => {
	creatingTablesFormInput.setCustomValidity('');
	creatingTablesFormInput.removeAttribute('style');
	creatingTablesFormInput.reportValidity();
});

function cellPainting(rowsList) {
	// Code for invest tables (painting colors of cells)
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

function addTablesToHtml() {
	const startPointDriving = document.querySelector('.originality');
	let investTablesSection = document.querySelector('.invest-indicators');

	if (startPointDriving && investTablesSection === null) {
		const tableSections = `
						<section class="numbers section">
				<h2 class="visually-hidden">Цифры Mini-app Q</h2>

				<div class="numbers__inner">

					<div class="numbers__top-tables-group">
						<h3 class="numbers__title title-big">Цифры Q</h3>

						<table class="numbers__table--readiness table">
							<caption class="numbers__table-title--readiness table__title">
								Готовность
							</caption>
							<thead class="table__head">
								<tr class="table__row table__row--head">
									<th>Блок</th>
									<th>Статус</th>
								</tr>
							</thead>
							<tbody>
								<tr class="table__row">
									<td>Бэк-енд</td>
									<td>100&nbsp;%</td>
								</tr>
								<tr class="table__row">
									<td>Фронт-енд</td>
									<td>100&nbsp;%</td>
								</tr>
								<tr class="table__row">
									<td>Интергация</td>
									<td>90&nbsp;%</td>
								</tr>
								<tr class="table__row">
									<td>Общая готовность продукта</td>
									<td>98&nbsp;%</td>
								</tr>
							</tbody>
						</table>

						<table class="numbers__table--metrics table">
							<caption class="numbers__table-title--metrics table__title">
								Ключевые метрики
							</caption>
							<thead class="table__head">
								<tr class="table__row table__row--head">
									<th>Показатель</th>
									<th>Значение</th>
								</tr>
							</thead>
							<tbody>
								<tr class="table__row">
									<td>CAC (ср.)</td>
									<td>7,15&nbsp;$</td>
								</tr>
								<tr class="table__row">
									<td>ARPU</td>
									<td>25,63&nbsp;$</td>
								</tr>
								<tr class="table__row">
									<td>LTV</td>
									<td>36,61&nbsp;$</td>
								</tr>
								<tr class="table__row">
									<td>LTV&nbsp;/ CAC</td>
									<td>5,12</td>
								</tr>
							</tbody>
						</table>
					</div>

					<table class="numbers__table--income-sources table">
						<caption class="numbers__table-title--income-sources table__title">
							Источники дохода
						</caption>

						<thead class="table__head">
							<tr class="table__row table__row--head">
								<th>Статья дохода</th>
								<th>%&nbsp;от&nbsp;оборота</th>
								<th>Комментарий</th>
							</tr>
						</thead>

						<tbody>
							<tr class="table__row">
								<td>Комиссия сети</td>
								<td>0,99&nbsp;$ за&nbsp;транзакцию</td>
								<td>стандарт для внутренних переходов</td>
							</tr>
							<tr class="table__row">
								<td>Комиссия за фьючерсы</td>
								<td>0,77&nbsp;% (после дисконта)</td>
								<td>включает партнёрскую скидку</td>
							</tr>
							<tr class="table__row">
								<td>Swap/финансирование</td>
								<td>1&nbsp;% в&nbsp;месяц на&nbsp;открытие позиции</td>
								<td>распределяется ежедневно</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="numbers__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--three-month section">
				<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 1-3 месяца</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;1-3 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>1</th>
								<th>2</th>
								<th>3</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>
								<td>1922</td>
								<td>21 141</td>
								<td>59 580</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Крипто-платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>1 485</td>
								<td>16 335</td>
								<td>46 035</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>363</td>
								<td>3 989</td>
								<td>11 243</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>74</td>
								<td>817</td>
								<td>2 302</td>
							</tr>

							<tr class="empty-row">

								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">

								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>1 000</td>
								<td>10 000</td>
								<td>20 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>150</td>
								<td>1 500</td>
								<td>3 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>7 425</td>
								<td>81 675</td>
								<td>230 175</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>1 500</td>
								<td>16 500</td>
								<td>46 500</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>75</td>
								<td>825</td>
								<td>2 325</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты после оттока (30%)
								</td>
								<td>52,5</td>
								<td>577,5</td>
								<td>1 628</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="forecast__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--six-month section">
				<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 4-6 месяца</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;4-6 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>4</th>
								<th>5</th>
								<th>6</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>

								<td>443 964</td>
								<td>1 404 927</td>
								<td>3 326 851</td>
							</tr>

							<tr class="empty-row">

								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Крипто-платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>343 035</td>
								<td>1 085 535</td>
								<td>2 570 535</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>83 778</td>
								<td>265 115</td>
								<td>627 789</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>17 152</td>
								<td>54 227</td>
								<td>128 527</td>
							</tr>

							<tr class="empty-row">

								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">

								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>200 000</td>
								<td>500 000</td>
								<td>1 000 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>30 000</td>
								<td>75 000</td>
								<td>150 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>1 715 175</td>
								<td>5 427 675</td>
								<td>12 852 675</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>346 500</td>
								<td>1 096 500</td>
								<td>2 596 500</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>17 325</td>
								<td>54 825</td>
								<td>129 825</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты после оттока (30%)
								</td>
								<td>12 128</td>
								<td>38 378</td>
								<td>90 878</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="forecast__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--nine-month section">
				<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 7-9 месяцев</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;7-9 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>7</th>
								<th>8</th>
								<th>9</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>

								<td>6 690 218</td>
								<td>10 534 066</td>
								<td>18 221 763</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Крипто-платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>5 169 285</td>
								<td>8 139 285</td>
								<td>14 079 285</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>1 262 469</td>
								<td>1 987 817</td>
								<td>3 438 513</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>258 464</td>
								<td>406 964</td>
								<td>703 964</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>1 750 000</td>
								<td>2 000 000</td>
								<td>4 000 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>262 500</td>
								<td>300 000</td>
								<td>600 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>25 846 425</td>
								<td>40 696 425</td>
								<td>70 396 425</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>5 221 500</td>
								<td>8 221 500</td>
								<td>14 221 500</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>261 075</td>
								<td>411 075</td>
								<td>711 075</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты после оттока (30%)
								</td>
								<td>182 753</td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="forecast__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--twelve-month section">
				<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 10-12 месяцев</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;10-12 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>10</th>
								<th>11</th>
								<th>12</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>

								<td>29 753 307</td>
								<td>45 128 700</td>
								<td>64 347 942</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Крипто-платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>22 929 285</td>
								<td>34 869 285</td>
								<td>49 719 285</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>5 614 558</td>
								<td>8 515 951</td>
								<td>12 142 692</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>1 149 464</td>
								<td>1 743 464</td>
								<td>2 485 964</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>6 000 000</td>
								<td>8 000 000</td>
								<td>10 000 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>900 000</td>
								<td>1 200 000</td>
								<td>1 500 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>114 946 425</td>
								<td>174 346 425</td>
								<td>248 596 425</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>23 221 500</td>
								<td>35 221 500</td>
								<td>50 221 500</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>1 161 075</td>
								<td>1 761 075</td>
								<td>2 511 075</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="forecast__decor-background forecast__decor-background--long section__decor-background "></div>
			</section>

						<section class="invest-indicators section">
				<h2 class="visually-hidden">Инвестиционные показатели Mini-app Q</h2>

				<div class="invest-indicators__inner container">
					<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-1">
						<caption class="calc-table__title calc-table__title--invest">
							Инвестиционные показатели (&nbsp;1-12 месяцев&nbsp;)
							<br>
							ROI <span class="calc-table__text calc-table__text--green">179.46%</span>
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>1</th>
								<th>2</th>
								<th>3</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Расходы, $/мес
								</td>
								<td>276 603</td>
								<td>67 134</td>
								<td>167 178</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									ФОТ
								</td>
								<td>43 850</td>
								<td>43 850</td>
								<td>43 850</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Реферальная система
								</td>
								<td>751</td>
								<td>8 262</td>
								<td>23 283</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Нейросети
								</td>
								<td>2</td>
								<td>23</td>
								<td>45</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Социальная активность
								</td>
								<td>15 000</td>
								<td>15 000</td>
								<td>100 000</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Copeex (data centr)
								</td>
								<td>217 000</td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Доходы, $/мес
								</td>
								<td></td>
								<td>1 922</td>
								<td>21 141</td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title calc-table__row-title--red">
									Баланс денежных средств
								</td>
								<td>-276 603</td>
								<td>-65 212</td>
								<td>-146 037</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Денежные средства на&nbsp;конец периода
								</td>
								<td>-276 603</td>
								<td>-341 816</td>
								<td>-487 853</td>
							</tr>

							<tr class="calc-table__row calc-table__row--blue">
								<td>
									Инвестиции
								</td>
								<td>3 500 00</td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Баланс денежных средств с учётом инвестиций
								</td>
								<td>3 223 397</td>
								<td>2 881 581</td>
								<td>2 393 728</td>
							</tr>
						</tbody>
					</table>
					<div class="block-text__decor-devider section__decor-background"></div>
					<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-2">
						<caption class="visually-hidden">
							Таблица инвестиционных показателей Mini-app Q за 3- 6 месяцев
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>4</th>
								<th>5</th>
								<th>6</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Расходы, $/мес
								</td>
								<td>219 371</td>
								<td>599 648</td>
								<td>1 359 980</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									ФОТ
								</td>
								<td>43 850</td>
								<td>43 850</td>
								<td>43 850</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Реферальная система
								</td>
								<td>173 499</td>
								<td>549 036</td>
								<td>1 300 112</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Нейросети
								</td>
								<td>450</td>
								<td>1 125</td>
								<td>2 250</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Социальная активность
								</td>
								<td>1 572</td>
								<td>5 637</td>
								<td>13 768</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Copeex (data centr)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Доходы, $/мес
								</td>
								<td>59 580</td>
								<td>443 964</td>
								<td>1 404 927</td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title calc-table__row-title--red">
									Баланс денежных средств
								</td>
								<td>-159 791</td>
								<td>-155 684</td>
								<td>44 946</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Денежные средства на&nbsp;конец периода
								</td>
								<td>-647 644</td>
								<td>-803 328</td>
								<td>-758 382</td>
							</tr>

							<tr class="calc-table__row calc-table__row--blue">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Баланс денежных средств с учётом инвестиций
								</td>
								<td>1 746 084</td>
								<td>942 756</td>
								<td>184 374</td>
							</tr>
						</tbody>
					</table>
					<div class="block-text__decor-devider section__decor-background"></div>
					<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-3">
						<caption class="visually-hidden">
							Таблица инвестиционных показателей Mini-app Q за 7 - 9 месяцев
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>7</th>
								<th>8</th>
								<th>9</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Расходы, $/мес
								</td>
								<td>2 690 282</td>
								<td>4 209 270</td>
								<td>7 250 599</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									ФОТ
								</td>
								<td>43 850</td>
								<td>43 850</td>
								<td>43 850</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Реферальная система
								</td>
								<td>2 614 495</td>
								<td>4 116 647</td>
								<td>7 120 950</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Нейросети
								</td>
								<td>3 938</td>
								<td>4 500</td>
								<td>9 000</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Социальная активность
								</td>
								<td>28 000</td>
								<td>44 274</td>
								<td>76 798</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Copeex (data centr)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Доходы, $/мес
								</td>
								<td>3 326 851</td>
								<td>6 690 218</td>
								<td>10 534 066</td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title calc-table__row-title--red">
									Баланс денежных средств
								</td>
								<td>636 568</td>
								<td>2 480 947</td>
								<td>3 283 468</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Денежные средства на&nbsp;конец периода
								</td>
								<td>-121 813</td>
								<td>2 359 134</td>
								<td>5 642 602</td>
							</tr>

							<tr class="calc-table__row calc-table__row--blue">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Баланс денежных средств с учётом инвестиций
								</td>
								<td>62 561</td>
								<td>2 421 695</td>
								<td>8 064 267</td>
							</tr>
						</tbody>
					</table>
					<div class="block-text__decor-devider section__decor-background"></div>
					<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-4">
						<caption class="visually-hidden">
							Таблица инвестиционных показателей Mini-app Q за 10 - 12 месяцев
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>10</th>
								<th>11</th>
								<th>12</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Расходы, $/мес
								</td>
								<td>11 810 356</td>
								<td>17 888 544</td>
								<td>25 485 161</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									ФОТ
								</td>
								<td>43 850</td>
								<td>43 850</td>
								<td>43 850</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Реферальная система
								</td>
								<td>11 627 406</td>
								<td>17 636 013</td>
								<td>25 146 771</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Нейросети
								</td>
								<td>13 500</td>
								<td>18 000</td>
								<td>22 500</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Социальная активность
								</td>
								<td>135 601</td>
								<td>190 681</td>
								<td>272 039</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Copeex (data centr)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Доходы, $/мес
								</td>
								<td>18 221 763</td>
								<td>29 753 307</td>
								<td>45 128 700</td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title calc-table__row-title--red">
									Баланс денежных средств
								</td>
								<td>6 411 406</td>
								<td>11 864 764</td>
								<td>19 643 540</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Денежные средства на&nbsp;конец периода
								</td>
								<td>12 054 008</td>
								<td>23 918 772</td>
								<td>43 562 311</td>
							</tr>

							<tr class="calc-table__row calc-table__row--blue">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Баланс денежных средств с учётом инвестиций
								</td>
								<td>20 118 305</td>
								<td>44 037 077</td>
								<td>87 599 388</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="invest-indicators__decor-background section__decor-background "></div>
			</section>
		`;
		startPointDriving.insertAdjacentHTML('afterend', tableSections);
		investTablesSection = document.querySelector('.invest-indicators');
		const investTableBalanceRows = investTablesSection.querySelectorAll('.calc-table__row--cash-balance');

		cellPainting(investTableBalanceRows);
	} else {
		console.log('There is already a table instance on the page...');
	}
};



