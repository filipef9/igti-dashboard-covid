const formatter = Intl.NumberFormat('pt-Br');

export const formatNumber = (value) => formatter.format(value);

export const formateDateAndHour = (value) => {
    let aDate = (typeof string) ? new Date(value) : value;

    const day = ('00' + aDate.getDate()).slice(-2);
    const month = ('00' + (aDate.getMonth() + 1)).slice(-2);
    const year = aDate.getFullYear();

    const hours = ('00' + aDate.getHours()).slice(-2);
    const minutes = ('00' + aDate.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}