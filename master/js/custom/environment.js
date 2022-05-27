var envType = 'demo';

window.appSettings = {
    debug: true,
    version : '1.1',
    //apiHost : 'http://localhost:38682',                               //DEV
    //apiHost : '',                                                     //PROD
    apiHost: getApiHost(),
    clientId: 'webApp',
    serviceBase: "/",
    mockBackend: false,
    angular9: 'http://localhost:4200/dashboard/v2',
    
    recaptchaSiteKey: getRecaptcha(),
    
    flags:{
        productCodes: true
    }
};


function getApiHost(){
    if(envType === 'dev'){
        return 'http://localhost:38682';
    } 
    if(envType === 'demo'){
        return 'https://demo.smartgar.com/';
    }
    return '';
}


function getRecaptcha(){
    if(envType === 'dev'){
        return '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    }

    return '6LfEgxgUAAAAANpiewet2_ul5Cz41QiU9ogyAulz';
}
