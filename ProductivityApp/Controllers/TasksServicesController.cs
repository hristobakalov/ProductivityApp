using Newtonsoft.Json;
using ProductivityApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProductivityApp.Controllers
{
    public class TasksServicesController : ApiController
    {
        private mainEntities db = new mainEntities();
        // GET api/<controller>   : url to use => api/vs
        public TaskViewModel Get()
        {
            var tasks = new List<TaskModelWithDate>();
            foreach (var item in db.Tasks)
            {
                TaskModelWithDate tempTask = new TaskModelWithDate(item);
                tasks.Add(tempTask);
            }
            tasks = tasks.OrderBy(x => x.Date).ToList();

            var groupedTasks = tasks.GroupBy(x => x.TaskDate);
            var summedValuesTasks = new List<Task>();
            foreach (var taskGroup in groupedTasks)
            {
                Task newTask = new Task();
                newTask.TaskDate = taskGroup.First().TaskDate;
                newTask.TaskValue = taskGroup.Sum(x => x.TaskValue);
                summedValuesTasks.Add(newTask);
            }
            TaskViewModel model = new TaskViewModel()
            {
                Dates = summedValuesTasks.Select(x => x.TaskDate).ToList(),
                Values = summedValuesTasks.Select(x => x.TaskValue).ToList()
            };

            return model;
        }

        [HttpPost]
        public TaskCreatedResponseModel AddTask(Task task)
        {
            try
            {
                //Task task = JsonConvert.DeserializeObject<Task>(taskStr);
                if(task == null)
                {
                    throw new ArgumentException("Task cannot be null");
                }
                if (task.TaskValue < 0 || task.TaskValue > 100 || string.IsNullOrEmpty(task.TaskName) || string.IsNullOrEmpty(task.TaskDate))
                {
                    throw new ArgumentException("Values are invalid"); ; //data not valid
                }
                
                db.Tasks.Add(task);
                db.SaveChanges();

                var tasksOnSameDay = db.Tasks.Where(x => x.TaskDate == task.TaskDate);
                var summedValues = tasksOnSameDay.Sum(x => x.TaskValue);

                return new TaskCreatedResponseModel() { DayValueSum = summedValues };
            }
            catch (Exception ex)
            {
                //put some logging
                throw ex;
            }
        }
    }
}
