using System.Collections.Generic;

namespace API
{
    public class Pipeline: IPipeline
    {
        public LinkedList<IPipelineComponent> Components { get; set; }
        public string SourceDataset { get; set; }
        public string DestinationDataset { get; set; }

        private void RunByIndex(int index)
        {
            
        }
        public void Run(int index = 0)
        {
            if(index != 0) RunByIndex(index);
            
        }
    }
}