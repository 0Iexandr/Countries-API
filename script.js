const countriesContainer = document.querySelector('#countriesContainer');
const countriesFactsContainer = document.querySelector('#countriesFacts');
const regionSelector = document.querySelector('#regionSelector');

const subregionSelector = document.querySelector('#subRegionSelector');
subregionSelector.disabled = true;

const subregionDisabledOption = document.createElement('option');
subregionDisabledOption.innerText = 'Pick a sub-region';
subregionDisabledOption.selected = true;
subregionDisabledOption.hidden = true;
subregionSelector.appendChild(subregionDisabledOption);

let regions = [];
let subregions = [];

regionSelector.addEventListener('change', selectRegion);
subregionSelector.addEventListener('change', selectSubregion);

function selectRegion(event) {
    subregionSelector.disabled = false;
    regions = [];
    
    fetch(`https://restcountries.com/v3.1/region/${event.target.value}`)
        .then(response => response.json())
        .then(data => {
            subregionSelector.replaceChildren([]);
            subregionSelector.appendChild(subregionDisabledOption);

            data.forEach(region => {
                regions.push(region);
            });

            subregions = [...new Set(regions.map(region => region.subregion))];

            subregions.forEach(subregion => {
                const subregionOption = document.createElement('option');
                subregionOption.innerText = subregion;
                subregionSelector.appendChild(subregionOption);
            });
        });
};

function selectSubregion(event) {
    countriesContainer.replaceChildren([]);
    countriesContainer.style.visibility = '';
    countriesFactsContainer.style.display = 'none';
    
    const countries = regions.filter(region => region.subregion === event.target.value);
    
    countries.forEach(country => {
        const countryName = document.createElement('h');
        countryName.className = 'country-name';
        countryName.innerText = country.name.official;

        const countryFlag = document.createElement('img');
        countryFlag.src = country.flags.png;

        countriesContainer.appendChild(countryName);
        countriesContainer.appendChild(countryFlag);

        countryName.addEventListener('click', () => {
            countriesFactsContainer.replaceChildren([]);
            countriesFactsContainer.style.display = 'block';

            const countryFacts = document.createElement('h');
            countryFacts.innerText = 'Facts:';
            countryFacts.className = 'facts-title';
            countriesFactsContainer.appendChild(countryFacts);

            const countryCapital = document.createElement('h3');
            countryCapital.innerText = `capital: ${country.capital}`;
            countriesFactsContainer.appendChild(countryCapital);

            const countryPopulation = document.createElement('h3');
            countryPopulation.innerText = `population: ${country.population}`;
            countriesFactsContainer.appendChild(countryPopulation);
            
            const countryArea = document.createElement('h3');
            countryArea.innerText = `area: ${country.area}`;
            countriesFactsContainer.appendChild(countryArea);

            const countryCurrencies = document.createElement('ul');
            countryCurrencies.innerText = 'currencies:';
            for(currency in country.currencies) {
                const countryCurrency = document.createElement('li');
                countryCurrency.innerText = `${currency} : ${country.currencies[currency].name} : ${country.currencies[currency].symbol}`;
                countryCurrencies.appendChild(countryCurrency);
            };
            countriesFactsContainer.appendChild(countryCurrencies);

            const countryLanguages = document.createElement('ul');
            countryLanguages.innerText = 'languages:';
            for(language in country.languages) {
                const countryLanguage = document.createElement('li');
                countryLanguage.innerText = `${language} : ${country.languages[language]}`;
                countryLanguages.appendChild(countryLanguage);
            };
            countriesFactsContainer.appendChild(countryLanguages);

            const countryViewOnMap = document.createElement('a');
            countryViewOnMap.innerText = 'view on map';
            countryViewOnMap.href = country.maps.openStreetMaps;
            countryViewOnMap.target = "_blank";
            countriesFactsContainer.appendChild(countryViewOnMap);
        });
    });
};