import React, { Component } from "react";
import axios from "axios";
import update from "immutability-helper";

class TodoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
        };
    }

    loadtodo() {
        axios
            .get("/api/v1/todos")
            .then((res) => {
                this.setState({ todos: res.data });
            })
            .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.loadtodo();
    }

    newTodo = (e) => {
        if (e.key === "Enter" && !(e.target.value === "")) {
            axios
                .post("/api/v1/todos", { todo: { title: e.target.value } })
                .then((res) => {
                    const todos = update(this.state.todos, {
                        $splice: [[0, 0, res.data]],
                    });

                    this.setState({
                        todos: todos,
                        inputValue: "",
                    });

                    this.state = {
                        todos: [],
                        inputValue: "",
                    };

                    this.setState({
                        todos: todos,
                        inputValue: "",
                    });
                })
                .catch((error) => console.log(error));
        }
    };

    handleChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    modifyTodo = (e, id) => {
        axios
            .put(`/api/v1/todos/${id}`, { todo: { done: e.target.checked } })
            .then((res) => {
                const todoIndex = this.state.todos.findIndex(
                    (x) => x.id === res.data.id
                );
                const todos = update(this.state.todos, {
                    [todoIndex]: { $set: res.data },
                });
                this.setState({
                    todos: todos,
                });
            })
            .catch((error) => console.log(error));
    };

    removeTodo = (id) => {
        axios
            .delete(`/api/v1/todos/${id}`)
            .then((res) => {
                const todoIndex = this.state.todos.findIndex((x) => x.id === id);
                const todos = update(this.state.todos, {
                    $splice: [[todoIndex, 1]],
                });
                this.setState({
                    todos: todos,
                });
            })
            .catch((error) => console.log(error));
    };

    render() {
        return (
            <div>
                <div className="taskContainer">
                    <input
                        className="newTask"
                        type="text"
                        placeholder="Input a New Task and Press Enter"
                        maxLength="75"
                        onKeyPress={this.newTodo}
                        value={this.state.inputValue}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="wrapItems">
                    <ul className="listItems">
                        {this.state.todos.map((todo) => {
                            return (
                                <li className="item" todo={todo} key={todo.id}>
                                    <input
                                        className="itemCheckbox"
                                        type="checkbox"
                                        onChange={(e) => this.modifyTodo(e, todo.id)}
                                    />
                                    <label className="itemDisplay">{todo.title}</label>
                                    <span
                                        className="removeItemButton"
                                        onClick={(e) => this.removeTodo(todo.id)}
                                    >x</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default TodoContainer;