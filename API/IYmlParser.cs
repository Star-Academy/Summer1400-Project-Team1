using API.Filter;

namespace API
{
    public interface IYmlParser
    {
        Node BuildTreeOfConditions(string pathOfYmlFile);
    }
}