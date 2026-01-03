
export const toTimestamp = (date: string) =>
    Math.floor(new Date(date).getTime() / 1000)