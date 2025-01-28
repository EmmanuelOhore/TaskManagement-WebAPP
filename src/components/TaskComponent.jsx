import { useContext, useState } from "react";
import "../styles/Task.css";
import AddSubTask from "./smaller components/Addsubtask";
import PropTypes from "prop-types";
import axios from "axios";
import { TodoContext } from "../utlis/todoContext";

const Task = ({ currentTaskId, setCurrentTaskId }) => {
  // state declaration
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Accessing the global state  from TodoContext
  const { todo, setTodo, handleTaskDisplay, addtodo, setaddTodo } =
    useContext(TodoContext);

  // Function to handle input changes and update the state for task creation
  const handleinputChange = (e) => {
    setaddTodo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open the modal and set the current task ID
  const openModal = (id) => {
    setCurrentTaskId(id);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Destructure properties from the `addtodo` state
  const { title, description, list_type, due_date, subtasks } = addtodo;

  // Reset the task form to its initial state
  const resetForm = () => {
    setaddTodo({
      title: "",
      description: "",
      list_type: "Personal",
      due_date: "",
      subtasks: [],
    });
  };

  // Handle the submission of a new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "https://todolistapp-production.up.railway.app/tasks/";

    // Prepare the new task object
    const newTodo = {
      title: title,
      list_type: list_type,
      due_date: due_date,
      description: description,
      subtasks: subtasks || [],
      checked: false,
      display: false,
    };

    try {
      // Send a POST request to save the new task
      const response = await axios.post(url, newTodo);
      const createdTodo = { ...response.data, ...newTodo };

      // Update the global state with the new task
      setTodo((prev) => [createdTodo, ...prev]);

      // Reset the form and close the task display
      resetForm();
      handleTaskDisplay();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle the completion state of a subtask
  const handleSubTaskToggle = (taskId, subtaskIndex) => {
    setTodo((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubTask = task.subtasks.map((subel, index) => {
            if (index === subtaskIndex) {
              return { ...subel, completed: !subel.completed };
            }
            return subel;
          });
          return { ...task, subtasks: updatedSubTask };
        }
        return task;
      })
    );
  };

  // Handle task deletion
  const handledeletetodo = async (taskid) => {
    if (!taskid) {
      console.error("Task ID is undefined");
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // Send a DELETE request to remove the task
        await axios.delete(
          `https://todolistapp-production.up.railway.app/tasks/${taskid}`
        );

        // Remove the deleted task from the global state
        const newDeletedTodo = todo.filter((task) => task.id !== taskid);
        setTodo(newDeletedTodo);

        // Refresh the task display
        handleTaskDisplay();
      } catch (error) {
        console.error("Error deleting task:", error.response || error.message);
      }
    }
  };

  return (
    <article className="task">
      {/* Task Header */}
      <header className="task-header">
        <h2 className="task-title">Task:</h2>
        <button
          onClick={handleTaskDisplay}
          className="task-close-btn"
          aria-label="Close Task"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </header>

      {/* Task Input Section */}
      <form id="taskForm" onSubmit={handleSubmit} className="task-form">
        <section className="task-input-group">
          {/* Title Input */}
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => handleinputChange(e)}
            className="task-input"
            placeholder="Research Content Ideas"
            required
          />
          {/* Description Input */}
          <textarea
            name="description"
            value={description}
            onChange={(e) => handleinputChange(e)}
            className="task-textarea"
            rows="5"
            cols="40"
            placeholder="Description"
          ></textarea>
        </section>

        {/* Task Details */}
        <section className="task-details">
          {/* List Type Dropdown */}
          <div className="task-detail">
            <label htmlFor="task-list" className="task-label">
              List
            </label>
            <select
              id="list_type"
              name="list_type"
              value={list_type}
              onChange={(e) => handleinputChange(e)}
              className="task-select"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="School">School</option>
            </select>
          </div>
          {/* Due Date Input */}
          <div className="task-detail">
            <label htmlFor="task-date" className="task-label">
              Due Date
            </label>
            <input
              type="date"
              id="task-date"
              value={due_date}
              name="due_date"
              onChange={(e) => handleinputChange(e)}
              className="task-select"
            />
          </div>
        </section>
      </form>

      {/* Subtask Section */}
      <section className="task-subtasks">
        <h2 className="task-title">Subtask:</h2>
        {/* Add Subtask Button */}
        <button
          className="task-add-subtask-btn"
          disabled={
            currentTaskId &&
            todo.find((task) => task.id === currentTaskId)?.subtasks?.length >=
              4
          }
          onClick={() => openModal(currentTaskId)}
        >
          <i className="fa-solid fa-plus"></i> Add New SubTask
        </button>
        {/* Subtask List */}
        <ul className="task-subtask-list">
          {(currentTaskId
            ? todo.find((task) => task.id === currentTaskId)?.subtasks
            : addtodo.subtasks
          )?.map((subel, index) => (
            <li key={subel.id || index} className="task-subtask">
              {subel.title === "" ? null : (
                <>
                  {/* Subtask Checkbox */}
                  <input
                    type="checkbox"
                    id={`subtask-${index}`}
                    checked={subel.completed}
                    onChange={() => handleSubTaskToggle(currentTaskId, index)}
                  />
                  <label
                    htmlFor={`subtask-${index}`}
                    className={
                      subel.completed
                        ? "task-subtask-label strike"
                        : "task-subtask-label"
                    }
                  >
                    {subel.title}
                  </label>
                </>
              )}
            </li>
          ))}
        </ul>
        {/* Add Subtask Modal */}
        <AddSubTask
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          taskId={currentTaskId}
        />
      </section>

      {/* Button Section */}
      <section className="task-actions">
        {/* Delete Task Button */}
        <button
          className="task-btn task-btn--delete"
          onClick={() => handledeletetodo(currentTaskId)}
          type="button"
        >
          Delete Task
        </button>
        {/* Save Changes Button */}
        <button
          className="task-btn task-btn--save"
          form="taskForm"
          type="submit"
        >
          Save Changes
        </button>
      </section>
    </article>
  );
};

Task.propTypes = {
  currentTaskId: PropTypes.string,
  setCurrentTaskId: PropTypes.func.isRequired,
};

export default Task;
