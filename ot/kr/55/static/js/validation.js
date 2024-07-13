function NameValidation(name, validationType) {
    let reg
    if (validationType === "korean"){
        //한글만 판단
        reg = /^[가-힣]{2,15}$/;
    }else if (validationType === "english"){
        //영어만 판단
        reg = /^[a-zA-Z]{2,20}$/;
    }else {
        // validationType === mix
        reg = /^[가-힣]{2,15}|[a-zA-Z]{2,20}$/;
    }
    return reg.test(name)
}

function PhoneValidation(phone, validationType) {
    let reg
    if (validationType === "phone"){
        //휴대폰 번호만 판단
        reg =/^010([0-9]{4})([0-9]{4})$/g;
    }else{
        //validationType === all
        //모든 전화번호 판단
        reg =/^(^02|^01[0-9]{1}|^0[3-7]{1}[0-7]{1})([0-9]{3,4})([0-9]{4})$/g;
    }

    return reg.test(phone)
}

function NumberOnly(phone){
    const reg =/^[0-9]+$/g;
    return reg.test(phone)
}

function NumberValidation(validationText){
    // 안에 숫자가 있는지에 대한 여부 판단
    const reg =/[0-9]/;
    return reg.test(validationText)
}

function EmailValidation(email) {
    const reg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return reg.test(email)
}

function PasswordValidation(password, validationTypeLength = 1) {
    const lowerCaseReg = /[a-z]/
    const upperCaseReg = /[A-Z]/
    const numberCaseReg = /[0-9]/
    const specialCharReg = /[\{\}\[\]\/?`.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+/

    const validationArray = [
        lowerCaseReg.test(password),
        upperCaseReg.test(password),
        numberCaseReg.test(password),
        specialCharReg.test(password)
    ]

    const checkTrueLength = validationArray.filter(Boolean).length
    if (checkTrueLength >= validationTypeLength){
        return true
    } else{
      return false
    }
}

function LengthCheck(comparisonValue, length) {
    return Boolean(comparisonValue.length >= length)
}

function KoreanValidation(password){
    const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return reg.test(password)
}
