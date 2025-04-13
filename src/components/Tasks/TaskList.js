import { useState, useEffect } from 'react'
import { getTasks, deleteTask, updateTask } from '../../services/api'
import TaskItem from './TaskItem'
import AddTask from './AddTask'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks()
        setTasks(response.data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await updateTask(id, { completed: !completed })
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks])
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className='task-list-container'>
      <h2>My Tasks</h2>
      <AddTask onAdd={handleAddTask} />
      {tasks.length === 0 ? (
        <p>No tasks found. Add a new task!</p>
      ) : (
        <ul className='task-list'>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList
