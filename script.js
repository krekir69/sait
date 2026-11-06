const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';

        navToggle.setAttribute('aria-expanded', String(!expanded));

        navList.classList.toggle('active');
    });

    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}
function findMaxCalories(arr) {
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}
function filterHighCalories(arr) {
    let highCalDishes = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 600) {
            highCalDishes.push(arr[i]);
        }
    }

    return highCalDishes;
}
function calculateTotalCalories(arr) {
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    return sum;
}
function countLowCalories(arr) {
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= 300) {
            count++;
        }
    }

    const proportion = (count / arr.length) * 100;

    return {
        count,
        proportion
    };
}
const studentName = prompt(
    'Привет! Как тебя зовут, кулинар?',
    'Гурман'
);

if (studentName === null) {

    alert('Ввод отменён. Скрипт завершён. Приятного просмотра сайта!');

    console.log('Пользователь отменил ввод имени. Скрипт завершён.');

} else {

    const calories = [];

    const DISH_COUNT = 7;

    let cancelled = false;

    for (let i = 1; i <= DISH_COUNT; i++) {

        let input = prompt(
            `Введите калорийность блюда №${i} (в ккал):`
        );

        if (input === null) {

            console.log(
                `Пользователь отменил ввод на блюде №${i}. Скрипт завершён.`
            );

            cancelled = true;

            break;
        }

        let value = parseFloat(input);

        while (isNaN(value) || value < 0) {

            input = prompt(
                `Ошибка! Введите корректное число для блюда №${i} (или нажмите Отмена для выхода):`
            );

            if (input === null) {

                console.log(
                    `Пользователь отменил ввод на блюде №${i}. Скрипт завершён.`
                );

                cancelled = true;

                break;
            }

            value = parseFloat(input);
        }

        if (cancelled) {
            break;
        }

        calories.push(value);
    }
    if (!cancelled && calories.length === DISH_COUNT) {

        const totalCalories = calculateTotalCalories(calories);

        const highCalDishes = filterHighCalories(calories);

        const highCalSum = calculateTotalCalories(highCalDishes);

        const lowCalResult = countLowCalories(calories);

        const lowCalCount = lowCalResult.count;

        const lowCalProportion = lowCalResult.proportion;

        const maxCalories = findMaxCalories(calories);

        alert(
            `Привет, ${studentName}! Суммарная калорийность – ${totalCalories} ккал, из них ${highCalSum} ккал – в высококалорийных блюдах.`
        );

        console.log(`--- Статистика для ${studentName} ---`);

        console.log(
            `Введённые блюда (ккал): ${calories.join(', ')}`
        );

        console.log(
            `Количество низкокалорийных блюд (≤ 300 ккал): ${lowCalCount}`
        );

        console.log(
            `Доля низкокалорийных блюд: ${lowCalProportion.toFixed(2)}%`
        );

        console.log(
            `Самое калорийное блюдо: ${maxCalories} ккал`
        );
        if (totalCalories > 3000) {

            console.log(
                'Такой рацион лучше распределить на 2 дня'
            );

        } else {

            console.log(
                'Рацион сбалансирован на один день.'
            );

        }
    }
}
(() => {

    'use strict';

    const STORAGE_KEY = 'kirillFoodBlogLab5State';

    const recipeContainer = document.querySelector('#recipeContainer');

    const recipeListWrapper = document.getElementById('recipeListWrapper');

    const recipeStatus = document.getElementById('recipeStatus');

    const addRecipeButton = document.getElementById('addRecipeButton');

    const removeLastRecipeButton = document.getElementById('removeLastRecipeButton');

    const toggleRecipesButton = document.getElementById('toggleRecipesButton');

    const toggleThemeButton = document.getElementById('toggleThemeButton');

    const requiredElements = {
        '#recipeContainer': recipeContainer,
        '#recipeListWrapper': recipeListWrapper,
        '#recipeStatus': recipeStatus,
        '#addRecipeButton': addRecipeButton,
        '#removeLastRecipeButton': removeLastRecipeButton,
        '#toggleRecipesButton': toggleRecipesButton,
        '#toggleThemeButton': toggleThemeButton
    };

    const missingElements = Object.entries(requiredElements)
        .filter(([, element]) => !element)
        .map(([selector]) => selector);

    if (missingElements.length > 0) {

        missingElements.forEach(selector => {
            console.error(`Элемент не найден: ${selector}`);
        });

        return;
    }
    function readDefaultRecipes() {

        return Array.from(
            recipeContainer.querySelectorAll('.recipe-card')
        )
            .map(card => {

                const titleElement = card.querySelector('h3');

                const ingredientsList = card.querySelector('.recipe-ingredients');

                const descriptionElement = card.querySelector('p');

                if (!titleElement || !ingredientsList) {

                    console.error(
                        'Не удалось прочитать исходную карточку рецепта.'
                    );

                    return null;
                }

                const ingredients = Array.from(
                    ingredientsList.querySelectorAll('li')
                )
                    .map(item => item.textContent.trim())
                    .filter(Boolean);

                return {
                    name: titleElement.textContent.trim(),

                    description: descriptionElement
                        ? descriptionElement.textContent.trim()
                        : '',

                    ingredients
                };

            })
            .filter(Boolean);
    }
    function isValidRecipe(recipe) {

        return recipe
            && typeof recipe.name === 'string'
            && recipe.name.trim().length > 0
            && Array.isArray(recipe.ingredients)
            && recipe.ingredients.every(
                ingredient => typeof ingredient === 'string'
            );
    }
    function readSavedState() {

        try {

            const rawState = window.localStorage.getItem(STORAGE_KEY);

            if (!rawState) {
                return null;
            }

            const parsedState = JSON.parse(rawState);

            if (!parsedState || !Array.isArray(parsedState.recipes)) {
                return null;
            }

            return {

                recipes: parsedState.recipes
                    .filter(isValidRecipe)
                    .map(recipe => ({

                        name: recipe.name.trim(),

                        description:
                            typeof recipe.description === 'string'
                                ? recipe.description
                                : '',

                        ingredients: recipe.ingredients
                            .map(item => item.trim())
                            .filter(Boolean)

                    })),

                theme: parsedState.theme === 'dark'
                    ? 'dark'
                    : 'light',

                recipesHidden: parsedState.recipesHidden === true

            };

        } catch (error) {

            console.warn(
                'Не удалось прочитать данные из localStorage. Используются исходные рецепты.',
                error
            );

            return null;
        }
    }
    const defaultRecipes = readDefaultRecipes();

    const savedState = readSavedState();

    let recipes = savedState
        ? savedState.recipes
        : defaultRecipes;

    let currentTheme = savedState
        ? savedState.theme
        : 'light';

    let recipesHidden = savedState
        ? savedState.recipesHidden
        : false;
    function setStatus(message) {

        if (!recipeStatus) {

            console.error('Элемент не найден: #recipeStatus');

            return;
        }

        recipeStatus.textContent = message;
    }
    function saveState() {

        try {

            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({

                    recipes,

                    theme: currentTheme,

                    recipesHidden

                })
            );

        } catch (error) {

            console.error(
                'Не удалось сохранить состояние в localStorage.',
                error
            );

            setStatus(
                'Браузер не разрешил сохранить изменения. Они останутся до закрытия страницы.'
            );
        }
    }
    function createRecipeCard(recipe, index) {

        const card = document.createElement('article');

        card.classList.add('card', 'recipe-card');

        card.setAttribute('data-recipe-index', String(index));

        const title = document.createElement('h3');

        title.textContent = recipe.name;

        card.appendChild(title);

        if (recipe.description) {

            const description = document.createElement('p');

            description.textContent = recipe.description;

            card.appendChild(description);
        }
        const ingredientsTitle = document.createElement('h4');

        ingredientsTitle.textContent = 'Ингредиенты';

        card.appendChild(ingredientsTitle);

        const ingredientsList = document.createElement('ul');

        ingredientsList.classList.add('recipe-ingredients');

        recipe.ingredients.forEach(ingredient => {

            const ingredientItem = document.createElement('li');

            ingredientItem.textContent = ingredient;

            ingredientsList.appendChild(ingredientItem);

        });

        card.appendChild(ingredientsList);
        const deleteButton = document.createElement('button');

        deleteButton.type = 'button';

        deleteButton.classList.add('recipe-delete-button');

        deleteButton.textContent = 'Удалить';

        deleteButton.setAttribute(
            'aria-label',
            `Удалить рецепт «${recipe.name}»`
        );

        deleteButton.addEventListener('click', () => {

            removeRecipe(index);

        });

        card.appendChild(deleteButton);

        return card;
    }
    function renderRecipes() {

        if (!recipeContainer) {

            console.error('Элемент не найден: #recipeContainer');

            return;
        }
        recipeContainer.textContent = '';

        if (recipes.length === 0) {

            const emptyMessage = document.createElement('p');

            emptyMessage.classList.add('empty-message');

            emptyMessage.textContent =
                'Пока нет рецептов. Нажмите «Добавить рецепт», чтобы создать первый.';

            recipeContainer.appendChild(emptyMessage);

            return;
        }
        recipes.forEach((recipe, index) => {

            recipeContainer.appendChild(
                createRecipeCard(recipe, index)
            );

        });
    }
    function applyTheme() {

        if (!document.body) {

            console.error('Элемент не найден: body');

            return;
        }

        document.body.classList.remove(
            'theme-light',
            'theme-dark'
        );

        document.body.classList.add(
            `theme-${currentTheme}`
        );

        toggleThemeButton.textContent =
            currentTheme === 'dark'
                ? 'Включить светлую тему'
                : 'Включить тёмную тему';

        toggleThemeButton.setAttribute(
            'aria-pressed',
            String(currentTheme === 'dark')
        );
    }
    function applyRecipesVisibility() {

        if (!recipeListWrapper) {

            console.error('Элемент не найден: #recipeListWrapper');

            return;
        }

        recipeListWrapper.classList.toggle(
            'hidden',
            recipesHidden
        );

        toggleRecipesButton.textContent =
            recipesHidden
                ? 'Показать рецепты'
                : 'Скрыть рецепты';

        toggleRecipesButton.setAttribute(
            'aria-expanded',
            String(!recipesHidden)
        );
    }
    function updateRecipeStatus() {

        setStatus(
            `В коллекции рецептов: ${recipes.length}. Изменения автоматически сохраняются в браузере.`
        );
    }
    function persistAndRender(message) {

        renderRecipes();

        saveState();

        if (message) {

            setStatus(message);

        } else {

            updateRecipeStatus();

        }
    }
    function addRecipe() {

        const nameInput = window.prompt(
            'Введите название рецепта:'
        );

        if (nameInput === null) {
            return;
        }

        const name = nameInput.trim();

        if (!name) {

            window.alert(
                'Название рецепта не должно быть пустым.'
            );

            return;
        }
        const ingredientsInput = window.prompt(
            'Введите ингредиенты через запятую:'
        );

        if (ingredientsInput === null) {
            return;
        }
        const ingredients = ingredientsInput
            .split(',')
            .map(ingredient => ingredient.trim())
            .filter(Boolean);

        if (ingredients.length === 0) {

            window.alert(
                'Добавьте хотя бы один ингредиент через запятую.'
            );

            return;
        }
        recipes.push({

            name,

            description: '',

            ingredients

        });

        persistAndRender(
            `Рецепт «${name}» добавлен.`
        );
    }
    function removeRecipe(index) {

        if (
            !Number.isInteger(index)
            || index < 0
            || index >= recipes.length
        ) {

            console.error(
                'Не удалось удалить рецепт: карточка не найдена.'
            );

            return;
        }

        const removedRecipe = recipes.splice(index, 1)[0];

        persistAndRender(
            `Рецепт «${removedRecipe.name}» удалён.`
        );
    }
    function removeLastRecipe() {

        if (recipes.length === 0) {

            window.alert(
                'Список рецептов пуст. Удалять нечего.'
            );

            setStatus('В списке пока нет рецептов.');

            return;
        }

        const removedRecipe = recipes.pop();

        persistAndRender(
            `Последний рецепт «${removedRecipe.name}» удалён.`
        );
    }
    addRecipeButton.addEventListener(
        'click',
        addRecipe
    );
    removeLastRecipeButton.addEventListener(
        'click',
        removeLastRecipe
    );
    toggleRecipesButton.addEventListener('click', () => {

        recipesHidden = !recipesHidden;

        applyRecipesVisibility();

        saveState();

        setStatus(
            recipesHidden
                ? 'Список рецептов скрыт.'
                : 'Список рецептов показан.'
        );
    });
    toggleThemeButton.addEventListener('click', () => {

        currentTheme = currentTheme === 'light'
            ? 'dark'
            : 'light';

        applyTheme();

        saveState();

        setStatus(
            currentTheme === 'dark'
                ? 'Включена тёмная тема.'
                : 'Включена светлая тема.'
        );
    });
    renderRecipes();

    applyTheme();

    applyRecipesVisibility();

    updateRecipeStatus();

})();