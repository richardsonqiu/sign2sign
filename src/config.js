const env = process.env;

export default {
    API_BASE: env.REACT_APP_API_BASE || "http://localhost:8080"
}
