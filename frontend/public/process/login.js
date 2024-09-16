var form = document.getElementById("form-login");
var formRegister = document.getElementById('form-register');
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

if(formRegister){
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(formRegister);
        const document_nro = formData.get("document_nro");
        const name = formData.get("name");
        const phone = formData.get("phone");
        const email = formData.get("email");
        if(document_nro && name && phone && email){
            let data = {document_nro, name, phone, email}
            saveUser(JSON.stringify(data));
        }
    })
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
            localStorage.setItem('id', dataUser.id);
            Swal.fire({
                title: "Sesion exitosa!",
                text: "Se ha abierto la sesion",
                icon: "success"
            }).then((result) => {
                if(result.isConfirmed){
                    pageDirections('home');
                }
            });
        }
    }catch(err){
        console.error(err)
    }
}

function pageDirections(page){
    fetch(`./views/${page}.html`)
        .then(response => response.text())
        .then(async html => {
            document.getElementById('app').innerHTML = html;
            if(page === "home"){
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

async function saveUser(data){
    try{
        const response = await fetch(`http://localhost:3000/api/users/saveUsers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        })
        .then(async response => {
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            Swal.fire({
                title: "Registro exitoso!",
                text: `Te haz registrado correctamente sr(@)${data.name}, inicia sesion con los datos que ingresaste`,
                icon: "success"
            }).then((result) => {
                if(result.isConfirmed){
                    window.location.reload();
                }
            });
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
        });
    }catch(err){
        console.error(err)
    }
}