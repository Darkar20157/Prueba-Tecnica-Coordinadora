document.addEventListener("DOMContentLoaded", (event) => {
    function loadPage(page){
        fetch(`./views/${page}`)
            .then(response => response.text())
            .then(async html => {
                document.getElementById('app').innerHTML = html;
                if(page === "login.html"){
                    await loadLoginScript();
                }
            })
            .catch(error => {
                console.error("Error al cargar la pagina", error);
            })
    }
    async function loadLoginScript() {
        const script = document.createElement('script');
        script.src = './process/login.js';
        script.onload = () => {
            console.log('Script login.js cargado y ejecutado');
        }
        document.body.appendChild(script);
    }
    
    loadPage(page='login.html');
});