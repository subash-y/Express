import bcrypt from "bcrypt";

const saltRounds = 10; //Scramble the password for 10 times,default value is 10 suggested by documentation.

export const hashPassword = (password) =>{
    const salt = bcrypt.genSaltSync(saltRounds);//Generate salt based on the saltround
    console.log(salt);
    return bcrypt.hashSync(password,salt);
}

export const comparePassword = (plain,hashed)=>{
    bcrypt.compareSync(plain,hashed);
}