using System.Text;
using Newtonsoft.Json.Linq;

namespace API.Filter
{
    public class Parser : IParser
    {
        private readonly Node _returnRoot;
        
        public Parser(string jsonString)
        {
            var jroot = JObject.Parse(jsonString);
            
            bool isAnd = jroot["AND"] != null;
            var rootCondition = isAnd ? Node.AND : Node.OR;
            _returnRoot = new Node(rootCondition);
            CreateTree(jroot,_returnRoot);
        }

        private void CreateTree(JToken jnode, Node nnode)
        {
            if (jnode["key"] != null)
            {
                var c = new Node(jnode["key"].ToString(), jnode["value"].ToString(), jnode["operator"].ToString());
                nnode.AddChildes(c);
            }
            else if(jnode["OR"] != null || jnode["AND"] != null)
            {
                bool isAnd = jnode["AND"] != null;
                var rootCondition = isAnd ? Node.AND : Node.OR;
                var c = new Node(rootCondition);
                nnode.AddChildes(c);
                foreach (var child in jnode.First.First)
                {
                    CreateTree(child,c);
                }
            }
        }

        public Node GetTree()
        {
            return _returnRoot;
        }
    }
}