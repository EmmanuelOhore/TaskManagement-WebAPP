import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { TodoContext } from "./todoContext";

const TodoProvider = ({ children }) => {
  // State for storing todos, initialized with saved todos from localStorage
  const [todo, setTodo] = useState(() => {
    const savedtodo = localStorage.getItem("savedtodo");
    return savedtodo ? JSON.parse(savedtodo) : [];
  });
  // Fetch todos from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://todolistapp-production.up.railway.app/tasks/"
      );

      setTodo(response.data);
    };
    fetchData();
  }, []);
  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todo.length > 0) {
      localStorage.setItem("savedtodo", JSON.stringify(todo));
    }
  }, [todo]);
  // State for managing pagination (current page and page size)
  const [page, setpage] = useState({
    currentPage: 1,
    Pagesize: 6,
  });
  // State for toggling the visibility of tasks
  const [showTask, setShowTask] = useState(true);
  // Function to toggle the task display
  const handleTaskDisplay = () => {
    setShowTask((prev) => !prev);
  };
  // State for managing a new task being added
  const [addtodo, setaddTodo] = useState({
    title: "",
    description: "",
    list_type: "Personal",
    due_date: "Today",
    subtasks: [],
  });
  // States for storing filtered tasks by type (Personal, Work, School)
  const [personaltodo, setPersonalTodo] = useState([]);
  const [worktodo, setWorkTodo] = useState([]);
  const [schooltodo, setSchoolTodo] = useState([]);
  // Filter todos by type whenever the todo list changes
  useEffect(() => {
    if (!Array.isArray(todo)) return;
    // filterepersonaltodo
    const filtredPersonalTodo = todo.filter(
      (el) => el.list_type === "Personal"
    );
    setPersonalTodo(filtredPersonalTodo);
    // filterework todo
    const filtredWorkTodo = todo.filter((el) => el.list_type === "Work");
    setWorkTodo(filtredWorkTodo);
    // filtereschool todo
    const filtredSchoolTodo = todo.filter((el) => el.list_type === "School");
    setSchoolTodo(filtredSchoolTodo);
  }, [todo]);

  // search functionaloty:
  // State and function for managing search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setshow] = useState(false);

  const handleshowsidebar = () => {
    setshow((prev) => !prev);
  };
  return (
    <>
      <TodoContext.Provider
        value={{
          todo, // All todos
          show, // Sidebar visibility state
          handleshowsidebar, // Function to toggle sidebar visibility
          searchTerm, // Search input state
          setSearchTerm, // Function to update search input
          addtodo, // State for a new task being added
          personaltodo, // Filtered personal todos
          setPersonalTodo, // Function to update personal todos
          schooltodo, // Filtered school todos
          worktodo, // Filtered work todos
          setaddTodo, // Function to update the new task state
          setTodo, // Function to update the todo list
          showTask, // Visibility state of tasks
          setShowTask, // Function to toggle task visibility
          page, // Pagination state
          setpage, // Function to update pagination
          handleTaskDisplay, // Function to toggle task display
        }}
      >
        {children}
      </TodoContext.Provider>{" "}
    </>
  );
};

TodoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default TodoProvider;
