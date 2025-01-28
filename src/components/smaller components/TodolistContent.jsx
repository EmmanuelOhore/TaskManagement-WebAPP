import PropTypes from "prop-types";
import { TodoContext } from "../../utlis/todoContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useContext, useState } from "react";

// Accessing the global state  from TodoContext
const TodoListContent = ({
  todoEl,
  index,
  handleDisplay,
  editingIndex,
  setEditingIndex,
  setCurrentTaskId,
  setCurOpen,
  currentTaskId,
}) => {
  const { handleTaskDisplay, setaddTodo, setTodo, todo } =
    useContext(TodoContext);
  const [editedTodo, setEditedTodo] = useState({ ...todoEl });

  // handles the background color of the list types
  const handlebgcolor = () => {
    if (todoEl.list_type === "Personal") {
      return { backgroundColor: "#ff6b6b" };
    } else if (todoEl.list_type === "Work") {
      return { backgroundColor: "#66d9e8" };
    } else if (todoEl.list_type === "School") {
      return { backgroundColor: "#ffd43b" };
    }
  };

  // handles the the display of the specific task
  const handleTaskSpecificDetials = () => {
    handleTaskDisplay();
    setaddTodo((prev) => ({
      ...prev,
      id: todoEl.id,
      title: todoEl.title,
      list_type: todoEl.list_type,
      due_date: todoEl.due_date,
      description: todoEl.description,
    }));
    setCurrentTaskId(todoEl.id);
  };

  // handles the drop down menu of the  todo
  const handleIconClick = (e) => {
    e.stopPropagation();
    handleDisplay(index);
  };
  // Toggles the edit mode for the current todo item
  const handleEditToggle = () => {
    setEditingIndex(editingIndex === index ? null : index);
  };
  // Updates the local state with edited values when changes occur in input fields.
  const handleEditingchanges = (e) => {
    const { name, value } = e.target;
    setEditedTodo({ ...editedTodo, [name]: value });
  };
  // Saves the changes made to the todo item and sends a PUT request to the server.
  const handleSave = async (e) => {
    e.stopPropagation();
    localStorage.setItem("savedtodo", JSON.stringify(todo));

    handleEditToggle();
    setCurOpen(null);
    setEditingIndex(null);
    try {
      const url = `https://todolistapp-production.up.railway.app/tasks/${editedTodo.id}/`;
      const response = await axios.put(url, editedTodo);
      // Update the local state with the modified todo item
      setTodo((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === response.data.id ? { ...todo, ...response.data } : todo
        )
      );

      localStorage.setItem("savedtodo", JSON.stringify(todo));
      // Notify the user of success
      toast.success("Task updated successfully!");
      handleEditToggle();
      setCurOpen(null);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating the task:", error);
      toast.error("Failed to save the changes. Please try again.");
    }
  };
  //  Toggles the checked state of the todo item.
  const handlecheck = (todoEl) => {
    setTodo((prev) => {
      const updatedTodos = prev.map((task) => {
        if (task.id === todoEl.id) {
          return { ...task, checked: !task.checked };
        }
        return task;
      });
      // Move completed tasks to the bottom of the list
      const reorderedTodos = updatedTodos.sort((a, b) => {
        if (a.checked === b.checked) {
          return 0;
        }
        return a.checked ? 1 : -1;
      });

      return reorderedTodos;
    });
  };

  return (
    <>
      <ToastContainer />
      <li onClick={handleTaskSpecificDetials} className="todo">
        <div className="todo-detail-wrapper">
          <div className="todo-check">
            <input
              onClick={(e) => e.stopPropagation()}
              onChange={() => handlecheck(todoEl)}
              checked={todoEl.checked}
              className="checkbox"
              type="checkbox"
            />
            {editingIndex === index ? (
              <div className="edited-wrapper">
                <input
                  className="editingInput"
                  type="text"
                  name="title"
                  value={editedTodo.title}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleEditingchanges}
                />
                <p className="edittedsave" onClick={handleSave}>
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </p>
              </div>
            ) : (
              <h3 className={todoEl.checked ? "strike" : "null"}>
                {todoEl.title}
              </h3>
            )}
          </div>
          <i
            onClick={handleIconClick}
            className={
              todoEl.display
                ? "fa-solid fa-chevron-down"
                : "fa-solid fa-angle-right"
            }
          ></i>
        </div>
        {/* todo task detrails */}
        {todoEl.display && (
          <>
            <div className="todo-task-details">
              <div className="Task-description-container">
                {editingIndex === index ? (
                  <div className="edited-wrapper">
                    <textarea
                      className="editingInput decriptionedit"
                      type="text"
                      onClick={(e) => e.stopPropagation()}
                      name="description"
                      value={editedTodo.description}
                      onChange={handleEditingchanges}
                    />
                  </div>
                ) : (
                  <p className="task-decription"> {todoEl.description} </p>
                )}
              </div>
              <div className="task-detaiils-todo-container">
                <div className="task-date">
                  <i className="fa-regular fa-calendar-days"></i>
                  <time>{todoEl.due_date}</time>
                </div>
                <div className="Subtask-details">
                  <p>
                    {
                      todo.find((task) => task.id === currentTaskId)?.subtasks
                        ?.length
                    }
                  </p>
                  <h4>Subtasks</h4>
                </div>
                <div className="tag-details">
                  <div style={handlebgcolor()} className="tag"></div>
                  <p>{todoEl.list_type}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </li>
    </>
  );
};
TodoListContent.propTypes = {
  todoEl: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    display: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    list_type: PropTypes.string.isRequired,
    due_date: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
  }).isRequired,
  handleDisplay: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  editingIndex: PropTypes.number,
  setEditingIndex: PropTypes.func.isRequired,
  setCurOpen: PropTypes.func.isRequired,
  setCurrentTaskId: PropTypes.func.isRequired,
  currentTaskId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TodoListContent;
