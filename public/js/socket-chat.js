var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios')
}

var usuario = { nombre: params.get('nombre'), sala: params.get('sala') };
socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) { //enviamos el nombre del ususariole cual estamos enviando
        console.log('Usuarios conectados', resp); // ver listado de usuarios conectados
    })
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

//escuchar entreda y salida de ususario
socket.on('listaPersona', function(personas) {
    console.log(personas);
});

//mensaje Privados // accion de escuchar por parte del cliente
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado', mensaje);
});