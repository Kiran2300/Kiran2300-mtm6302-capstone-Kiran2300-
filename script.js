document.addEventListener('DOMContentLoaded', () => {
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    const pokemonDetails = document.getElementById('pokemon-details');
    const closeDetailsButton = document.getElementById('close-details');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonAbilities = document.getElementById('pokemon-abilities');
    const pokemonTypes = document.getElementById('pokemon-types');
    const catchReleaseButton = document.getElementById('catch-release');
    let offset = 0;
    const limit = 20;
    const maxPokemons = 100;  // Maximum number of Pokémon to load

    const fetchPokemon = async (offset, limit) => {
        if (offset >= maxPokemons) {
            loadMoreButton.style.display = 'none';  // Hide the "Load More" button if limit is reached
            return;
        }
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            displayPokemon(data.results);
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
    };

    const displayPokemon = (pokemonList) => {
        pokemonList.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon-card';
            const pokemonId = parseUrl(pokemon.url);
            pokemonCard.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
                <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            `;
            pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon, pokemonId));
            pokemonGallery.appendChild(pokemonCard);
        });
    };

    const showPokemonDetails = async (pokemon, id) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            pokemonAbilities.textContent = `Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;
            pokemonTypes.textContent = `Types: ${data.types.map(type => type.type.name).join(', ')}`;
            catchReleaseButton.textContent = isCaught(id) ? 'Release' : 'Catch';
            catchReleaseButton.onclick = () => toggleCatch(id);
            pokemonDetails.style.display = 'flex';
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    };

    const toggleCatch = (id) => {
        const caughtList = getCaughtList();
        if (caughtList.includes(id)) {
            caughtList.splice(caughtList.indexOf(id), 1);
        } else {
            caughtList.push(id);
        }
        localStorage.setItem('caughtList', JSON.stringify(caughtList));
        pokemonDetails.style.display = 'none';
        updatePokemonCards();
    };

    const getCaughtList = () => {
        return JSON.parse(localStorage.getItem('caughtList')) || [];
    };

    const isCaught = (id) => {
        return getCaughtList().includes(id);
    };

    const updatePokemonCards = () => {
        const pokemonCards = document.querySelectorAll('.pokemon-card');
        pokemonCards.forEach(card => {
            const id = parseUrl(card.querySelector('img').src);
            if (isCaught(id)) {
                card.classList.add('caught');
            } else {
                card.classList.remove('caught');
            }
        });
    };

    const parseUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 2];
    };

    closeDetailsButton.addEventListener('click', () => {
        pokemonDetails.style.display = 'none';
    });

    loadMoreButton.addEventListener('click', () => {
        offset += limit;
        fetchPokemon(offset, limit);
    });

    fetchPokemon(offset, limit);
});
