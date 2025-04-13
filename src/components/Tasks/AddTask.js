import { useState } from 'react'
import { addTask as apiAddTask } from '../../services/api'

const AddTask = ({ onAdd }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const response = await apiAddTask({ title, description })
      onAdd(response.data)
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error('Failed to add task:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='add-task-form'>
      <input
        type='text'
        placeholder='Enter task title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='task-input'
        required
      />
      <input
        type='text'
        placeholder='Enter description (optional)'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='task-input'
      />
      <button type='submit' className='add-btn'>
        Add Task
      </button>
    </form>
  )
}

export default AddTask
