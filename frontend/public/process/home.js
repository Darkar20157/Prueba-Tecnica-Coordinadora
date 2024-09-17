var globalEvent;
document.getElementById('reload').addEventListener('click',  async () => {
    let data = await getUsersAll();
    await createContentTable(data);
})
const formEvent = document.getElementById("form-edit");
formEvent.addEventListener('submit', async(e) => {
    e.preventDefault();
    const form = new FormData(formEvent);
    await saveEvent(form);
})
const formEventSave = document.getElementById("form-save");
formEventSave.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formNew = new FormData(formEventSave);
    await saveNewEvent(formNew);
});

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

async function saveNewEvent(formNew) {
    let dataForm = {};
    console.log(formNew);
    if(formNew.get("event_date_new")){
        dataForm.event_date = formNew.get("event_date_new");
    }
    if(formNew.get("name_new")){
        dataForm.name = formNew.get("name_new");
    }
    if(formNew.get("description_new")){
        dataForm.description = formNew.get("description_new");
    }
    if(formNew.get("address_new")){
        dataForm.address = formNew.get("address_new");
    }
    if(formNew.get("data_location_lat_new") && formNew.get("data_location_lon_new")){
        dataForm.data_location_lat = {"lat": formNew.get("data_location_lat_new"), "lon": formNew.get("data_location_lon_new")};
    }
    if(localStorage.getItem('id')){
        dataForm.user_id = localStorage.getItem('id');
    }
    try{
        let data = JSON.stringify(dataForm)
        const response = await fetch(`http://localhost:3000/api/events/saveEvent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        })
        .then(async response => {
            console.log(response);
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            console.log(data);
            Swal.fire({
                title: "Registro exitoso!",
                text: `Se han actualizado los datos del evento`,
                icon: "success"
            })
            return
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
        });
    }catch(err){
        console.error(err)
    }
}

async function saveEvent(form) {
    if(form.get("event_date") || form.get("event_date") == globalEvent.event_date){
        globalEvent.event_date = form.get("event_date");
    }
    if(form.get("name") || form.get("name") != globalEvent.name){
        globalEvent.name = form.get("name");
    }
    if(form.get("description") || form.get("description") != globalEvent.description){
        globalEvent.description = form.get("description");
    }
    if(form.get("address") || form.get("address") == globalEvent.address){
        globalEvent.address = form.get("address");
    }
    if(form.get("data_location_lat") || form.get("data_location_lat") == globalEvent.data_location && form.get("data_location_lon") || form.get("data_location_lon")){
        globalEvent.data_location = {"lat": form.get("data_location_lat"), "lon": form.get("data_location_lon")};
    }
    if(form.get("active") || form.get("active") != globalEvent.active){
        if(form.get("active") == "on"){
            globalEvent.active = true;    
        }
    }else{
        globalEvent.active = false;
    }
    try{
        let data = JSON.stringify(globalEvent)
        const response = await fetch(`http://localhost:3000/api/events/saveEvent`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        })
        .then(async response => {
            console.log(response);
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            console.log(data);
            Swal.fire({
                title: "Registro exitoso!",
                text: `Se han actualizado los datos del evento`,
                icon: "success"
            })
            return
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
        });
    }catch(err){
        console.error(err)
    }
}

async function createContentTable(data){
    var table = new Tabulator("#example-table", {
        data: data,
        layout: "fitColumns",
        columns: [
            { title: "Fecha del Evento", field: "event_date" },
            { title: "Nombre", field: "nombre" },
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
            { title: "Asistir", field: 'id', formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                const htmlButton = `<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="check" onchange="assist(this, ${data})"><label class="form-check-label" for="flexSwitchCheckChecked">Asistir</label></div>`;
                return htmlButton;
            }},
            { title: "Lista Asistencia", field: 'id', formatter: function(cell, formatterParams, onRendered){
                const data = cell.getValue();
                const htmlButton = `<button type="button" class="btn btn-primary w-100" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" onclick="assistUser(${data})">Lista de Asistencia</button>`;
                return htmlButton;
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

async function assist(e, idEvent){
    let check = e.checked;
    let dataInfo = {"idEvent": idEvent, "idUser": localStorage.getItem("id"), "check": check}
    try{
        let data = JSON.stringify(dataInfo)
        const response = await fetch(`http://localhost:3000/api/events/assist`, {
            method: 'PUT',
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
                title: "Confirmaste Asitencia!",
                text: `Preparate para ir al evento`,
                icon: "success"
            })
            return
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
        });
    }catch(err){
        console.error(err)
    }
    
}

async function assistUser(idEvent) {
    console.log(document.getElementById("assist-table"));
    try{
        const response = await fetch(`http://localhost:3000/api/events/getUsersAssistEvent?id=${idEvent}`, {
            method: 'GET'
        })
        .then(async response => {
            if(!response.ok){
                throw new Error("La conexion no fue ok");
            }
            return await response.json();
        })
        .then(data => {
            var table = new Tabulator("#assist-table", {
                data: data,
                layout: "fitColumns",
                columns: [
                    { title: "Documento", field: "document_nro" },
                    { title: "Nombre", field: "name" },
                    { title: "Ceular", field: "phone" },
                    { title: "email", field: "email" },
                ]
            })
        })
        .catch(error => {
            console.error("Error al hacer la solicitud", error);
            return
        });
    }catch(err){
        console.error(err);
    }
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
        const eventDateTime = new Date(globalEvent.event_date);
        const formatDateTime = eventDateTime.toISOString().slice(0,16);
        document.getElementById("event_date").value = formatDateTime || '';
        document.getElementById("name").value = globalEvent.name || '';
        document.getElementById("description").value = globalEvent.description || '';
        document.getElementById("address").value = globalEvent.address || '';
        document.getElementById("data_location_lat").value = globalEvent.data_location.lat || '';
        document.getElementById("data_location_lon").value = globalEvent.data_location.lon || '';
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