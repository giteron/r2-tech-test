const apiRouter = require('express').Router();
const data = require('../data/data.json');


apiRouter.get('/', (_, res) => {
  res.json({ message: 'ok' });
});

apiRouter.get('/recipes', (req, res) => {
  if (req.query.hasOwnProperty('exclude_ingredients')) {
    const ingredientsToExclude = req.query.exclude_ingredients.split(',');
    const filteredData = data.filter(recipe => recipe.ingredients.every(food => !ingredientsToExclude.includes(food.name)));
    res.json({ data: filteredData })
  } else {
    res.json({ data });
  }
})

apiRouter.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const recipe = data.filter(recipe => recipe.id === id)[0];
  res.json({ recipe });
})

apiRouter.post('/recipes', (req, res) => {
  const newId = `recipe-${Math.floor(Math.random() * 1000) + 100}`;
  const recipe = req.body;
  recipe.id = newId;
  data.push(recipe);
  // ensuring the response is coming from the data, not just the recipe object within this function, to mimic the 'returning' function of a DB:
  res.status(201).send({ recipe: data.filter(recipe => recipe.id === newId)[0] })
})


apiRouter.post('/plan', (req, res) => {

  const { days } = req.body;

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const plan = {
    week1: {},
    week2: {},
    week3: {},
    week4: {},
    week5: {},
    week6: {}
  };

  days.forEach((day, dayIndex) => {
    day.forEach((recipeId, weekIndex) => {
      const fullRecipe = data.filter(recipe => recipe.id === recipeId)[0];
      plan[`week${weekIndex + 1}`][dayNames[dayIndex]] = fullRecipe;
    })
  })

  console.log(plan)
  res.status(201).json({ plan }) 
})

module.exports = apiRouter;
