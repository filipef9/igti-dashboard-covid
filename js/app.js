import CountrySummary from './components/CountrySummary.js';
import GlobalSummary from './components/GlobalSummary.js';

const apiUrl = 'https://api.covid19api.com';

let countries = [];

const sectionSummary = document.getElementById('summary');

const selectedCountryFormControl = document.getElementById('selectedCountry');
const selectedDateFormControl = document.getElementById('date');
const btnFiltrar = document.getElementById('btnFiltrar');

const renderSummaryNotFound = () => {
    sectionSummary.innerHTML = '<h3>Sumário não encontrado.</h3>';
};

const createOption = (value, label) => {
    const option = document.createElement('option');
    option.value = value;
    option.text = label;
    return option;
};

const loadCountriesSelect = (countries) => {
    const globalOption = createOption('global', 'Global');
    selectedCountryFormControl.add(globalOption, null);

    countries.forEach((country) => {
        const { Country, Slug } = country;
        const countryOption = createOption(Slug, Country);
        selectedCountryFormControl.add(countryOption, null);
    });
};

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

            loadCountriesSelect(countries);

            selectedDateFormControl.value = new Date().toISOString().slice(0, 10);
        })
        .catch((err) => {
            console.log(err);
            countries = [];
        });

    axios.get(`${apiUrl}/summary`)
        .then((res) => {
            const { TotalConfirmed, TotalDeaths, TotalRecovered, Date } = res.data.Global;

            sectionSummary.innerHTML = GlobalSummary({
                totalConfirmados: TotalConfirmed,
                totalMortes: TotalDeaths,
                totalRecuperados: TotalRecovered,
                atualizacao: Date
            });
        })
        .catch((err) => {
            console.log(err);
            renderSummaryNotFound();
        });

    btnFiltrar.addEventListener('click', (_) => {
        const selectedCountry = selectedCountryFormControl.value;
        const [year, month, day] = selectedDateFormControl.value.split('-');

        const params = {
            from: `${year}-${month}-${day - 2}T00:00:00Z`,
            to: `${year}-${month}-${day}T00:00:00Z`
        };

        axios.get(`${apiUrl}/country/${selectedCountry}`, { params })
            .then((res) => {
                const summaryExists = res.data.length === 3;
                let summaryData = null;
                if (summaryExists) {
                    const [summaryBeforeDayBefore, summaryDayBefore, summarySelectedDate] = res.data;

                    summaryData = { 
                        totalConfirmados: {
                            valueSelectedDate: summarySelectedDate.Confirmed,
                            valueDayBefore: summaryDayBefore.Confirmed,
                            valueBeforeDayBefore: summaryBeforeDayBefore.Confirmed
                        },
                        totalMortes: {
                            valueSelectedDate: summarySelectedDate.Deaths,
                            valueDayBefore: summaryDayBefore.Deaths,
                            valueBeforeDayBefore: summaryBeforeDayBefore.Deaths
                        },
                        totalRecuperados: {
                            valueSelectedDate: summarySelectedDate.Recovered,
                            valueDayBefore: summaryDayBefore.Recovered,
                            valueBeforeDayBefore: summaryBeforeDayBefore.Active
                        },
                        ativos: {
                            valueSelectedDate: summarySelectedDate.Active,
                            valueDayBefore: summaryDayBefore.Active,
                            valueBeforeDayBefore: summaryBeforeDayBefore.Active
                        }
                    };
                } else {
                    //renderSummaryNotFound();
                }

                sectionSummary.innerHTML = CountrySummary(summaryData);
            })
            .catch((err) => console.log(err));
    });
});