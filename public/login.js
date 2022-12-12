
const _URL = "http://lehighcse.us.to:8080";

const url = window.location.href;
console.log(url);
const getQuery = url.split('?')[1];
if(getQuery){
    const params = getQuery.split('&');
    console.log(params);
    let param;
    for(const p of params){
        if(p.startsWith("code=")){
            param = p.split("=")[1];
            window.localStorage.code = param;
            break;
        }
    }

    window.location.href = `${_URL}/play`;
}

