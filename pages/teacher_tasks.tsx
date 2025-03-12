import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";

interface Task {
  id: number;
  title: string;
  deadline: string;
  status: 'pending' | 'completed';
  type: string;
}

const TeacherTasks: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Prepare Data Structures Mid-Term", deadline: "2025-03-20", status: "pending", type: "Exam" },
    { id: 2, title: "Grade Machine Learning Assignments", deadline: "2025-03-15", status: "pending", type: "Assignment" },
    { id: 3, title: "Faculty Development Meeting", deadline: "2025-03-18", status: "pending", type: "Meeting" },
    { id: 4, title: "Update Course Materials", deadline: "2025-03-25", status: "pending", type: "Other" },
    { id: 5, title: "Student Counseling Hours", deadline: "2025-03-14", status: "completed", type: "Meeting" }
  ]);
  
  const [newTask, setNewTask] = useState({ title: "", deadline: "", type: "Other" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "teacher") router.push("/");
  }, [router]);

  const addTask = () => {
    if (newTask.title && newTask.deadline) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        deadline: newTask.deadline,
        status: 'pending' as const,
        type: newTask.type
      };
      
      setTasks([...tasks, task]);
      setNewTask({ title: "", deadline: "", type: "Other" });
      setShowAddForm(false);
    }
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' } 
        : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Group tasks
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <TeacherSidebar />
      <div className="ml-16 p-6 w-full text-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <button 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "Add Task"}
          </button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-gray-800 p-4 rounded-lg mt-4 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
              />
              <input 
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
              />
              <select
                value={newTask.type}
                onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
              >
                <option value="Other">Other</option>
                <option value="Exam">Exam</option>
                <option value="Assignment">Assignment</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            <button 
              onClick={addTask}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Add Task
            </button>
          </div>
        )}

        {/* Pending Tasks */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Pending Tasks ({pendingTasks.length})</h2>
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-gray-750 p-4 rounded-lg border border-gray-600 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex space-x-2 text-sm text-gray-400 mt-1">
                      <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{task.type}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleTaskStatus(task.id)}
                      className="bg-green-700 text-white p-2 rounded hover:bg-green-600"
                      title="Mark as Completed"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-700 text-white p-2 rounded hover:bg-red-600"
                      title="Delete Task"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No pending tasks</p>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-4 text-green-400">Completed Tasks ({completedTasks.length})</h2>
          {completedTasks.length > 0 ? (
            <div className="space-y-3">
              {completedTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-gray-750 p-4 rounded-lg border border-gray-600 flex justify-between items-center opacity-70"
                >
                  <div>
                    <h3 className="font-medium line-through">{task.title}</h3>
                    <div className="flex space-x-2 text-sm text-gray-400 mt-1">
                      <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{task.type}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleTaskStatus(task.id)}
                      className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
                      title="Mark as Pending"
                    >
                      ↺
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-700 text-white p-2 rounded hover:bg-red-600"
                      title="Delete Task"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No completed tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherTasks;