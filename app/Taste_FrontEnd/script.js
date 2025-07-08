document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    const userInput = document.getElementById('userInput');

    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    document.querySelector('.row').appendChild(canvasContainer);

    async function getCuisineRecommendation(prompt) {
        try {
            const response = await fetch('http://127.0.0.1:8000/cuisine/chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_prompt: prompt})
            });
            if (!response.ok) {
                const errorData = await response.json(); // Try to parse error response
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`); // Include error details if available
            }
            const data = await response.json();
            return {"food":data["cuisine"], "prompt":prompt};
        } catch (error) {
            console.error('Error fetching cuisine chat:', error);
            throw error;
        }
    }

    async function getCuisineInstruction(food, prompt) {
        try {
            const response = await fetch('http://127.0.0.1:8000/recipe/chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_prompt: prompt, cuisine_name: food})
            });
            if (!response.ok) {
                const errorData = await response.json(); // Try to parse error response
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`); // Include error details if available
            }
            const data = await response.json();
            return {"recipe":data["recipe"]};
        } catch (error) {
            console.error('Error fetching recipe chat:', error);
            throw error;
        }
    }

    async function getCuisineImage(food, prompt) {
        try {
            const response = await fetch('http://127.0.0.1:8000/image/generate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_prompt: prompt, cuisine_name: food})
            });
            if (!response.ok) {
                const errorData = await response.json(); // Try to parse error response
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`); // Include error details if available
            }
            const data = await response.json();
            return {"image":data["image_base64"]};
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error;
        }
    }

    submitButton.addEventListener('click', async () => {
        const prompt = userInput.value;
        if (!prompt) {
            return;
        }
        canvasContainer.innerHTML = 'Loading...';
        canvasContainer.style.display = 'block';

        const food = await getCuisineRecommendation(prompt);
        const instruction = await getCuisineInstruction(food["food"], food["prompt"]);
        const image = await getCuisineImage(food["food"], food["prompt"]);

        if (instruction["recipe"]) {
            canvasContainer.innerHTML = `
                <button class="close-button" onclick="document.querySelector('.canvas-container').style.display = 'none';">x</button>
                <img src="data:image/png;base64,${image["image"]}" alt="Recommended food">
                <div class="markdown-content">
                    ${marked.parse(instruction["recipe"])}
                </div>
            `;
        } else {
            canvasContainer.innerHTML = 'Error loading recommendation';
        }
    })

    
})