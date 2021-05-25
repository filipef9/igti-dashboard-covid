const apiUrl = 'https://api.covid19api.com';

let countries = [];

const countryFormControl = document.getElementById('selectedCountry');
const date = document.getElementById('date');

const totalConfirmadosFormControl = document.getElementById('totalConfirmados');
const totalMortesFormControl = document.getElementById('totalMortes');
const totalRecuperadosFormControl = document.getElementById('totalRecuperados');
const atualizacao = document.getElementById('atualizacao');

window.addEventListener('load', () => {
    axios.get(`${apiUrl}/countries`)
        .then((res) => {
            countries = Object.assign([], res.data);

            countries.sort((c1, c2) => {
                const c1UpperCase = c1.Country.toUpperCase();
                const c2UpperCase = c2.Country.toUpperCase();
                if (c1UpperCase > c2UpperCase) return 1;
                if (c1UpperCase < c2UpperCase) return -1;
                return 0;
            });

            const globalOption = document.createElement('option');
            globalOption.value = 'global';
            globalOption.text = 'Global';
            countryFormControl.add(globalOption, null);

            countries.forEach((country) => {
                const { Country, Slug } = country;
                const countryOption = document.createElement('option');
                countryOption.value = Slug;
                countryOption.text = Country;
                countryFormControl.add(countryOption, null);
            });

            date.value = new Date().toISOString().slice(0, 10);
        })
        .catch((err) => {
            console.log(err);
            countries = [];
        });

        axios.get(`${apiUrl}/summary`)
            .then((res) => {
                const global = res.data.Global;
                console.log(res.data.Global);
                const { TotalConfirmed, TotalDeaths, TotalRecovered, Date } = global;
                totalConfirmadosFormControl.innerText = TotalConfirmed;
                totalMortesFormControl.innerText = TotalDeaths;
                totalRecuperadosFormControl.innerText = TotalRecovered;
                atualizacao.innerText = Date;
            })
            .catch((err) => {
                console.log(err);
                // tratar summary
            });
});