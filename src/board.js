import React, { Component } from "react";
import $ from "jquery";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          name: "Good",
          cards: [
            {
              id: 0,
              body: "Hi, this is good"
            },
            {
              id: 1,
              body: "Very good indeed!"
            }
          ]
        },
        {
          name: "To Improve",
          cards: [
            {
              id: 2,
              body: "I'm a little worried!"
            }
          ]
        },
        {
          name: "Not Good",
          cards: [
            {
              id: 3,
              body: "This is terrible!"
            }
          ]
        }
      ]
    };
  }

  moveCard({ from, to, card, after }) {
    this.setState(state => {
      const { columns } = state;
      columns[from].cards = columns[from].cards.filter(c => c.id !== card.id);
      columns[to].cards = [].concat(
        columns[to].cards.slice(0, after),
        card,
        columns[to].cards.slice(after)
      );
      return { columns };
    });
  }

  render() {
    const { columns } = this.state;
    return (
      <div
        className={"Board"}
        children={columns.map((c, columnIndex) => (
          <div
            className={"Column"}
            onDragEnter={ev => {
              ev.preventDefault();
              this.lastColumnHovered = columnIndex;
              $(`.Column:nth-child(${columnIndex + 1})`).attr(
                "drop-active",
                "1"
              );
            }}
            onDragExit={ev => {
              ev.preventDefault();
              $(`.Column:nth-child(${columnIndex + 1})`).removeAttr(
                "drop-active"
              );
            }}
            onDragEnd={ev => {
              ev.preventDefault();
              const payload = JSON.parse(
                ev.dataTransfer.getData("application/json")
              );
              this.moveCard({
                from: payload.from,
                to: this.lastColumnHovered,
                card: payload.card,
                after: this.lastCardHovered
              });
            }}
          >
            <div className={"name"}>{c.name}</div>
            <div
              className={"Cards"}
              children={c.cards.map((card, cardIndex) => (
                <div
                  className={"Card"}
                  draggable
                  onDragStart={ev => {
                    ev.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({
                        from: columnIndex,
                        card: card
                      })
                    );
                  }}
                  onDragOver={() => {
                    this.lastCardHovered = cardIndex;
                  }}
                >
                  <div className={"body"}>{card.body}</div>
                </div>
              ))}
            />
            <div
              className={"Foot"}
              onDragOver={() => {
                this.lastCardHovered = c.cards.length;
              }}
            />
          </div>
        ))}
      />
    );
  }
}
