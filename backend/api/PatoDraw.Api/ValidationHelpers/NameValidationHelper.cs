namespace PatoDraw.Api.ValidationHelpers;

public static class NameValidationHelper
{
    const int MaxNameLength = 200;
    const int MinNameLength = 1;

    public static ValidationResult IsValid(string Name)
    {
        if (string.IsNullOrEmpty(Name))
        {
            return ValidationResult.Invalid("cannot be empty");
        }

        if (Name.Length < MinNameLength)
        {
            return ValidationResult.Invalid($"cannot be less than {MinNameLength} characters");
        }

        if (Name.Length > MaxNameLength)
        {
            return ValidationResult.Invalid($"cannot be more than {MaxNameLength} characters");
        }

        return ValidationResult.Valid();
    }
}
