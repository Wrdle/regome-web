export default class CarData {
    public RegistrationNumber: string;
    public VIN: string;
    public Description: string;
    public Purpose: string;
    public Status: string;
    public Expiry: string;

    constructor(registrationNumber: string, vin: string, description: string, purpose: string, status: string, expiry: string) {
        this.RegistrationNumber = registrationNumber;
        this.VIN = vin;
        this.Description = description;
        this.Purpose = purpose;
        this.Status = status;
        this.Expiry = expiry;
    }
}