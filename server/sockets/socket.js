const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utilidades/utilidades.js')
const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        // console.log(usuario);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'EL nombre o sala es necesario'
            });
        }

        // con el join se define la sala a la que pertenece el usuario dle chat
        client.join(data.sala); // s eune al alcinete en la sala en particular
        // let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala); // los lcinete de cada sockety poseen un id
        usuarios.agregarPersona(client.id, data.nombre, data.sala); // los lcinete de cada sockety poseen un id
        //client.broadcast.emit('listaPersona', usuarios.getPersonas());// emite el ingreso de cualquier usuario a todos los usuarios sin importar la sala
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala)); //solo emiete los ususarios al los d ela msima sala
        // callback(personas);
        callback(usuarios.getPersonasPorSala(data.sala));
    });


    //enviamos un mensaje contruido a todos los usuarios
    client.on('crearMensaje', (data) => { //socket.emit('crearMensaje',{mensaje:'Hola ssssmundo'})
        let persona = usuarios.getPersona(client.id) //cada cliente tien su propio id
        let mensaje = crearMensaje(persona.nombre, data.mensaje); // de la persona obtenemos el nombre automaticamnete, ademas d ela data obtenemos el mensaje
        // client.broadcast.emit('crearMensaje', mensaje)//aka tambien se debe cambiar a las personas que dse emite el mensae basicamente colocar la sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje) // pero la sala la obtengo desde la persona
    })

    // alerta de retiro de usuario
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id); // entregamos id usuario que se desconecta para borrar
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //mensaje Privado
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id) //cada cliente tien su propio id
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});