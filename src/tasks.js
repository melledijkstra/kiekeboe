
export function fetchTasks(token) {
  fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log('Tasks:', data.items);
    })
    .catch(error => console.error('Error fetching tasks:', error));
}