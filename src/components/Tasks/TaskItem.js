const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className='task-content'>
        <input
          type='checkbox'
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, task.completed)}
          className='task-checkbox'
        />
        <div className='task-details'>
          <h3 className='task-title'>{task.title}</h3>
          {task.description && (
            <p className='task-description'>{task.description}</p>
          )}
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className='delete-btn'>
        Delete
      </button>
    </li>
  )
}

export default TaskItem
