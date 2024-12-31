function validationLog(values){
alert("")
let error={}
const email_regex = /^[A-Za-z0-9]+\@[A-Z]?[a-z]+[0-9]{0,}\.[A-Za-z]{2,4}$/
const password_regex = /^[a-zA-Z]\w{3,14}$/

if(values.email ===""){
  error.email = "Email mora biti popunjen"
}
else if(!email_regex.test(values.email)){
  error.email = "Molimo unesite ispravan email."
}
else
{
  error.email = ""
}

if(values.password ===""){
  error.password = "Password mora biti popunjen"
}
else if(!password_regex.test(values.password)){
  error.password = "Password mora pocinjati slovom, nesme imati blanco i mora biti izmedju 4 i 15 karaktera."
}
else
{
  error.password = ""
}
return error;
}
export default validationLog;