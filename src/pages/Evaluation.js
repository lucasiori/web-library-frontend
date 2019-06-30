import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-rangeslider';
import queryString from 'query-string';
import api from '../services/api';

import './Evaluation.css';
import 'react-rangeslider/lib/index.css'

import arrow_down from '../assets/arrow-down.svg';
import home from '../assets/home.svg';

class Evaluation extends Component {
    state = {
        id_book: null,
        note: 0,
        comment: "",
        evaluations: [],
        validation: null
    };

    async componentDidMount() {
        await this.setState({ id_book: queryString.parse(this.props.location.search).id_book });

        const response = await api.get(`/evaluation/${this.state.id_book}`);

        this.setState({ evaluations: response.data });
    }

    handleSubmit = async e => {
        e.preventDefault();

        const data = new FormData();

        data.append('id_book', this.state.id_book);
        data.append('note', this.state.note);
        data.append('comment', this.state.comment);

        await api.post(`/evaluation/${this.state.id_book}`, data)
            .then(async (res) => {
                const evaluation = {
                    id_book: this.state.id_book,
                    note: this.state.note,
                    comment: this.state.comment
                };

                await this.setState({
                    note: 0,
                    comment: "",
                    evaluations: [evaluation, ...this.state.evaluations],
                    validation: {
                        message: "Avaliação gravada com sucesso!",
                        success: true
                    }
                });

                document.getElementById('validation-message').classList.add('fade-in-opacity');
                setTimeout(() => { this.setState({ validation: null }) }, 7000);
            })
            .catch(async (err) => {
                await this.setState({
                    validation: {
                        message: "Erro ao gravar avaliação!",
                        success: false
                    }
                });

                document.getElementById('validation-message').classList.add('fade-in-opacity');
                setTimeout(() => { this.setState({ validation: null }) }, 7000);
            });
    };

    handleCheckRating(evaluationNote) {
        if (evaluationNote <= 5) {
            return 'negative-evaluation';
        } else if (evaluationNote > 5 && evaluationNote <= 8) {
            return 'neutral-evaluation';
        } else {
            return 'positive-evaluation';
        }
    }

    handleChangeNote = value => {
        this.setState({
            note: value
        })

        const slider = document.getElementsByClassName('rangeslider__fill')[0];
        slider.classList.remove('negative-evaluation', 'neutral-evaluation', 'positive-evaluation');
        slider.classList.add(this.handleCheckRating(value))
    };

    handleChangeComment = e => {
        this.setState({
            comment: e.target.value
        })
    };

    render() {
        return (
            <section id="evaluation-list" className="flex-direction-column">

                <form id="new-evaluation" onSubmit={this.handleSubmit}>
                    <div className='slider custom-labels flex-direction-column'>
                        <Slider id="slider-note"
                            min={0}
                            max={10}
                            step={1}
                            value={this.state.note}
                            onChange={this.handleChangeNote} />

                            <label id="evaluation-note">
                                {this.state.note || "(Arraste para atribuir uma nota)"}
                            </label>

                    </div>

                    <textarea id="iptComment"
                        type="text"
                        name="comment"
                        placeholder="Comentário"
                        autoComplete="false"
                        className="style-default-input"
                        rows="5"
                        maxLength="500"
                        onChange={this.handleChangeComment}
                        value={this.state.comment} />

                    <button type="submit">Salvar</button>
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

                <div id="all-comments">
                    <img width="80" height="80" alt="Comentarios" src={arrow_down} />
                </div>

                {this.state.evaluations.map(evaluation => (
                    <article key={evaluation._id}>
                        <div className="flex-direction-row">
                            <div id="evaluation-note"
                                className={`flex-direction-row ${this.handleCheckRating(evaluation.note)}`}>
                                <label>{evaluation.note}</label>
                            </div>

                            {
                                evaluation.comment 
                                ? (<label id="evaluation-comment">{evaluation.comment}</label>)
                                : (<label id="evaluation-without-comment">(Comentário não informado)</label>)
                            }
                        </div>
                    </article>
                ))}

                <div id="redirect-main">
                    <Link to="/">
                        <img alt="Página Principal" src={home} />
                    </Link>
                </div>
            </section>
        );
    }
}

export default Evaluation;