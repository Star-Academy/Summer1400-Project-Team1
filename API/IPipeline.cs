using System.Collections.Generic;
using API.Models;

namespace API
{
    public interface IPipeline
    {
        LinkedList<IPipelineComponent> Components { get; set; }
        string SourceDataset { get; set; }
        string DestinationDataset { get; set; }
        void LoadFromModel(PipelineModel pipelineModel);
        string RunByIndex(int index);
        List<string> GetColumn(int index);
        void Run();
    }
}