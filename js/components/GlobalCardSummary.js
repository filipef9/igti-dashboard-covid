const GlobalCardSummary = (
    label,
    value,
    formatter,
    backgroundColor
) => {
    return `
        <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2">
            <div class="${backgroundColor} rounded shadow p-2">
                <div class="flex flex-row items-center">
                    <div class="flex-1 text-right">
                        <h5 class="text-white">${label}</h5>
                        <h3 class="text-white text-3xl">${formatter(value)}</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default GlobalCardSummary;
