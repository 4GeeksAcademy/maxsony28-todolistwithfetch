import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo";
const stateTask = {
  label: "",
  is_done: false
}

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const [task, setTask] = useState(stateTask);

  const [filterStatus, setFilterStatus] = useState("all");

  const getAllTask = async () => {
    try {
      const response = await fetch(`${API_URL}/users/jean`);
      const data = await response.json();

      if (response.ok) {
        setTodos(data.todos);
      }
      if (response.status === 404) {
        createUser();
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/jean`, {
        method: "POST"
      });
      if (response.ok) {
        getAllTask();
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  useEffect(() => {
    getAllTask();
  }, []);

  const handleChange = ({ target }) => {
    setTask({
      ...task,
      [target.name]: target.value
    });
  };

  const addNewTask = async (evento) => {
    if (evento.key === "Enter" && task.label.trim() !== "") {
      try {
        const response = await fetch(`${API_URL}/todos/jean`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(task)
        });

        if (response.ok) {
          setTask(stateTask);
          getAllTask();
        }
      } catch (error) {
        console.error("Error al guardar la tarea:", error);
      }
    }
  };

  const taskDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        getAllTask();
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const taskDone = async (tareaLista) => {
    try {
      const response = await fetch(`${API_URL}/todos/${tareaLista.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label: tareaLista.label,
          is_done: !tareaLista.is_done
        })
      });

      if (response.ok) {
        getAllTask();
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  const filterTodos = todos.filter((item) => {
    if (filterStatus === "done") return item.is_done;
    if (filterStatus === "pending") return !item.is_done;
    return true;
  });

  const renderFooterText = () => {
    try {
      // Si la base de datos está completamente vacía
      if (todos.length === 0) return "No hay tareas, añadir tareas";

      const count = filterTodos.length;

      if (filterStatus === 'done') {
        return count === 0 ? "No hay tareas finalizadas" : `${count} finalizada${count !== 1 ? 's' : ''}`;
      }

      if (filterStatus === 'pending') {
        return count === 0 ? "No hay tareas por finalizar" : `${count} por finalizar`;
      }

      // Si el filtro es 'all' (Todas)
      return `${count} tarea${count !== 1 ? 's' : ''} en total`;

    } catch (error) {
      return "";
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="text-center todo-title display-1 mb-3">todos</h1>

          <div className="card shadow custom-paper border-0 rounded-0">
            <ul className="list-group list-group-flush">

              <li className="list-group-item p-0 border-bottom">
                <input
                  type="text"
                  name="label"
                  className="form-control border-0 custom-input py-3 px-4 fs-4"
                  placeholder="What needs to be done?"
                  value={task.label}
                  onChange={handleChange}
                  onKeyDown={addNewTask}
                />
              </li>

              {filterTodos.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 fs-4 todo-item border-bottom"
                >
                  <span className="text-secondary">
                    {item.label}
                  </span>

                  <div className="d-flex align-items-center gap-3">
                    <input
                      className="form-check-input mt-0"
                      type="checkbox"
                      checked={item.is_done}
                      onChange={() => taskDone(item)}
                      style={{ cursor: "pointer", width: "22px", height: "22px", border: "1px solid #e6e6e6" }}
                    />

                    <button
                      className="btn btn-link text-danger p-0 delete-icon text-decoration-none shadow-none"
                      onClick={() => taskDelete(item.id)}
                    >
                      &#10005;
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-center gap-4 py-3 bg-light border-bottom text-secondary">

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkAll"
                  checked={filterStatus === 'all'}
                  onChange={() => setFilterStatus('all')}
                  style={{ cursor: "pointer" }}
                />
                <label className="form-check-label" htmlFor="checkAll" style={{ cursor: "pointer" }}>
                  Todas
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkDone"
                  checked={filterStatus === 'done'}
                  onChange={() => setFilterStatus('done')}
                  style={{ cursor: "pointer" }}
                />
                <label className="form-check-label" htmlFor="checkDone" style={{ cursor: "pointer" }}>
                  Finalizadas
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkPending"
                  checked={filterStatus === 'pending'}
                  onChange={() => setFilterStatus('pending')}
                  style={{ cursor: "pointer" }}
                />
                <label className="form-check-label" htmlFor="checkPending" style={{ cursor: "pointer" }}>
                  Por Finalizar
                </label>
              </div>

            </div>

            <div className="card-footer bg-white text-muted py-2 px-3 border-top-0 custom-footer">
              <small className="footer-text">{renderFooterText()}</small>
            </div>
          </div>

          <div className="paper-edge-1"></div>
          <div className="paper-edge-2"></div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;