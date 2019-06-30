import React, { Component } from 'react';
import { Line } from 'rc-progress';
import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import percent from 'percent';
import api from '../services/api';

import './Main.css';

import add from '../assets/add.svg';

class Main extends Component {
    state = {
        books: []
    };

    async componentDidMount() {
        const response = await api.get('/book');

        await this.setState({ books: response.data });

        if (!this.state.books || this.state.books.length === 0) {
            document.getElementById('validation-message').classList.add('fade-in-opacity');
        }
    }

    handleCheckBookRating(evaluationNumber, evaluationAverage) {
        if (parseInt(evaluationNumber) === 0) {
            return 'without-rating';
        }

        if (parseInt(evaluationAverage) < 5) {
            return 'negative-rating';
        } else if (parseInt(evaluationAverage) >= 5
            && parseInt(evaluationAverage) < 8) {
            return 'neutral-rating';
        } else {
            return 'positive-rating';
        }
    }

    render() {
        return (
            <section id="book-list">
                <TransitionGroup>
                    {this.state.books.map(book => (
                        <CSSTransition key={book._id} in={true} timeout={2000}
                            classNames="fade">
                            <article className={this.handleCheckBookRating(book.evaluation_number, book.evaluation_average)}>
                                <div className="flex-direction-row">
                                    <div>
                                        <img id="book-image" alt="Imagem do Livro"
                                            src={`http://localhost:3333/files/${book.image}`}></img>
                                    </div>

                                    <div id="book-info" className="flex-display-column">
                                        <div id="book-title">
                                            <label>{book.title}</label>
                                        </div>

                                        <div className="flex-direction-row" style={{ marginTop: "20px" }}>
                                            <div id="evaluation" className="flex-direction-column">
                                                <div id="positive-evaluation">
                                                    <Line percent={percent.calc(book.positive_evaluation, book.evaluation_number, 0)}
                                                        strokeWidth="4"
                                                        strokeColor="#27ce7a"
                                                        trailWidth="1"
                                                        trailColor="#CCC" />
                                                    {
                                                        book.evaluation_number > 0
                                                            ? (<label>
                                                                {
                                                                    `Avaliação Positiva - ${percent.calc(book.positive_evaluation, book.evaluation_number, 0)}%`
                                                                }
                                                            </label>)
                                                            : (null)
                                                    }
                                                </div>

                                                <div id="neutral-evaluation">
                                                    <Line percent={percent.calc(book.neutral_evaluation, book.evaluation_number, 0)}
                                                        strokeWidth="4"
                                                        strokeColor="#ffdb2ac7"
                                                        trailWidth="1"
                                                        trailColor="#CCC" />
                                                    {
                                                        book.evaluation_number > 0
                                                            ? (<label>
                                                                {
                                                                    `Avaliação Neutra - ${percent.calc(book.neutral_evaluation, book.evaluation_number, 0)}%`
                                                                }
                                                            </label>)
                                                            : (null)
                                                    }
                                                </div>

                                                <div id="negative-evaluation">
                                                    <Line percent={percent.calc(book.negative_evaluation, book.evaluation_number, 0)}
                                                        strokeWidth="4"
                                                        strokeColor="#ff1414c7"
                                                        trailWidth="1"
                                                        trailColor="#CCC" />
                                                    {
                                                        book.evaluation_number > 0
                                                            ? (<label>
                                                                {
                                                                    `Avaliação Negativa - ${percent.calc(book.negative_evaluation, book.evaluation_number, 0)}%`
                                                                }
                                                            </label>)
                                                            : (null)
                                                    }
                                                </div>

                                                <div id="total-evaluation">
                                                    <Line percent={book.evaluation_number ? 100 : 0} strokeWidth="4" strokeColor="#0184ff"
                                                        trailWidth="1" trailColor="#CCC" />
                                                    {
                                                        book.evaluation_number > 0
                                                            ? (<label>
                                                                {
                                                                    book.evaluation_number === 1
                                                                        ? "1 avaliação"
                                                                        : `${book.evaluation_number} avaliações`
                                                                }
                                                            </label>)
                                                            : (null)
                                                    }
                                                </div>
                                            </div>

                                            <div id="evaluation_average" className="flex-direction-column">
                                                {
                                                    book.evaluation_number > 0
                                                        ? (<div id="average" className="flex-direction-column"><label>{book.evaluation_average}</label></div>)
                                                        : null
                                                }

                                                <Link to={{ pathname: "/evaluation", search: `?id_book=${book._id}` }}>
                                                    <button id="evaluate">
                                                        Avaliar
                                                    </button>
                                                </Link>

                                                <Link to={{ pathname: "/register", search: `?id=${book._id}` }}>
                                                    <button id="edit">
                                                        Editar
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </CSSTransition>
                    ))}
                </TransitionGroup>

                {
                    !this.state.books || this.state.books.length === 0
                        ? (
                            <div id="validation-message" className="validation-warning">
                                <label>Nenhum registro encontrado!</label>
                            </div>
                        )
                        : null
                }

                <div id="add-book">
                    <Link to="/register">
                        <img alt="Adicionar" src={add} />
                    </Link>
                </div>
            </section>
        );
    }
}

export default Main;