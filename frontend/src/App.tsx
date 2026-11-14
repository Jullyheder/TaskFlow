import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then((response) => response.json())
      .then((data: Task[]) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar tarefas:', error);
      });
  }, []);

  return (
    <div>
      <h1>Minhas tarefas</h1>

      {tasks.map((task) => (
        <p key={task.id}>
          Titulo: {task.title}
          <br />
          Descrição: {task.description}
          <br />
          Status: {task.status}
        </p>
      ))}
    </div>
  );
}

export default App;