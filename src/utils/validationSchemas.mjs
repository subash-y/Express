export const creatUserValidationSchema = {

    user_name:{
        notEmpty:{
            errorMessage:"Username must not be empty"
        },
        isLength:{
            options: {min:3, max:15},
            errorMessage:"Username length requirements must be 3 and not exceed 15."
        },
        isString:{
            errorMessage:"Username must be string."
        }
    },    
    age:{
        notEmpty:{
            errorMessage:"Age must not be empty"
        },
        isInt:{
            options:{min:1,max:100},
            errorMessage:"Age must be a number between 1 to 100."
        }
    }
}