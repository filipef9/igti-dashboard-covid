const CountryCardSummary = (
    label,
    value,
    formatter,
    backgroundColor,
    diarioValue,
    diarioIndicator
) => {
    const indicator = {
        'up': '<i class="fas fa-caret-up"></i>',
        'down': '<i class="fas fa-caret-down"></i>'
    };

    return `
        <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2">
            <div class="${backgroundColor} border rounded shadow p-2">
                <div class="flex flex-row items-center">
                    <div class="flex-1 text-right">
                        <h5 class="text-white">${label}</h5>
                        <h3 class="text-white text-3xl">${formatter(value)}</h3>
                        <div class="diario text-white">
                            <span class="text-blue-400">${indicator[diarioIndicator.toLowerCase()]}</span>
                            <span>Diário:</span>
                            <span>${diarioValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default CountryCardSummary;
