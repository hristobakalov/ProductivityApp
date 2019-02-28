using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductivityApp.Models
{
    public class TaskViewModel
    {
        public List<string> Dates { get; set; }
        public List<long> Values { get; set; }
    }
}