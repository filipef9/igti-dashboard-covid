import CountryCardSummary from './components/CountryCardSummary.js';
import GlobalCardSummary from './components/GlobalCardSummary.js';
import { formatNumber, formateDateAndHour } from './helpers/formatHelpers.js';

const apiUrl = 'https://api.covid19api.com';

let countries = [];

const sectionSummary = document.getElementById('summary');

const selectedCountryFormControl = document.getElementById('selectedCountry');
const selectedDateFormControl = document.getElementById('date');
const btnFiltrar = document.getElementById('btnFiltrar');

const renderGlobalSummary = (summary) => {
    const totalConfirmados = GlobalCardSummary(
        'Total Confirmados',
        summary.totalConfirmados,
        formatNumber,
        'bg-red-600'
    );

    const totalMortes = GlobalCardSummary(
        'Total Mortes',
        summary.totalMortes,
        formatNumber,
        'bg-black'
    );

    const totalRecuperados = GlobalCardSummary(
        'Total Recuperados',
        summary.totalRecuperados,
        formatNumber,
        'bg-green-600'
    );

    const atualizacao = GlobalCardSummary(
        'Atualização',
        summary.atualizacao,
        formateDateAndHour,
        'bg-blue-600'
    );

    const summaries = [totalConfirmados, totalMortes, totalRecuperados, atualizacao];
    sectionSummary.innerHTML = summaries.join('');
};

const renderCountrySummary = (summary) => {
    const totalConfirmados = CountryCardSummary(
        'Total Confirmados',
        summary.totalConfirmados,
        formatNumber,
        'bg-red-600',
        summary.diario.value,
        summary.diario.indicator
    );

    const totalMortes = CountryCardSummary(
        'Total Mortes',
        summary.totalMortes,
        formatNumber,
        'bg-black',
        summary.diario.value,
        summary.diario.indicator
    );

    const totalRecuperados = CountryCardSummary(
        'Total Recuperados',
        summary.totalRecuperados,
        formatNumber,
        'bg-green-600',
        summary.diario.value,
        summary.diario.indicator
    );

    const ativos = CountryCardSummary(
        'Ativos',
        summary.ativos,
        formatNumber,
        'bg-blue-600',
        summary.diario.value,
        summary.diario.indicator
    );

    const summaries = [totalConfirmados, totalMortes, totalRecuperados, ativos];
    sectionSummary.innerHTML = summaries.join('');
}

const createOption = (value, label) => {
    const option = document.createElement('option');
    option.value = value;
    option.text = label;
    return option;
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

            const globalOption = createOption('global', 'Global');
            selectedCountryFormControl.add(globalOption, null);

            countries.forEach((country) => {
                const { Country, Slug } = country;
                const countryOption = createOption(Slug, Country);
                selectedCountryFormControl.add(countryOption, null);
            });

            selectedDateFormControl.value = new Date().toISOString().slice(0, 10);
        })
        .catch((err) => {
            console.log(err);
            countries = [];
        });

        axios.get(`${apiUrl}/summary`)
            .then((res) => {
                const { TotalConfirmed, TotalDeaths, TotalRecovered, Date } = res.data.Global;
                
                const summary = {
                    totalConfirmados: TotalConfirmed,
                    totalMortes: TotalDeaths,
                    totalRecuperados: TotalRecovered,
                    atualizacao: Date,
                    ativos: null
                };

                renderGlobalSummary(summary);
            })
            .catch((err) => {
                console.log(err);
                // tratar summary
            });

    btnFiltrar.addEventListener('click', (_) => {
        const selectedCountry = selectedCountryFormControl.value;
        const [year, month, day] = selectedDateFormControl.value.split('-');

        const params = {
            from: `${year}-${month}-${day - 1}T00:00:00Z`,
            to: `${year}-${month}-${day}T00:00:00Z`
        };

        axios.get(`${apiUrl}/country/${selectedCountry}`, { params })
            .then((res) => {
                const summaryExists = res.data.length === 2;
                let summary = null;
                if (summaryExists) {
                    const [summaryDayBefore, summarySelectedDate] = res.data;
    
                    summary = {
                        totalConfirmados: summarySelectedDate.Confirmed,
                        totalMortes: summarySelectedDate.Deaths,
                        totalRecuperados: summarySelectedDate.Recovered,
                        ativos: summarySelectedDate.Active,
                        diario: {
                            value: 0,
                            indicator: 'up'
                        }
                    };
                } else {
                    summary = {
                        totalConfirmados: 0,
                        totalMortes: 0,
                        totalRecuperados: 0,
                        atualizacao: '',
                        ativos: 0,
                        diario: {
                            value: 0,
                            indicator: 'up'
                        }
                    };
                }

                renderCountrySummary(summary);
            })
            .catch((err) => console.log(err));
    });
});