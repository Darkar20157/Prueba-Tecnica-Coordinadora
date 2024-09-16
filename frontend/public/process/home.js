var globalEvent;
document.getElementById('reload').addEventListener('click',  async () => {
    let data = await getUsersAll();
    await createContentTable(data);
})
document.getElementById("form-edit").addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log(globalEvent);
})

async function getUsersAll(){
    let dataUser;
    try{
        const response = await fetch(`http://localhost:3000/api/events/getAllEvents`, {
            method: 'GET'
        })
        .then(async response => {
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            if(data.length > 0){
                dataUser = data;
            }
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
            return
        });
        return dataUser
    }catch(err){
        console.error(err);
        return
    }
}

async function createContentTable(data){
    var table = new Tabulator("#example-table", {
        data: data,
        layout: "fitColumns",
        columns: [
            { title: "Fecha del Evento", field: "event_date" },
            { title: "Nombre", field: "name" },
            { title: "Descripcion", field: "description" },
            { title: "Direccion", field: "address" },
            { title: "Coordenadas", field: "data_location", formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                return data?`latitud: ${data.lat}, longitud: ${data.lon}`:'';
            }},
            { title: "Creado por:", field: "user_id", formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                return data?data.user_name:'';
            }},
            { title: "Información:", field: "user_id", formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                return data?`Celular: ${data.user_phone}, Correo: ${data.user_email}`:'';
            }},
            { title: "Editar", field: "user_id", formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                const id = localStorage.getItem('id');
                const htmlButton = `<button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#exampleModal2" onclick="editEvent(${data.event_id})">Editar</button>`;
                if(id == data.user_id){
                    return htmlButton;
                }else{
                    return '';
                }
            }},
            { title: "Eliminar", field: "user_id", formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                const htmlButton = `<button type="button" class="btn btn-danger w-100" onclick="deleteEvent(${data.event_id})">Eliminar</button>`;
                if(localStorage.getItem('id') == data.user_id){
                    return htmlButton;
                }else{
                    return '';
                }
            }},
        ]
    });
}

async function editEvent(id){
    let dataUser;
    try{
        const response = await fetch(`http://localhost:3000/api/events/getEvent?id=${id}`, {
            method: 'GET'
        })
        .then(async response => {
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            if(data.length > 0){
                globalEvent = data[0];
                // document.getElementById("event_date").value = data[0].event_date;
            }
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
            return
        });
        document.getElementById("name").value = globalEvent.name;
        document.getElementById("description").value = globalEvent.description;
        document.getElementById("address").value = globalEvent.address;
        document.getElementById("data_location").value = globalEvent.data_location;
        document.getElementById("active").checked = globalEvent.active || false;
        return globalEvent
    }catch(err){
        console.error(err);
        return
    }
}

function deleteEvent(id){
    try{
        Swal.fire({
            title: "Estas seguro?",
            text: "Vas a eliminar un evento!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Elimnar!"
          }).then((result) => {
            if (result.isConfirmed) {
                let res = deleteEventApi(id);
                if(res){
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El evento se ha eliminado exitosamente.",
                        icon: "success"
                    });
                    table.deleteRow(id);
                }
            }
        });
    }catch(err){
        Swal.fire({
            title: "Ups!",
            text: "Ha sucedido un error inesperado. "+err,
            icon: "error"
        });
    }
}

async function deleteEventApi(id){
    try{
        const response = await fetch(`http://localhost:3000/api/events/deleteEvent/${id}`, {
            method: 'DELETE'
        })
        .then(async response => {
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
            throw error;
        });
    }catch(err){
        console.error(err);
        throw error;
    }
}