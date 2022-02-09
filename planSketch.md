<!-- each day needs ingredients, associated image, instructions -->

<!-- going with a set of nested objects, that should syntactically read well to the frontend dev when trying to pick out and render all data -->
<!-- e.g. <p>{week1.monday.instructions}</p> -->
<!-- {week4.thursday.ingredients.map(.....)} -->


plan: {
    week1: {
        monday: {
            image: '',
            ingredients: [{}, {}, {}],
            instructions: ''
        },
        tuesday: {
            image: '',
            ingredients: [],
            instructions: ''
        },
    },
    week2: {
        monday: {
            image: '',
            ingredients: [],
            instructions: ''
        },
        tuesday: {
            image: '',
            ingredients: [],
            instructions: ''
        },
    }
}