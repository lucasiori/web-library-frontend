import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import api from '../services/api';

import './Register.css';

import home from '../assets/home.svg';

class Register extends Component {
    state = {
        title: "",
        author: "",
        image: null,
        validation: null,
        id_book_edit: null,
        show_message_confirm_delete: false
    };

    async componentDidMount() {
        if (queryString.parse(this.props.location.search).id) {
            await this.setState({ id_book_edit: queryString.parse(this.props.location.search).id });
            
            const response = await api.get(`/book/${this.state.id_book_edit}`);

            if (response && response.data) {
                this.setState({
                    title: response.data.title,
                    author: response.data.author
                });
            }

        }
    }

    handleSubmit = async e => {
        e.preventDefault();

        const data = new FormData();

        data.append('title', this.state.title);
        data.append('author', this.state.author);
        data.append('image', this.state.image);

        if (!this.state.id_book_edit) {
            await api.post('book', data)
                .then(async (res) => {
                    this.requestSuccess();
                }).catch(async (err) => {
                    this.requestError();
                });
        } else {
            await api.put(`book/${this.state.id_book_edit}`, data)
                .then(async (res) => {
                    this.requestSuccess();
                }).catch(async (err) => {
                    this.requestError();
                });
        }
    };

    handleImageChange = e => {
        this.setState({ image: e.target.files[0] });
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleImageSearch = e => {
        document.getElementById('iptImage').click();
    }

    handleDelete = async e => {
        this.handleHideMessageConfirmDelete();

        await api.delete(`book/${this.state.id_book_edit}`)
            .then(async (res) => {
                this.setState({
                    title: "",
                    author: "",
                    image: null,
                    validation: {
                        message: "Registro excluído com sucesso!",
                        success: true
                    }
                });

                document.getElementById('validation-message').classList.add('fade-in-opacity');
                setTimeout(() => { this.props.history.push('/'); }, 3000);
            }).catch(async (err) => {
                this.setState({
                    validation: {
                        message: "Erro ao excluir registro!",
                        success: false
                    }
                });
            });
    }

    handleShowMessageConfirmDelete = async () => {
        await this.setState({show_message_confirm_delete: true});
        document.getElementById('message-confirm-delete').classList.add('fade-in-opacity');
    }

    handleHideMessageConfirmDelete = async () => {
        await this.setState({show_message_confirm_delete: false});
    }

    requestSuccess = async () => {
        await this.setState({
            title: !this.state.id_book_edit ? "" : this.state.title,
            author: !this.state.id_book_edit ? "" : this.state.author,
            image: !this.state.id_book_edit ? null : this.state.image,
            validation: {
                message: !this.state.id_book_edit 
                ? "Registro inserido com sucesso!"
                : "Registro atualizado com sucesso!",
                success: true
            }
        });

        document.getElementById('validation-message').classList.add('fade-in-opacity');
        setTimeout(() => { this.setState({ validation: null }) }, 7000);
    }

    requestError = async () => {
        await this.setState({
            validation: {
                message: !this.state.id_book_edit 
                ? "Erro ao inserir registro!"
                : "Erro ao atualizar registro!",
                success: false
            }
        });

        document.getElementById('validation-message').classList.add('fade-in-opacity');
        setTimeout(() => { this.setState({ validation: null }) }, 7000);
    }

    render() {
        return (
            <section>
                <form id="new-book" onSubmit={this.handleSubmit}>
                    <input id="iptTitle"
                        type="text"
                        name="title"
                        placeholder="Título do livro"
                        autoComplete="false"
                        required="required"
                        className="style-default-input"
                        onChange={this.handleChange}
                        value={this.state.title} />

                    <input id="iptAuthor"
                        type="text"
                        name="author"
                        placeholder="Autor do livro"
                        autoComplete="false"
                        className="style-default-input"
                        required="required"
                        onChange={this.handleChange}
                        value={this.state.author} />

                    <input id="iptImage"
                        type="file"
                        name="fileImage"
                        hidden={true}
                        onChange={this.handleImageChange} />

                    <button id="btnImage"
                        type="button"
                        onClick={this.handleImageSearch}>
                        <label id="lblImage"
                            htmlFor="iptImage"
                            style={{ cursor: "pointer" }}>
                            {this.state.image ? this.state.image.name : "Escolher Arquivo"}
                        </label>
                    </button>

                    {
                        !this.state.id_book_edit
                        ? ( <button type="submit">Salvar</button> )
                        : ( 
                            <div id="controls-edit">
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={this.handleShowMessageConfirmDelete}>Excluir</button> 
                            </div>
                        )
                    }
                   
                </form>

                {
                    this.state.validation
                        ? (
                            <div id="validation-message"
                                className={this.state.validation.success ? "validation-success" : "validation-error"}>
                                <label>{this.state.validation.message}</label>
                            </div>
                        )
                        : null
                }

                {
                    this.state.show_message_confirm_delete
                    ? (
                        <div id="message-confirm-delete" className="validation-info flex-direction-row">
                            <label>Confirma a exclusão do registro?</label>
                            <button id="button-confirm-delete" type="button" onClick={this.handleDelete}>Sim</button>
                            <button id="button-not-confirm-delete" type="button" onClick={this.handleHideMessageConfirmDelete}>Não</button>
                        </div>
                    )
                    : null
                }

                <div id="redirect-main">
                    <Link to="/">
                        <img alt="Página Principal" src={home} />
                    </Link>
                </div>
            </section>
        );
    }
}

export default Register;