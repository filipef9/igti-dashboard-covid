import { formatNumber } from "../helpers/formatHelpers.js";
import CountryCardSummary from "./CountryCardSummary.js";

const CountrySummary = (summaryData) => {
    const { totalConfirmados, totalMortes, totalRecuperados, ativos } = summaryData;

    const resolveDiarioIndicator = (valueBeforeDayBefore, valueDayBefore, valueSelectedDate) => {
        const valueIndicatorDayBefore = valueDayBefore - valueBeforeDayBefore;
        const valueIndicatorSelectedDate = valueSelectedDate - valueDayBefore;
        const indicator = (valueIndicatorSelectedDate > valueIndicatorDayBefore) ? 'up' : 'down';

        return {
            value: Math.abs(valueIndicatorSelectedDate),
            indicator
        };
    };

    const cardTotalConfirmados = CountryCardSummary({
        label: 'Total Confirmados',
        value: totalConfirmados.valueSelectedDate,
        formatter: formatNumber,
        backgroundColor: 'bg-red-600',
        diario: resolveDiarioIndicator(
            totalConfirmados.valueBeforeDayBefore, 
            totalConfirmados.valueDayBefore, 
            totalConfirmados.valueSelectedDate
        )
    });

    const cardTotalMortes = CountryCardSummary({
        label: 'Total Mortes',
        value: totalMortes.valueSelectedDate,
        formatter: formatNumber,
        backgroundColor: 'bg-black',
        diario: resolveDiarioIndicator(
            totalMortes.valueBeforeDayBefore, totalMortes.valueDayBefore, totalMortes.valueSelectedDate
        )
    });

    const cardTotalRecuperados = CountryCardSummary({
        label: 'Total Recuperados',
        value: totalRecuperados.valueSelectedDate,
        formatter: formatNumber,
        backgroundColor: 'bg-green-600',
        diario: resolveDiarioIndicator(
            totalRecuperados.valueBeforeDayBefore, totalRecuperados.valueDayBefore, totalRecuperados.valueSelectedDate
        )
    });

    const cardAtivos = CountryCardSummary({
        label: 'Ativos',
        value: ativos.valueSelectedDate,
        formatter: formatNumber,
        backgroundColor: 'bg-blue-600',
        diario: resolveDiarioIndicator(
            ativos.valueBeforeDayBefore, ativos.valueDayBefore, ativos.valueSelectedDate
        )
    });

    const summaries = [cardTotalConfirmados, cardTotalMortes, cardTotalRecuperados, cardAtivos];
    return summaries.join('');
};

export default CountrySummary;