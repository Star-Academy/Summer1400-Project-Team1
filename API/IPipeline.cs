using System.Collections.Generic;

namespace API
{
    public interface IPipeline
    {
        LinkedList<IPipelineComponent> Components { get; set; }
        string SourceDataset { get; set; }
        string DestinationDataset { get; set; }
        void Run(int index=0);
    }
}