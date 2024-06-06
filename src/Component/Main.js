import React, { useState, useEffect } from 'react';
import './Main.css';
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function Main() {
    const [taskForms, setTaskForms] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [selectedTab, setSelectedTab] = useState('current');

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        const storedCompletedTasks = localStorage.getItem('completedTasks');
        if (storedTasks) {
            setTaskForms(JSON.parse(storedTasks));
        }
        if (storedCompletedTasks) {
            setCompletedTasks(JSON.parse(storedCompletedTasks));
        }
    }, []);

    const addForm = () => {
        setTaskForms([...taskForms, { taskDetails: '', taskDesc: '', dueDate: '', editing: true }]);
    };

    const handleEdit = (index) => {
        const updatedForms = [...taskForms];
        updatedForms[index].editing = true;
        setTaskForms(updatedForms);
    };

    const handleSave = (index) => {
        const updatedForms = [...taskForms];
        const task = updatedForms[index];

        if (!task.taskDetails || !task.taskDesc || !task.dueDate) {
            alert('Please fill out all fields.');
            return;
        }

        updatedForms[index].editing = false;
        localStorage.setItem('tasks', JSON.stringify(updatedForms));
        setTaskForms(updatedForms);
    };

    const handleComplete = (index) => {
        const updatedForms = [...taskForms];
        const completedTask = updatedForms.splice(index, 1)[0];
        setTaskForms(updatedForms);
        setCompletedTasks([...completedTasks, completedTask]);
        localStorage.setItem('tasks', JSON.stringify(updatedForms));
        localStorage.setItem('completedTasks', JSON.stringify([...completedTasks, completedTask]));
    };

    const handleDelete = (index, type) => {
        if (type === 'current') {
            const updatedForms = [...taskForms];
            updatedForms.splice(index, 1);
            setTaskForms(updatedForms);
            localStorage.setItem('tasks', JSON.stringify(updatedForms));
        } else {
            const updatedCompletedTasks = [...completedTasks];
            updatedCompletedTasks.splice(index, 1);
            setCompletedTasks(updatedCompletedTasks);
            localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
        }
    };

    const handleInputChange = (index, e) => {
        const updatedForms = [...taskForms];
        updatedForms[index][e.target.name] = e.target.value;
        setTaskForms(updatedForms);
    };

    const renderTasks = (tasks, type) => {
        return tasks.map((task, index) => (
            <div className="task-form" key={index}>
                <form>
                    <div className="form-group">
                        <label>Task Details:</label>
                        <input
                            type="text"
                            className="taskDetails"
                            name="taskDetails"
                            value={task.taskDetails}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            disabled={!task.editing}
                        />
                    </div>
                    <div className="form-group">
                        <label>Task Description:</label>
                        <textarea
                            className="taskDesc"
                            name="taskDesc"
                            value={task.taskDesc}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            disabled={!task.editing}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Due Date:</label>
                        <input
                            type="date"
                            className="dueDate"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            disabled={!task.editing}
                        />
                    </div>
                    <div className="form-buttons">
                        {task.editing ? (
                            <button 
                                type="button" 
                                className="save-btn" 
                                onClick={() => handleSave(index)}
                                disabled={!task.taskDetails || !task.taskDesc || !task.dueDate}
                            >
                                Save
                            </button>
                        ) : (
                            <>
                                {type === 'current' && (
                                    <>
                                        <button type="button" className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                                        <button type="button" className="complete-btn" onClick={() => handleComplete(index)}>Mark as Complete</button>
                                    </>
                                )}
                                <button type="button" className="delete-btn" onClick={() => handleDelete(index, type)}><MdDelete /></button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        ));
    };

    return (
        <div className='container'>
            <nav>
                <em>Task Management Application</em>
                <CiCirclePlus className='plus_icon' onClick={addForm} />
            </nav>
            <div className="tabs">
                <button className={selectedTab === 'current' ? 'active' : ''} onClick={() => setSelectedTab('current')}>Current Tasks</button>
                <button className={selectedTab === 'completed' ? 'active' : ''} onClick={() => setSelectedTab('completed')}>Completed Tasks</button>
            </div>
            <div className="task-list">
                {selectedTab === 'current' ? renderTasks(taskForms, 'current') : renderTasks(completedTasks, 'completed')}
            </div>
        </div>
    );
}

export default Main;
