import { formateDateAndHour, formatNumber } from "../helpers/formatHelpers.js";
import GlobalCardSummary from "./GlobalCardSummary.js";

const GlobalSummary = (summaryData) => {
    const { totalConfirmados, totalMortes, totalRecuperados, atualizacao } = summaryData; // only values

    const cardTotalConfirmados = GlobalCardSummary({
        label: 'Total Confirmados',
        value: totalConfirmados,
        formatter: formatNumber,
        backgroundColor: 'bg-red-600'
    });

    const cardTotalMortes = GlobalCardSummary({
        label: 'Total Mortes',
        value: totalMortes,
        formatter: formatNumber,
        backgroundColor: 'bg-black'
    });

    const cardTotalRecuperados = GlobalCardSummary({
        label: 'Total Recuperados',
        value: totalRecuperados,
        formatter: formatNumber,
        backgroundColor: 'bg-green-600'
    });

    const cardAtualizacao = GlobalCardSummary({
        label: 'Atualização',
        value: atualizacao,
        formatter: formateDateAndHour,
        backgroundColor: 'bg-blue-600'
    });

    const summaries = [cardTotalConfirmados, cardTotalMortes, cardTotalRecuperados, cardAtualizacao];
    return summaries.join('');
};

export default GlobalSummary;