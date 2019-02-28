using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace ProductivityApp.Models
{
    public class TaskModelWithDate : Task
    {
        public TaskModelWithDate()
        {

        }
        public TaskModelWithDate(Task task)
        {
            TaskDate = task.TaskDate;
            TaskName = task.TaskName;
            TaskValue = task.TaskValue;
            ID = task.ID;
        }
        public DateTime Date => DateTime.ParseExact(TaskDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
    }
}