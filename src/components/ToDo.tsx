import { useState } from 'react';
import '../styles/ToDo.css';

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

    // States for inline editing
    const [editId, setEditId] = useState<string | null>(null);
    const [draftText, setDraftText] = useState<string>("");


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

    // On key down handler for editing
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && draftText.trim().length > 0 && editId !== null) { // If Enter is pressed and draftText is not empty
        editTodo(editId, draftText.trim()); // Save the changes
        setEditId(null); // Exit edit mode
        setDraftText(""); // Clear draft text
      }
      if (e.key === 'Escape') { // If Escape is pressed
        setEditId(null); // Exit edit mode without saving
        setDraftText(""); // Clear draft text
      }
    }

    return (
    <div className="board">
       <div className="column">
         <h1 className="title">To-Do</h1> {/* Title of the app */}
         <div className="counter">Tasks: {todos.length}</div>
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
           {todos.map((todo) => ( // Loops through each to-do item in the todos array
             <li 
               key={todo.id} 
               className={`item ${todo.completed ? 'completed' : ''}`} // Add base class and completed class if true
             > {/* Each list item is assigned a unique key using the item's ID */}
               <input
                 type="checkbox"
                 checked={todo.completed} // Checkbox reflects the completed status of the to-do item 
                 onChange={() => toggleComplete(todo.id)} /* When checkbox is clicked, toggleComplete function runs 
                                                            with the item's ID as argument */
               />
               {/* If item is completed, text is shown with a line through it */}
              {editId === todo.id ? ( // If the current item is being edited
                <input 
                className="input"
                value={draftText} 
                autoFocus
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setDraftText(e.target.value)}
                onBlur={() => { // When input loses focus, save changes if valid
                  if (draftText.trim().length > 0 && editId) { // Ensure editId is not null
                    editTodo(editId, draftText.trim()); // Save the changes
                  }
                  setEditId(null); 
                  setDraftText(""); 
                }}></input>
              ) : (
                <span
                  className="text"
                  onClick={() => { // When user clicks on the text, enable edit mode 
                    setEditId(todo.id);
                    setDraftText(todo.text);
                  }}
                >
                  {todo.text}
                </span>
              )}
               <button className="btn btn-danger" onClick={() => removeTodo(todo.id)}>Remove</button> {/* When user clicks button, removeTodo function runs
                                                                          with the item's ID as argument */}
             </li>
           ))}
         </ul>
       </div>
    </div>
    )}

export default TodoApp;