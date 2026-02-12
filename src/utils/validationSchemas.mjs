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
    password:{
        notEmpty:{
            errorMessage:"Password must not be empty."
        },
        
        }
}
