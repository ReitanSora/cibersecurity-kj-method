export const fetchCalification = (correct, responses) => {
    const userRequest = { correct, responses };
    return (
        fetch("https://cybersecurity-openai-service.onrender.com/calificador", {
            method: 'POST',
            body: JSON.stringify(userRequest),
            headers: { 'Content-Type': 'application/json', accept: 'application/json',}
        })
    );
};