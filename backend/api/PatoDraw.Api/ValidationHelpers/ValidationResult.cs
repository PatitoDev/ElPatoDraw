namespace PatoDraw.Api.ValidationHelpers;

public record ValidationResult
{
    public readonly bool IsValid;
    public readonly string Reason;

    private ValidationResult(bool isValid, string reason)
    {
        IsValid = isValid;
        Reason = reason;
    }

    public static ValidationResult Valid() =>
        new (true, "");

    public static ValidationResult Invalid(string reason) =>
        new (false, reason);
}; 
