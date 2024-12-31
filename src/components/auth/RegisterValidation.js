function validationReg(values){
  alert("")
  let error={}
  const email_regex = /^[A-Za-z0-9]+\@[A-Z]?[a-z]+[0-9]{0,}\.[A-Za-z]{2,4}$/
  const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
  
  if(values.name ==""){
    error.name = "Ime mora biti popunjeno"
  }
  else
  {
    error.name = ""
  }
  if(values.email ==""){
    error.email = "Email mora biti popunjen"
  }
  else if(!email_regex.test(values.email)){
    error.email = "Molimo unesite ispravan email."
  }
  else
  {
    error.email = ""
  }
  
  if(values.password ==""){
    error.password = "Password mora biti popunjen"
  }
  else if(!password_regex.test(values.password)){
    error.password = "Password mora pocinjati slovom, nesme imati blanco i mora imati minimum 8 karaktera."
  }
  else
  {
    error.password = ""
  }
  // if(values.repassword ==""){
  //   error.repassword = "Ponovi password mora biti popunjen"
  // }
  // else if(!password_regex.test(values.repassword)){
  //   error.repassword = "Ponovi password mora pocinjati slovom, nesme imati blanco i mora biti izmedju 4 i 15 karaktera."
  // }
  // else if(values.repassword != values.password){
  //   error.repassword = "Password i ponovi password polja moraju biti ista."
  // }
  // else
  // {
  //   error.repassword = ""
  // }
  return error;
  }
  export default validationReg;