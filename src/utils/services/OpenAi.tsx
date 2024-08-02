export const fetchOpenAiResponse = (problem: string) => {
    const userRequest = { problem };
    return (
        fetch("https://cybersecurity-openai-service.onrender.com/generador", {
            method: 'POST',
            body: JSON.stringify(userRequest),
            headers: { 'Content-Type': 'application/json' }
        })
    );
};