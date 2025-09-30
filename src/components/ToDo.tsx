import { useState, useEffect } from 'react';
import '../styles/ToDo.css';
import TodoItem from './TodoItem';

const TodoApp = () => {

    // Holds list of to-do items
    const [todos, setTodos] = useState<TodoItem[]>(() => { // Lazy initialization to load from local storage
      const saved = localStorage.getItem('todos');
      if (saved == null) {
        return [];
      } else {
        try {
          return JSON.parse(saved); // Parses the JSON string back into an array of to-do items
        } catch (e) {
          console.error("Failed to parse todos from localStorage:", e);
          return [];
        }
      }
    }); 
    useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos)); // Saves todos to local storage whenever they change
    }, [todos]);
    // Holds current value of new to-do input field
    const [newTodo, setNewTodo] = useState<string>("");

    // Function to validate new to-do input
    const validNewTodo = () => newTodo.trim().length > 0; 

    // Function to add a new to-do item
    const addTodo = () => { 
        if (validNewTodo()) {
            const newId = crypto.randomUUID(); // Generates a Universally Unique Identifier (UUID)
            /* Creates new to-do item object, initialised with the generated UUID, 
            input text, and a default completed status of false */             
            const newTodoItem: TodoItem = {
                id: newId,
                text: newTodo,
                completed: false
            };
            setTodos(prev => [...prev, newTodoItem]); // Append the new item to the current todos list safely
            setNewTodo(''); // Resets input field for next entry
        }
    };
    // Function to edit an item
    const editTodo = (id:string, newText:string) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return {...todo, text: newText};
            }
            return todo;
        })
        setTodos(updatedTodos);
    }
    
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
    <div className="board">
       <div className="column">
         <div className="header">
           <div>
             <h1 className="title">To-Do</h1> {/* Title of the app */}
             <div className="counter">Tasks: {todos.length}</div>
           </div>
           {todos.length > 0 && (
             <button className="btn btn-clear" onClick={() => {setTodos([])}}>Clear all</button>
           )}
         </div>
         {/* Input row groups the input and button nicely */}
         <div className="input-row">
           {/* Every time user types in input field, onChange runs and newToDo is assigned a value */}
           <input
             className="input"
             type="text"
             placeholder="What needs to be done today?"
             value={newTodo}
             onChange={(e) => setNewTodo(e.target.value)}
             onKeyDown={e => { if (e.key === 'Enter' && validNewTodo()) addTodo(); }} // Allows user to press Enter to add a new to-do
           />
           <button className="btn" onClick={addTodo} disabled={!validNewTodo()}>Add To-do</button> {/* When user clicks button, addTodo function runs */}
         </div>

         <ul className="list"> {/* Unordered list to display to-do items */}
          {todos.map((todo) => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={toggleComplete} 
              onEdit={editTodo} 
              onRemove={removeTodo} 
            />
          ))}
         </ul>
       </div>
    </div>
    )}

export default TodoApp;