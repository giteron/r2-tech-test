const supertest = require('supertest');
const server = require('../server');

const request = supertest(server);

test('/api', async () => {
  const { body } = await request.get('/api').expect(200);
  expect(body.message).toBe('ok');
});

describe('GET /api/recipes', () => {
  test('200: responds with list of all recipes', async () => {
    const { body } = await request.get('/api/recipes').expect(200);
    expect(body.data).not.toHaveLength(0);
    body.data.forEach(recipe => {
      expect(recipe).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          imageUrl: expect.any(String),
          instructions: expect.any(String),
          ingredients: expect.any(Array),
        })
      )
    });
  })

  test('200: excludes recipes where a single ingredient is specified as query', async () => {
    const { body } = await request.get('/api/recipes?exclude_ingredients=apples').expect(200);
    expect(body.data).not.toHaveLength(0);
    body.data.forEach(recipe => {
    expect(recipe.ingredients).not.toHaveLength(0);
      recipe.ingredients.forEach(food => {
        expect(food).toEqual(
          expect.not.objectContaining({
            name: 'apples'
          })
        )
      })
    })
  })

  test('200: excludes recipes where multiple ingredients are specified as query', async () => {
    const { body } = await request.get('/api/recipes?exclude_ingredients=apples,flax,coffee').expect(200);
    expect(body.data).not.toHaveLength(0);
    body.data.forEach(recipe => {
    expect(recipe.ingredients).not.toHaveLength(0);
      recipe.ingredients.forEach(food => {
        expect(food).toEqual(
          expect.not.objectContaining({
            name: 'apples',
            name: 'flax',
            name: 'coffee'
          })
        )
      })
    })
  })
})


describe('GET /api/recipes/:id', () => {
  test('200: responds with a single recipe as an object', async () => {
    const { body } = await request.get('/api/recipes/recipe-59').expect(200);
      expect(body.recipe).toEqual(
        expect.objectContaining({
          id: "recipe-59",
          imageUrl: "http://www.images.com/18",
          instructions: "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
          ingredients: [
            { "name": "demerara sugar", "grams": 25 },
            { "name": "flax", "grams": 66 },
            { "name": "apple juice", "grams": 44 },
            { "name": "oat milk", "grams": 198 }
          ]
        })
      )
    });
  })


  describe('POST /api/recipes', () => {
    test('201: adds a recipe to the data and returns that newly-added recipe', async () => {
      //please note, Express has been configured to append a random ID to each posted recipe, to mimic a database generating IDs
      const newRecipe = {
        imageUrl: "http://www.images.com/image/19",
        instructions: "set of instructions here",
        ingredients: [
          { name: "flax", grams: 25 },
          { name: "apples", grams: 21 },
          { name: "sauce", grams: 39 }
        ]
      };
      const { body } = await request.post('/api/recipes').send(newRecipe).expect(201);
      const idTester = /recipe-\d+/

      expect(body.recipe).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          imageUrl: "http://www.images.com/image/19",
          instructions: "set of instructions here",
          ingredients: [
            { name: "flax", grams: 25 },
            { name: "apples", grams: 21 },
            { name: "sauce", grams: 39 }
          ]
        })
      )
      expect(idTester.test(body.recipe.id)).toBe(true);

      const newData = await request.get('/api/recipes');
      expect(newData.body.data.filter(recipe => recipe.instructions === 'set of instructions here')).toHaveLength(1);
    })
  })


  xdescribe('POST /api/plan', () => {
    test('201: returns a multi-day, multi-week meal plan dependent on user-specified recipe choices', async () => {
      const userInput = {
        days: [
          ["recipe-1", "recipe-2", "recipe-3", "recipe-4", "recipe-5", "recipe-6"],
          ["recipe-8"],
          ["recipe-1", "recipe-9", "recipe-93", "recipe-68"],
          [],
          ["recipe-11", "recipe-2", "recipe-23", "recipe-41", "recipe-5", "recipe-62"]
        ]
      };
      const { body } = await request.post('/api/plan').send(userInput).expect(201);
      
      expect(body.plan).toEqual(
        expect.objectContaining({
          week1: {
            monday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            tuesday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            wednesday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            thursday: [],
            friday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            }
          },
          week2: {
            monday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            tuesday:[],
            wednesday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            thursday: [],
            friday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            }
          },
          week3: {
            monday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            tuesday:[],
            wednesday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            thursday: [],
            friday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            }
          },
          week4: {
            monday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            tuesday:[],
            wednesday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            thursday: [],
            friday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            }
          },
          week5: {
            monday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            tuesday:[],
            wednesday: [],
            thursday: [],
            friday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            }
          },
          week6: {
            monday: {
              image: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            },
            tuesday:[],
            wednesday: [],
            thursday: [],
            friday: {
              imageUrl: expect.any(String),
              ingredients: expect.any(Array),
              instructions: expect.any(String)
            }
          }
        })
      )
    })
  })

