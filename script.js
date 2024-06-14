document.addEventListener('DOMContentLoaded', () => {
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    const pokemonDetails = document.getElementById('pokemon-details');
    let offset = 0;
    const limit = 20;

    const fetchPokemon = async (offset, limit) => {
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
            pokemonCard.textContent = pokemon.name;
            pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon));
            pokemonGallery.appendChild(pokemonCard);
            checkIfCaught(pokemonCard, pokemon.url);
        });
    };

    const showPokemonDetails = async (pokemon) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            pokemonDetails.innerHTML = `
                <h2>${data.name}</h2>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png" alt="${data.name}">
                <p>Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p>Types: ${data.types.map(type => type.type.name).join(', ')}</p>
                <button id="catch-release">${isCaught(data.id) ? 'Release' : 'Catch'}</button>
            `;
            document.getElementById('catch-release').addEventListener('click', () => toggleCatch(data.id));
            pokemonDetails.style.display = 'block';
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
            const id = parseUrl(card.dataset.url);
            if (isCaught(id)) {
                card.classList.add('caught');
            } else {
                card.classList.remove('caught');
            }
        });
    };

    const parseUrl = (url) => {
        return url.split('/').filter(Boolean).pop();
    };

    const checkIfCaught = (card, url) => {
        const id = parseUrl(url);
        card.dataset.url = url;
        if (isCaught(id)) {
            card.classList.add('caught');
        }
    };

    loadMoreButton.addEventListener('click', () => {
        offset += limit;
        fetchPokemon(offset, limit);
    });

    fetchPokemon(offset, limit);
});
