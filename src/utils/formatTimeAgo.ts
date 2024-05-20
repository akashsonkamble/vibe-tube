const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "always",
});

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit}[] = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.345, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export const formatTimeAgo = (date: Date) => {
    let duration = (new Date().getTime() - date.getTime()) / 1000;

    for (const { amount, name } of DIVISIONS) {
        if (Math.abs(duration) < amount) {
            return formatter.format(Math.round(duration), name);
        }
        duration /= amount;
    }
}