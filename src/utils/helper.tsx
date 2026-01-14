
export const toTimestamp = (date: string): bigint =>
    BigInt(Math.floor(new Date(date).getTime() / 1000))


export function formatDateFromSeconds(seconds?: number | string) {
    if (!seconds) return "-";
    return new Date(Number(seconds) * 1000).toLocaleDateString("vi-VN");
}

export const getInitials = (name: string) => {
    if (!name) return '?'
    const words = name.trim().split(' ')
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase()
    }
    return (words[0][0] + words[1][0]).toUpperCase()
}

export function shortenAddr(address?: string):
    string | undefined {
    if (address) {
        const start = address.substring(0, 6);
        const end = address.substring(address.length - 4);
        return `${start}...${end}`;
    } else {
        return undefined;
    }

}

export function totalPages (totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
}




