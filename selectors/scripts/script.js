import camelCase from '../node_modules/camelcase/index.js'; // импорт модуля для записи в стиле camelCase

const params = {
	onlyClasses: false, // селектор только классов
	onlyId: false, // селектор только id
	useQuerySelector: false, // вид селекторов
	variable: 'const', //const/let/var
	useShorthand: false, // использовать короткую запись
};

// шаблон HTML для демо-версии
document.querySelector('.html-code').value = `<header class="header">
<div class="header__body">
    <div class="header__logo">
        <img class="logo__img">
    </div>
    <nav class="header__navigation">
        <div class="navigation__item-1"></div>
        <div class="navigation__item"></div>
        <div class="navigation__item-3"></div>
        <div class="navigation__item"></div>
    </nav>
    <button id="btn"><button>
</div>
</header>`;

// запуск демо версии по клику на кнопку
document.querySelector('#testBtn').onclick = () => {
	document.querySelector('.result').value = `${getCode(
		document.querySelector('.html-code').value
	)}`.trim();
};

// выборка элементов из DOM
const area = document.getElementById('out'); // textarea
const copyBtn = document.getElementById('copy'); // кнопка 'скопировать'

// получаем код
function getCode(htmlCode) {
	const rawCode = htmlCode.trim(); // обрезаем лишние пробелы и делим слова
	let outCode = ''; // готовый код
	// если включен параметер выборки только id
	if (params.onlyId) {
		outCode = `// выбираем id
        ${getId(rawCode)}`;
		return outCode;
	}
	// если включен параметер выборки только class
	if (params.onlyClasses) {
		outCode = `// выбираем классы
        ${getClasses(rawCode)}`;
		return outCode;
	}
	// если включен параметер выборки "все"
	outCode = `
    // выбираем классы
    ${getClasses(rawCode)}
    // выбираем id
    ${getId(rawCode)}
    `;
	return outCode;
}

// копирование кода в буфер по нажатию
copyBtn.onclick = () => {
	area.select();
	document.execCommand('copy');
	copyBtn.innerHTML = 'скопировано!';
};

// функция создания селекторов классов (принимает в качестве аргумента сырой HTML код)
function getClasses(code) {
	/* поиск классов (class="любой текст") по регулярному выражению */
	const rawClasses = code.match(/class="([\w-\s]+)"/g);
	if (rawClasses == null) return 'no classes'; // если нет id возвращаем текст что классов нет

	const classes = []; // массив классов

	// обрезаем лишнее и оставляем только сами имена классов
	rawClasses.forEach(item => classes.push(item.slice(7, -1)));

	let uniqueClasses = []; // массив уникальных элементов

	// фильтрация повторяющихся классов
	classes.forEach(element => {
		// если элемент содержится в массиве то пропускаем, иначе добавляем
		if (!uniqueClasses.includes(element)) {
			uniqueClasses.push(element);
		}
	});

	// разбиваем элементы массива на слова (если элемент имеет несколько клссов)
	uniqueClasses = uniqueClasses.join(' ').split(' ');

	const selectors = []; // массив готовых селекторов
	// если включен параметр импользования сокращенной записи
	if (params.useShorthand) {
		// пушим переменную
		selectors.push(params.variable);
		// пушим все классы во обертке селектора и переделывем запись в camelCase
		uniqueClasses.forEach((htmlClass, index) => {
			if (uniqueClasses.length - 1 == index) {
				// если элемент последний ставим ";"
				selectors.push(
					` ${camelCase(
						htmlClass
					)} = document.querySelector('.${htmlClass}');\n`
				);
			} else {
				// если не последний то ставим ","
				selectors.push(
					` ${camelCase(
						htmlClass
					)} = document.querySelector('.${htmlClass}'),\n`
				);
			}
		});
	} else {
		// если параметр сокращенной записи выключен
		uniqueClasses.forEach(htmlClass =>
			// пушим класс в обертке слектора с переменной
			selectors.push(
				` ${params.variable} ${camelCase(
					htmlClass
				)} = document.querySelector('.${htmlClass}');\n`
			)
		);
	}
	return selectors.join(''); // возвращаем массив готовых селекторов в виде строки
}

