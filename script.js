const contentContainer = document.querySelector('.content-container');
const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
let subregions = [];
let countries = [];

const regionSelector = populateRegionSelector();
const subregionSelector = populateSubRegionSelector();

function setup() {
    subregionSelector.disabled = true;
}

function populateRegionSelector() {
    const regionSelector = document.querySelector('#region-selector');
    
    const regionDisabledOption = document.createElement('option');
    regionDisabledOption.innerText = 'Pick a region';
    regionDisabledOption.selected = true;
    regionDisabledOption.hidden = true;
    
    regionSelector.appendChild(regionDisabledOption);
    regionSelector.addEventListener('change', selectRegion);

    regions.forEach(region => {
        const regionOption = document.createElement('option');
        regionOption.innerText = region;
        regionOption.value = region;
        regionSelector.appendChild(regionOption);
    });
    
    return regionSelector;
}

function populateSubRegionSelector() {
    const subregionSelector = document.querySelector('#subregion-selector');
    const subregionDisabledOption = document.createElement('option');

    subregionDisabledOption.innerText = 'Pick a sub-region';
    subregionDisabledOption.selected = true;
    subregionDisabledOption.hidden = true;
    
    subregionSelector.appendChild(subregionDisabledOption);
    subregionSelector.addEventListener('change', selectSubregion);
    
    return subregionSelector;
}

function selectRegion(event) {
    subregionSelector.disabled = false;
    contentContainer.replaceChildren([]);
    
    fetch(`https://restcountries.com/v3.1/region/${event.target.value}`)
        .then(response => response.json())
        .then(data => {
            subregionSelector.replaceChildren([]);
            subregionSelector.replaceWith(populateSubRegionSelector());


            countries = [...data];

            subregions = [...new Set(countries.map(country => country.subregion))];

            subregions.forEach(subregion => {
                const subregionOption = document.createElement('option');
                subregionOption.innerText = subregion;
                subregionOption.value = subregion;
                subregionSelector.appendChild(subregionOption);
            });
        });
};

function selectSubregion(event) {
    contentContainer.replaceChildren([]);
    
    const countriesContainer = document.createElement("div");
    countriesContainer.id = "countries-container";
    contentContainer.appendChild(countriesContainer);
    
    const countriesFactsContainer = document.createElement("div");
    countriesFactsContainer.id = 'countries-facts';
    countriesFactsContainer.style.display = 'none';
    contentContainer.appendChild(countriesFactsContainer);
            
    countries
        .filter(country => country.subregion === event.target.value)
        .forEach(country => {
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

window.onload = setup;