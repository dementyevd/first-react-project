import { useEffect, useState } from "react";
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState(""); //значение в поле ввода задачи
  const [priority, setPriority] = useState("Low"); //приоритет
  const [deadline, setDeadline] = useState(""); //дедлайн
  const [description, setDescription] = useState(""); //описание задачи
  const [sortPriority, setSortPriority] = useState("Low"); //сортировка по приоритету
  const [editing, setEditing] = useState(false); //открыта ли форма изменения
  const [selectedTodo, setSelectedTodo] = useState(null); //выбранная задача
  //загрузка задач
  // useEffect(() => {
  //     fetchTodos();
  // }, []);

  useEffect(() => {
    fetchTodos();
  }, [sortPriority]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8888/api/todos");
      const sortedTodos = response.data.sort((a, b) => {
        const priorityOrder = { Low: 0, Medium: 1, High: 2 };
        return (
          (priorityOrder[a.priority] - priorityOrder[b.priority]) *
          (sortPriority === "High" ? -1 : 1)
        );
      });
      setTodos(sortedTodos);
    } catch (error) {
      console.error("Error fetchng todos: ", error);
    }
  };

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handlePriorityChange = (event) => setPriority(event.target.value);

  const handleDeadlineChange = (event) => setDeadline(event.target.value);

  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleSortPriorityChange = (event) => {
    setSortPriority(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      await axios.post("http://localhost:8888/api/todos", {
        todo: inputValue,
        description: description,
        priority: priority,
        deadline: deadline,
      });
      fetchTodos();
      setInputValue("");
      setPriority("Low");
      setDeadline("");
      setDescription("");
    } catch (error) {
      console.error("Erro adding todo: ", error);
    }
  };

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
    setEditing(true);
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  //кейсы цветов в зависимости от приоритета
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "table-success";
      case "Medium":
        return "table-warning";
      case "High":
        return "table-danger";
      default:
        return "table-light";
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-5">Todo List</h1>
      <div className="form-group my-3">
        <input
          type="text"
          className="form-control my-2"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter new todo..."
        />
        <select
          value={priority}
          onChange={handlePriorityChange}
          className="form-select my-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="datetime-local"
          value={deadline}
          onChange={handleDeadlineChange}
          className="form-control my-2"
        />
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="form-control my-2"
          placeholder="Enter todo description..."
        ></textarea>
      </div>
      <button className="btn btn-outline-primary my-3" onClick={handleAddTodo}>
        Save
      </button>

      {/* сортировка по приоритету */}
      <select
        value={sortPriority}
        onChange={handleSortPriorityChange}
        className="form-select my-2 w-25 ms-auto"
      >
        <option value="Low">Low</option>
        <option value="Medium" disabled>
          Medium
        </option>
        <option value="High">High</option>
      </select>
      <table className="table table-hover table-bordered align-middle mt-3">
        <thead>
          <tr className="table-info">
            <th>Title</th>
            <th>Description</th>
            <th>Deadline</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id} className={getPriorityColor(todo.priority)}>
              <td>{todo.todo}</td>
              <td>{todo.description}</td>
              <td style={{ width: "20%" }}>{todo.deadline}</td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
