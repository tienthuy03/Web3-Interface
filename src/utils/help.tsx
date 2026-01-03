
export const toTimestamp = (date: string) =>
    Math.floor(new Date(date).getTime() / 1000)

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
