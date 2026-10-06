public static class WeekHelper
{
    public static DateOnly StartOfWeek(DateOnly date, DayOfWeek firstDay = DayOfWeek.Sunday)
    {
        var diff = (7 + (int)date.DayOfWeek - (int)firstDay) % 7;
        return date.AddDays(-diff);
    }
}