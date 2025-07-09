document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const submitBtn = document.getElementById('submitBtn');
    const recipeModal = document.getElementById('recipeModal');
    const closeBtn = document.getElementById('closeBtn');
    const recipeContent = document.getElementById('recipeContent');

    // Event listeners
    submitBtn.addEventListener('click', handleSubmit);
    closeBtn.addEventListener('click', closeModal);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === recipeModal) {
            closeModal();
        }
    });

    async function handleSubmit() {
        const userPrompt = searchInput.value.trim();
        
        if (!userPrompt) {
            alert('Please tell me how you\'re feeling today!');
            return;
        }

        // Disable button and show loading state
        setLoadingState(true);

        try {
            // Step 1: Get cuisine recommendation
            const cuisineResponse = await getCuisineRecommendation(userPrompt);
            
            if (!cuisineResponse.cuisine) {
                throw new Error('No cuisine recommendation received');
            }

            // Step 2: Get recipe for the recommended cuisine
            const recipeResponse = await getRecipe(userPrompt, cuisineResponse.cuisine);
            
            if (!recipeResponse.recipe) {
                throw new Error('No recipe received');
            }

            // Step 3: Display the result
            displayRecipe(cuisineResponse.cuisine, recipeResponse.recipe);

        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, something went wrong! Please try again.');
        } finally {
            setLoadingState(false);
        }
    }

    async function getCuisineRecommendation(userPrompt) {
        const response = await fetch(window.BACKEND_CUISINE_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_prompt: userPrompt
            })
        });

        if (!response.ok) {
            throw new Error(`Cuisine API error: ${response.status}`);
        }

        return await response.json();
    }

    async function getRecipe(userPrompt, cuisineName) {
        const response = await fetch(window.BACKEND_RECIPE_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_prompt: userPrompt,
                cuisine_name: cuisineName
            })
        });

        if (!response.ok) {
            throw new Error(`Recipe API error: ${response.status}`);
        }

        return await response.json();
    }

    function displayRecipe(cuisineName, recipe) {
        // Extract sections from recipe string
        const nameHeader = `<h2>${cuisineName}</h2>`;
        const descMatch = recipe.match(/<cuisine_description>\s*([\s\S]*?)\s*<\/cuisine_description>/);
        const diffMatch = recipe.match(/<difficulty_rating>\s*([\s\S]*?)\s*<\/difficulty_rating>/);
        const ingMatch = recipe.match(/<ingredients>\s*([\s\S]*?)\s*<\/ingredients>/);
        const guideMatch = recipe.match(/<cooking_guide>\s*([\s\S]*?)\s*<\/cooking_guide>/);

        const desc = descMatch ? descMatch[1].trim() : '';
        const diff = diffMatch ? diffMatch[1].trim() : '';
        const ing = ingMatch ? ingMatch[1].trim() : '';
        const guide = guideMatch ? guideMatch[1].trim() : '';

        // Build HTML with subtitles for each section
        let html = nameHeader;

        if (desc) {
            html += `
                <section class="section description-section">
                    <h3>Description</h3>
                    <p>${marked.parseInline(desc)}</p>
                </section>`;
        }
        if (diff) {
            html += `
                <section class="section difficulty-section">
                    <h3>Difficulty</h3>
                    <p>${marked.parseInline(diff)}</p>
                </section>`;
        }
        if (ing) {
            html += `
                <section class="section ingredients-section">
                    <h3>Ingredients</h3>
                    <ul class="no-bullets">`;
            ing.split(/\r?\n/).forEach(item => {
                if (item.trim()) {
                    html += `<li>${item.trim()}</li>`;
                }
            });
            html += `</ul>
                </section>`;
        }
        if (guide) {
            html += `
                <section class="section guide-section">
                    <h3>Cooking Guide</h3>
                    <ol>`;
            guide.split(/\r?\n/).forEach(step => {
                if (step.trim()) {
                    html += `<li>${step.trim()}</li>`;
                }
            });
            html += `</ol>
                </section>`;
        }

        recipeContent.innerHTML = html;
        recipeModal.style.display = 'block';
        // Focus on modal for accessibility
        recipeModal.focus();
    }

    function closeModal() {
        recipeModal.style.display = 'none';
        // Return focus to search input
        searchInput.focus();
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Finding...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Find My Food!';
        }
    }

    // Add some interactive features
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
    });

    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
        this.parentElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
    });

    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (recipeModal.style.display === 'block' && e.key === 'Escape') {
            closeModal();
        }
    });

    // Add some fun animations to the chef
    const chefFace = document.querySelector('.chef-face');
    const chefHat = document.querySelector('.chef-hat');
    
    if (chefFace && chefHat) {
        // Make chef "blink" occasionally
        setInterval(() => {
            const eyes = document.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.height = '2px';
                setTimeout(() => {
                    eye.style.height = '8px';
                }, 150);
            });
        }, 1000 + Math.random() * 2000);

        // Make chef hat wiggle when hovering over search
        searchInput.addEventListener('mouseenter', () => {
            chefHat.style.animation = 'wiggle 0.5s ease-in-out';
        });

        searchInput.addEventListener('mouseleave', () => {
            chefHat.style.animation = '';
        });
    }
});

// Add wiggle animation to CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes wiggle {
        0%, 100% { transform: translateX(-50%) rotate(0deg); }
        25% { transform: translateX(-50%) rotate(-5deg); }
        75% { transform: translateX(-50%) rotate(5deg); }
    }
`;
document.head.appendChild(style);