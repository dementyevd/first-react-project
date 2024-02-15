import { useEffect, useState } from "react";
import axios from "axios";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
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

  const handleAddTodo = async () => {
    try {
      await axios.post("http://localhost:8888/api/todos", {
        todo: inputValue,
      });
      fetchTodos();
      setInputValue("");
    } catch (error) {
      console.error("Erro adding todo: ", error);
    }
  };

  const handleDeleteTodo = async (index) => {
    try {
      await axios.delete(`http://localhost:8888/api/todos/${index}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-5">Todo List</h1>
      <input
        type="text"
        className="form-control my-3"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter new todo..."
      />
      <button className="btn btn-outline-primary my-3" onClick={handleAddTodo}>
        Save
      </button>

      <ul className="list-group mt-3">
        {todos.map((todo, index) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
            {todo}
            <button
              className="btn btn-outline-danger"
              onClick={() => handleDeleteTodo(index)}
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
