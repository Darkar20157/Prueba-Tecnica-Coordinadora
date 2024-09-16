var form = document.getElementById("form-login");
if(form){
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const documentNro = formData.get("document_nro");
        const email = formData.get("email");
        if(documentNro && email){
            getUser(documentNro, email);
        }
    })
}else{
    console.log("Formulario no encontrado");
}

async function getUser(documentNro, email){
    let dataUser;
    try{
        const response = await fetch(`http://localhost:3000/api/users/getUser?document_nro=${documentNro}&email=${email}`, {
            method: 'GET'
        })
        .then(async response => {
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            dataUser = data[0];
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
        });
        if(dataUser.document_nro.trim() === documentNro.trim() && dataUser.email.trim() === email.trim()){
            Swal.fire({
                title: "Sesion exitosa!",
                text: "Se ha abierto la sesion",
                icon: "success"
            }).then((result) => {
                if(result.isConfirmed){
                    pageDirections('home.html')
                }
            });
        }
    }catch(err){
        console.error(err)
    }
}

function pageDirections(page){
    fetch(`./views/${page}`)
    .then(response => response.text())
    .then(async html => {
        document.getElementById('app').innerHTML = html;
    })
    .catch(error => {
        console.error("Error al cargar la pagina", error);
})
}