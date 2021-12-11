const env = process.env;

export default {
    api: {
        host: env.REACT_APP_API_HOST || "localhost",
        port: env.REACT_APP_API_PORT || 8080
    }
}
