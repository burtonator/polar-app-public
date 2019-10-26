
export class DateConstants {

    public static create(): TestDates {

        const today = new Date();

        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const oneDayAgo = new Date(today);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const twoDaysInFuture = new Date(today);
        twoDaysInFuture.setDate(twoDaysInFuture.getDate() + 2);

        const twoWeeksInFuture = new Date(today);
        twoWeeksInFuture.setDate(twoWeeksInFuture.getDate() + 2 * 7);

        return {today, twoDaysAgo, oneWeekAgo, twoDaysInFuture, twoWeeksInFuture};

    }

}

export interface TestDates {
    readonly today: Date;
    readonly twoDaysAgo: Date;
    readonly oneWeekAgo: Date;
    readonly twoDaysInFuture: Date;
    readonly twoWeeksInFuture: Date;
}
