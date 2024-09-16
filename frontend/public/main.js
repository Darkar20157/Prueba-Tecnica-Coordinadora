document.addEventListener("DOMContentLoaded", (event) => {
    let location = localStorage.getItem('location');
    if(location == null){
        localStorage.setItem('location', 'login');
        location = localStorage.getItem('location');
    }
    function loadPage(page){
        fetch(`./views/${page}.html`)
            .then(response => response.text())
            .then(async html => {
                document.getElementById('app').innerHTML = html;
                if(page === "login"){
                    await loadLoginScript(page);
                }
            })
            .catch(error => {
                console.error("Error al cargar la pagina", error);
            })
    }
    async function loadLoginScript(page) {
        const script = document.createElement('script');
        script.src = `./process/${page}.js`;
        script.onload = () => {
            console.log('Script login.js cargado y ejecutado');
        }
        document.body.appendChild(script);
    }
    
    loadPage(location);
});