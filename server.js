const Hapi = require('@hapi/hapi')
//const corsHeaders = require('hapi-cors-headers');
const routes = require('./routes')
const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: (process.env.NODE_ENV !== 'production'? 'localhost': "0.0.0.0"),
        routes: {
            cors: {
                origin: ['http://notesapp-v1.dicodingacademy.com']
            }
        }
    })

    server.route(routes)

    await server.start()
}

init()