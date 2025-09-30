import { useState } from "react";

interface TodoItem {
    id: string,
    text: string,
    completed: boolean
}

interface TodoItemProps {
    todo: TodoItem,
    onToggle: (arg: string) => void,
    onEdit: (arg1: string, arg2: string) => void,
    onRemove: (arg: string) => void,
}

const TodoItem = (props: TodoItemProps) => {

    const [isEdited, setIsEdited] = useState(false);
    const [draftText, setDraftText] = useState("");

        // On key down handler for editing
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && draftText.trim().length > 0 && isEdited === true) { // If Enter is pressed and draftText is not empty
        props.onEdit(props.todo.id, draftText.trim()); // Save the changes
        setIsEdited(false); // Exit edit mode
        setDraftText(""); // Clear draft text
      }
      if (e.key === 'Escape') { // If Escape is pressed
        setIsEdited(false); // Exit edit mode without saving
        setDraftText(""); // Clear draft text
      }
    }

    return (
        <li 
               className={`item ${props.todo.completed ? 'completed' : ''}`} // Add base class and completed class if true
             > {/* Each list item is assigned a unique key using the item's ID */}
               <input
                 type="checkbox"
                 checked={props.todo.completed} // Checkbox reflects the completed status of the to-do item 
                 onChange={() => props.onToggle(props.todo.id)} /* When checkbox is clicked, toggleComplete function runs 
                                                            with the item's ID as argument */
               />
               {/* If item is completed, text is shown with a line through it */}
              {isEdited ? ( // If the current item is being edited
                <input 
                className="input"
                value={draftText} 
                autoFocus
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setDraftText(e.target.value)}
                onBlur={() => { // When input loses focus, save changes if valid
                  if (draftText.trim().length > 0 && isEdited) { // Ensure editId is not null
                    props.onEdit(props.todo.id, draftText.trim()); // Save the changes
                  }
                  setIsEdited(false); 
                  setDraftText(""); 
                }}></input>
              ) : (
                <span
                  className="text"
                  onClick={() => { // When user clicks on the text, enable edit mode 
                    setIsEdited(true);
                    setDraftText(props.todo.text);
                  }}
                >
                  {props.todo.text}
                </span>
              )}
               <button className="btn btn-danger" onClick={() => props.onRemove(props.todo.id)}>Remove</button> {/* When user clicks button, removeTodo function runs
                                                                          with the item's ID as argument */}
             </li> 
    )
}

export default TodoItem;