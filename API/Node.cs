using System;
using System.Collections.Generic;

namespace API
{
    public class Node
    {
        public const int AND = 0;
        public const int OR = 1;
        
        private readonly bool _isLeaf;
        private readonly int _conditionType;
        private readonly List<Node> _childes;
        private readonly string _key;
        private readonly string _value;
        private readonly string _operator;
        
        public Node(int conditionType)
        {
            _conditionType = conditionType;
            _childes = new List<Node>();
            _isLeaf = false;
        }

        public Node(string key, string value, string @operator)
        {
            _key = key;
            _value = value;
            _operator = @operator;
            _isLeaf = true;
        }

        public bool IsLeaf() => _isLeaf;
        
        public string GetConditionType() => _conditionType == AND ? "AND" : "OR";

        public void AddChildes(Node child)
        {
            if (!_isLeaf)
            {
                _childes.Add(child);
            }
            else
            {
                Console.WriteLine("this node can't have any childes");
            }
        }
        
        public List<Node> GetChildes()
        {
            if (!_isLeaf)
            {
                return _childes;
            }
            Console.WriteLine("this node have not any childes");
            return null;
        }

        public string GetKey() => _key;
        
        public string GetValue() => _value;
        
        public string GetOperator() => _operator;

    }
}