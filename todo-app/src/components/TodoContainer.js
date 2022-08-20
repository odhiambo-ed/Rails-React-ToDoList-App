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
                .post("/api/v1/todos", { tdlist: { title: e.target.value } })
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
                    />
                </div>
                <div className="wrapItems">
                    <ul className="listItems">
                        {this.state.todos.map((tdlist) => {
                            return (
                                <li className="item" tdlist={tdlist} key={tdlist.id}>
                                    <input className="itemCheckbox" type="checkbox" />
                                    <label className="itemDisplay">{tdlist.title}</label>
                                    <span className="removeItemButton">x</span>
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