// функция создания селекторов id (почти то же самое)
function getId(code) {
	const rawId = code.match(/id="([\w-\s]+)"/g); // поиск классов по регулярному выражению
	if (rawId == null) return 'no id'; // если нет id выходим

	const id = []; // массив id
	rawId.forEach(item => id.push(item.slice(4, -1))); // обрезаем лишнее

	let uniqueId = []; // массив уникальных элементов
	// фильтрация повторяющихся id
	id.forEach(element => {
		// если элемент содержится в массиве то пропускаем, иначе добавляем
		if (!uniqueId.includes(element)) {
			uniqueId.push(element);
		}
	});

	// разбиваем элементы массива на слова (если элемент имеет несколько клссов)
	uniqueId = uniqueId.join(' ').split(' ');

	const selectors = [];
	// если включен параметр короткой записи
	if (params.useShorthand) {
		// пушим переменную
		selectors.push(params.variable);
		// если включен параметр записи селекторов в виде querySelector
		if (params.useQuerySelector) {
			uniqueId.forEach((htmlId, index) => {
				// пушим в массив selectors элементы в обертке селектора
				if (uniqueId.length - 1 == index) {
					// если элемент последний ставим ";"
					selectors.push(
						` ${camelCase(htmlId)} = document.querySelector('#${htmlId}');\n`
					);
				} else {
					// если не последний то ставим ","
					selectors.push(
						` ${camelCase(htmlId)} = document.querySelector('#${htmlId}'),\n`
					);
				}
			});
		} else {
			// если выключен используется getElementById
			uniqueId.forEach((htmlId, index) => {
				if (uniqueId.length - 1 == index) {
					selectors.push(
						` ${camelCase(htmlId)} = document.getElementById('${htmlId}');\n`
					);
				} else {
					selectors.push(
						` ${camelCase(htmlId)} = document.getElementById('${htmlId}'),\n`
					);
				}
			});
		}
	} else {
		if (params.useQuerySelector) {
			uniqueId.forEach(htmlId => {
				selectors.push(
					` ${params.variable} ${camelCase(
						htmlId
					)} = document.querySelector('#${htmlId}');\n`
				);
			});
		} else {
			uniqueId.forEach(htmlId => {
				selectors.push(
					` ${params.variable} ${camelCase(
						htmlId
					)} = document.getElementById('${htmlId}');\n`
				);
			});
		}
	}
	return selectors.join(''); // возвращаем массив селекторов в виде строки
}

const btnProcess = document.querySelector('.process');
const input = document.querySelector('#input');
btnProcess.addEventListener('click', () => {
	area.value = `${getCode(input.value)}`;
});

// часть отвечающая за блок настроек
// выборка элементов из DOM
const paramsUseQueryselector = document.getElementById('querySelector'),
	paramsOnlyClasses = document.getElementById('onlyClasses'),
	paramsOnlyId = document.getElementById('onlyId'),
	paramsUseShorthand = document.getElementById('useShorthand'),
	dropdown = document.querySelector('.dropdown');

/* 
часть отвечающая за то что бы нельзя было нажать 2 кнопки сразу
иначе ничего не выберется
*/

paramsOnlyClasses.addEventListener('change', () => {
	/*
    присваеваем значение параметру onlyClasses в объекте настроек true/false
    в зависимости от состояния чекбокса
     */
	params.onlyClasses = paramsOnlyClasses.checked;
	paramsOnlyId.checked = !paramsOnlyClasses;
	params.onlyId = !paramsOnlyClasses;
});
paramsOnlyId.addEventListener('change', () => {
	/*
    присваеваем значение параметру onlyId в объекте настроек true/false
    в зависимости от состояния чекбокса
     */
	params.onlyId = paramsOnlyId.checked;
	paramsOnlyClasses.checked = !paramsOnlyId;
	params.onlyClasses = !paramsOnlyId;
});
paramsUseQueryselector.addEventListener('change', () => {
	/*
    присваеваем значение параметру useQuerySelector в объекте настроек true/false
    в зависимости от состояния чекбокса
     */
	params.useQuerySelector = paramsUseQueryselector.checked;
});
paramsUseShorthand.addEventListener('change', () => {
	/*
    присваеваем значение параметру useShorthand в объекте настроек true/false
    в зависимости от состояния чекбокса
     */
	params.useShorthand = paramsUseShorthand.checked;
});

// скрипт выпадающего меню
const select = dropdown.querySelector('.select'),
	caret = dropdown.querySelector('.caret'),
	menu = dropdown.querySelector('.menu'),
	options = dropdown.querySelectorAll('.menu li');

// добавляем слушатель события клика на меню
select.addEventListener('click', () => {
	// добавляем классы
	select.classList.toggle('select-clicked');
	caret.classList.toggle('caret-rotate');
	menu.classList.toggle('menu-open');
});

options.forEach(option => {
	option.addEventListener('click', () => {
		// меняем текст
		select.textContent = option.textContent;

		/* присваеваем значение параметру variable в объекте настроек
        в зависимости от выбора */
		params.variable = option.textContent;

		// удаляем классы
		select.classList.remove('select-clicked');
		caret.classList.remove('caret-rotate');
		menu.classList.remove('menu-open');
		options.forEach(option => {
			option.classList.remove('active');
		});
		// добавляем выделение выбранной опции
		option.classList.add('active');
	});
});

/*

    ||================================
    ||                              ||
    ||            Автор:            ||
    ||        Балушин Кирилл        ||
    ||             ----             ||
    ||                              ||
    ||   GitHub: github.com/kir1l   ||
    ||                              ||
    ||             ____             ||
    ================================||

*/
