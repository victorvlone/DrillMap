export async function loadEnv() {
    const response = await fetch("keys.env");
    const text = await response.text();

    const env = {};
    text.split("/n").forEach((line) => {
        const [key, value] = line.split("=");
        if(key && value) {
            env[key.trim()] = value.trim();
        }
    });

    return env;
    
}