const tasks = {
      'To Do': [
        {
          id: 1,
          title: 'Persona development',
          description: 'Create users personas based on the research data to represent different user groups and their characteristics, goals, and behaviors...',
          tags: ['UX Stages'],
          subtaskProgress: { completed: 3, total: 16 },
        },
      ],
      'Doing': [
        {
          id: 2,
          title: 'User list menu',
          description: 'Create a brand identity system that includes a logo, typography, color palettes, and brand guidelines',
          tags: ['Review', 'Wireframe'],
          subtaskProgress: { completed: 3, total: 16 },
        },
      ],
      'In Review': [
        {
          id: 3,
          title: 'First design concept',
          description: 'Create a concept based on the research and insights gathered during the discovery phase of the project',
          tags: ['Review', 'UI Design'],
          subtaskProgress: { completed: 3, total: 4 },
        },
      ],
      'Done': [
        {
          id: 4,
          title: 'Create foundation color',
          description: 'Create a brand identity system that includes a logo, typography, color palettes, and brand guidelines',
          tags: ['Design system'],
          subtaskProgress: { completed: 10, total: 10 },
        },
      ],
    };

    export async function POST(request) {
      const { title, description, tags, status } = await request.json();
      const newTask = {
        id: Date.now(),
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        subtaskProgress: { completed: 0, total: 0 },
      };
      tasks[status].push(newTask);
      return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    export async function GET() {
      return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    export async function PUT(request) {
      const { taskId, sourceStatus, destinationStatus, updatedTask } = await request.json();
      if (updatedTask) {
        for (const status in tasks) {
          tasks[status] = tasks[status].map(task => {
            if (task.id === taskId) {
              return { ...task, ...updatedTask };
            }
            return task;
          });
        }
        return new Response(JSON.stringify(tasks), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      const taskToMove = tasks[sourceStatus].find(task => task.id === taskId);
      if (!taskToMove) {
        return new Response('Task not found', { status: 404 });
      }
      tasks[sourceStatus] = tasks[sourceStatus].filter(task => task.id !== taskId);
      tasks[destinationStatus].push(taskToMove);
      return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    export async function DELETE(request) {
      const { taskId, status } = await request.json();
      for (const taskStatus in tasks) {
        tasks[taskStatus] = tasks[taskStatus].filter(task => task.id !== taskId);
      }
      return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
