const _URL = (true) ? `http://localhost` : `http://lehighcse.us.to`;

const url = window.location.href;
const getQuery = url.split('?')[1];
if(getQuery){
    const params = getQuery.split('&');
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

