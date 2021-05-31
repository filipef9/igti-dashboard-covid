import CountryCardSummary from './components/CountryCardSummary.js';
import GlobalCardSummary from './components/GlobalCardSummary.js';
import GlobalSummary from './components/GlobalSummary.js';
import { formatNumber, formateDateAndHour } from './helpers/formatHelpers.js';

const apiUrl = 'https://api.covid19api.com';

let countries = [];

const sectionSummary = document.getElementById('summary');

const selectedCountryFormControl = document.getElementById('selectedCountry');
const selectedDateFormControl = document.getElementById('date');
const btnFiltrar = document.getElementById('btnFiltrar');

const renderCountrySummary = (summary) => {
    const { totalConfirmados, totalMortes, totalRecuperados, ativos } = summary;

    const cardTotalConfirmados = CountryCardSummary(totalConfirmados);
    const cardTotalMortes = CountryCardSummary(totalMortes);
    const cardTotalRecuperados = CountryCardSummary(totalRecuperados);
    const cardAtivos = CountryCardSummary(ativos);

    const summaries = [cardTotalConfirmados, cardTotalMortes, cardTotalRecuperados, cardAtivos];
    sectionSummary.innerHTML = summaries.join('');
};

const renderSummaryNotFound = () => {
    sectionSummary.innerHTML = '<h3>Sumário não encontrado.</h3>';
};

const resolveDiarioIndicator = (valueBeforeDayBefore, valueDayBefore, valueSelectedDate) => {
    const valueIndicatorDayBefore = valueDayBefore - valueBeforeDayBefore;
    const valueIndicatorSelectedDate = valueSelectedDate - valueDayBefore;
    const indicator = (valueIndicatorSelectedDate > valueIndicatorDayBefore) ? 'up' : 'down';

    return {
        value: Math.abs(valueIndicatorSelectedDate),
        indicator
    };
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
                let summary = null;
                if (summaryExists) {
                    const [summaryBeforeDayBefore, summaryDayBefore, summarySelectedDate] = res.data;

                    const totalConfirmados = {
                        label: 'Total Confirmados',
                        value: summarySelectedDate.Confirmed,
                        formatter: formatNumber,
                        backgroundColor: 'bg-red-600',
                        diario: resolveDiarioIndicator(
                            summaryBeforeDayBefore.Confirmed, summaryDayBefore.Confirmed, summarySelectedDate.Confirmed
                        )
                    };

                    const totalMortes = {
                        label: 'Total Mortes',
                        value: summarySelectedDate.Deaths,
                        formatter: formatNumber,
                        backgroundColor: 'bg-black',
                        diario: resolveDiarioIndicator(
                            summaryBeforeDayBefore.Deaths, summaryDayBefore.Deaths, summarySelectedDate.Deaths
                        )
                    };

                    const totalRecuperados = {
                        label: 'Total Recuperados',
                        value: summarySelectedDate.Recovered,
                        formatter: formatNumber,
                        backgroundColor: 'bg-green-600',
                        diario: resolveDiarioIndicator(
                            summaryBeforeDayBefore.Recovered, summaryDayBefore.Recovered, summarySelectedDate.Recovered
                        )
                    };

                    const ativos = {
                        label: 'Ativos',
                        value: summarySelectedDate.Active,
                        formatter: formatNumber,
                        backgroundColor: 'bg-blue-600',
                        diario: resolveDiarioIndicator(
                            summaryBeforeDayBefore.Active, summaryDayBefore.Active, summarySelectedDate.Active
                        )
                    };

                    summary = { totalConfirmados, totalMortes, totalRecuperados, ativos };
                } else {
                    renderSummaryNotFound();
                }

                renderCountrySummary(summary);
            })
            .catch((err) => console.log(err));
    });
});