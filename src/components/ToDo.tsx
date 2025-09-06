import { use, useState } from 'react';

interface TodoItem {
    id: string,
    text: string,
    completed: boolean
}

const TodoApp = () => {

    // Holds list of to-do items
    const [todos, setTodos] = useState<TodoItem[]>([]); 
    // Holds current value of new to-do input field
    const [newTodo, setNewTodo] = useState<string>("");

    // Function to add a new to-do item
    const addTodo = () => {
        if (newTodo !== ' ') { // Checks if input is not empty
            const newId = crypto.randomUUID(); // Generates a Universally Unique Identifier (UUID)
            /* Creates new to-do item object, initialised with the generated UUID, 
            input text, and a default completed status of false */             
            const newTodoItem: TodoItem = {
                id: newId,
                text: newTodo,
                completed: false
            };
            setTodos([...todos, newTodoItem]); // Appends new to-do item to existing list
            setNewTodo(''); // Resets input field for next entry
        }
    };
    
    // Function to remove an item
    const removeTodo = (id:string) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id); // Filters out the item with the matching ID
        setTodos(updatedTodos); // Updates the state with the new list
    };
    /* 
    Function to toggle the completed status of an item.
    If user clicks on an item (searches for id), it switches between completed and not completed.
    */
    const toggleComplete = (id: string) => {
        const updatedTodos = todos.map((todo) => { // Loops through each to-do item
            if (todo.id === id) { // Finds the item with the matching ID
                return {...todo, completed: !todo.completed}; // Toggles the completed status
            }
            return todo; // Returns the item unchanged if ID does not match
        });
        setTodos(updatedTodos); // Updates the state with the modified list
    };

    return (
       <div>
         <h1>Todo App</h1> {/* Title of the app */}
         {/* Every time user types in input field, onChange runs and newToDo is assigned a value */}
         <input
           type="text"
           value={newTodo}
           onChange={(e) => setNewTodo(e.target.value)}
         />
         <button onClick={addTodo}>Add Todo</button> {/* When user clicks button, addTodo function runs */}
         <ul> {/* Unordered list to display to-do items */}
           {todos.map((todo) => ( // Loops through each to-do item in the todos array
             <li key={todo.id}> {/* Each list item is assigned a unique key using the item's ID */}
               <input
                 type="checkbox"
                checked={todo.completed} // Checkbox reflects the completed status of the to-do item 
                 onChange={() => toggleComplete(todo.id)} /* When checkbox is clicked, toggleComplete function runs 
                                                            with the item's ID as argument */
               />
               <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}> {/* If item is completed, 
                                                                                            text is shown with a line through it */}
                 {todo.text} {/* Displays the text of the to-do item */}
               </span>
               <button onClick={() => removeTodo(todo.id)}>Remove</button> {/* When user clicks button, removeTodo function runs
                                                                          with the item's ID as argument */}
             </li>
           ))}
         </ul>
       </div>
    )


}

export default TodoApp;