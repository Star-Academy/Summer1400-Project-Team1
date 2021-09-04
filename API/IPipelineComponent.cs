namespace API
{
    public interface IPipelineComponent
    {
        int OrderId { get; set; }
        string Execute(string sourceDataset);
    }
}