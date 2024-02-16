import { useEffect, useState } from "react";
import axios from "axios";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState(""); //значение в поле ввода задачи
  const [priority, setPriority] = useState("Low"); //приоритет
  const [deadline, setDeadline] = useState(""); //дедлайн
  //загрузка задач из localstorage при запуске приложения
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8888/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetchng todos: ", error);
    }
  };

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handlePriorityChange = (event) => setPriority(event.target.value);

  const handleDeadlineChange = (event) => setDeadline(event.target.value);

  const handleAddTodo = async () => {
    try {
      await axios.post("http://localhost:8888/api/todos", {
        todo: inputValue,
        priority: priority,
        deadline: deadline,
      });
      fetchTodos();
      setInputValue("");
      setPriority("Low");
      setDeadline("");
    } catch (error) {
      console.error("Erro adding todo: ", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo: ", error);
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
      </div>
      <button className="btn btn-outline-primary my-3" onClick={handleAddTodo}>
        Save
      </button>

      <ul className="list-group mt-3">
        {todos.map((todo) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={todo._id}
          >
            <span>{todo.todo}</span>|<span>Priority: {todo.priority}</span>|
            <span>Deadline: {todo.deadline}</span>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleDeleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
