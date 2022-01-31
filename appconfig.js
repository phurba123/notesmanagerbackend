let appConfig={
    port:3000,
    env:'dev',
    allowedCorsOrigin:'*',
    db:{
        uri:'mongodb+srv://phursang:phursang%40123@cluster0.v7a1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    },
    apiVersion:'/api/v1'
}

module.exports = appConfig;