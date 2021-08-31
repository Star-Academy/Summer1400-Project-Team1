namespace API
{
    public interface IPipelineComponent
    {
        string Execute(string sourceDataset);
    }
}