import React, {useEffect, useRef, useState} from "react";
import "../../styles/board.css";
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";

function Board() {

    const population = useRef();
    const [needsRerender, setNeedsRerender] = useState(false);
    const currentGeneration = useRef([]);
    const aliveCount = useRef(0);
    const deadCount = useRef(0);
    const canvasRef = useRef();

    function generateRandomSeed(event) {
        event.preventDefault(); //prevent form"s default submitting behavior
        if (currentGeneration.current.length === 0) {

            population.current = 250;
            for (let i = 0; i < population.current; i++) {
                currentGeneration.current[i] = [];
                for (let j = 0; j < population.current; j++) {
                    currentGeneration.current[i][j] = Math.round(Math.random()); //random number between 0 and 1s inclusive
                }
            }
            canvasRef.current.width = population.current;
            canvasRef.current.height = population.current;
            draw();
            countDeadAlive();

        }
    }

    function countDeadAlive() {
        aliveCount.current = 0;
        deadCount.current = 0;
        for (let i = 0; i < currentGeneration.current.length; i++) {
            for (let j = 0; j < currentGeneration.current[i].length; j++) {
                if (currentGeneration.current[i][j] === 1) {
                    aliveCount.current++;
                } else {
                    deadCount.current++;
                }
            }
        }
    }

    function generateNextGeneration() {
        let numOfAliveNeighbors = 0;
        for (let row = 0; row < population.current; row++) {
            for (let column = 0; column < population.current; column++) {
                numOfAliveNeighbors = 0; // Resets the number of neighbors for each cell
                /*
                 * Bottom-right/bottom-left/bottom neighbor checking
                 */
                if (row < population.current - 1) { // room to move down
                    if (column < population.current - 1) { // room to move right
                        if (currentGeneration.current[row + 1][column + 1] === 1) { // bottom right neighbor alive?
                            numOfAliveNeighbors++;
                        }
                    }
                    if (column > 0) { // Only room to move left
                        if (currentGeneration.current[row + 1][column - 1] === 1) { // bottom left neighbor alive?
                            numOfAliveNeighbors++;
                        }
                    }
                    if (currentGeneration.current[row + 1][column] === 1) { // bottom neighbor alive?
                        numOfAliveNeighbors++;
                    }
                }

                /*
                 * Top-right/top-left/top neighbor checking
                 */
                if (row > 0) { // room to move up
                    if (column < population.current - 1) { // room to move right
                        if (currentGeneration.current[row - 1][column + 1] === 1) { // top right neighbor alive?
                            numOfAliveNeighbors++;
                        }
                    }
                    if (column > 0) {// Only room to move left
                        if (currentGeneration.current[row - 1][column - 1] === 1) { // top left neighbor alive?
                            numOfAliveNeighbors++;
                        }
                    }
                    if (currentGeneration.current[row - 1][column] === 1) { // top neighbor alive?
                        numOfAliveNeighbors++;
                    }
                }

                /*
                 * Left-side neighbor checking
                 */
                if (column > 0) { // Room to move left?
                    if (currentGeneration.current[row][column - 1] === 1) { // left neighbor alive?
                        numOfAliveNeighbors++;
                    }
                }

                /*
                 * Right-side neighbor checking
                 */
                if (column < population.current - 1) { // room to move right?
                    if (currentGeneration.current[row][column + 1] === 1) { // right neighbor alive?
                        numOfAliveNeighbors++;
                    }
                }

                /*
                 * Determines whether or not cell should be alive based on rules of Conway"s
                 * Game of Life
                 */
                if (currentGeneration.current[row][column] === 1) {
                    if (numOfAliveNeighbors < 2) {
                        currentGeneration.current[row][column] = 0; // cell dies with fewer than 2 alive neighbors
                    } else if (numOfAliveNeighbors === 2 || numOfAliveNeighbors === 3) {
                        // Nothing happens to cell
                    } else if (numOfAliveNeighbors > 3) {
                        currentGeneration.current[row][column] = 0; // cell dies with more than 3 alive neighbors
                    }
                } else if (currentGeneration.current[row][column] === 0) {
                    if (numOfAliveNeighbors === 3) {
                        currentGeneration.current[row][column] = 1; // Cell becomes alive because it has 3 neighbors
                    }
                }
            }
        }
        draw();
        countDeadAlive();
    }

    useEffect(() => {
        if (needsRerender === true) {
            setNeedsRerender(false);
        }
    }, [needsRerender])

    function draw() {
        const context = canvasRef.current.getContext("2d");
        for (let i = 0; i < currentGeneration.current.length; i++) {
            for (let j = 0; j < currentGeneration.current.length; j++) {
                context.fillRect(i, j, 5, 5);
                context.fillStyle = currentGeneration.current[i][j] === 1 ? "green" : "white";
                context.stroke();
            }
        }
        setNeedsRerender(true);
        setTimeout(() => generateNextGeneration(), 50);
    }

    const text = `Alive: ${aliveCount.current}. Dead: ${deadCount.current}.`;

    return (
        <div className="container">
            <Button type="submit" onClick={generateRandomSeed} variant="contained">START</Button>
            <p>{text}</p>
            <p>The universe of the Game of Life is an infinite, two-dimensional orthogonal grid
                of square <i>cells</i>, each of which is in one of two possible states, <i>live</i> or <i>dead</i>,
                (or <i>populated</i> and <i>unpopulated</i>, respectively). Every cell interacts with its
                eight <i>neighbours</i>, which are the cells
                that are horizontally, vertically, or diagonally adjacent. At each step in time, the following
                transitions occur:
            </p>
            <ol>
                <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
                <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
                <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
                <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
            </ol>
            <canvas ref={canvasRef}>You need Javascript enabled to be able to use
                this.
            </canvas>

        </div>
    )
}

export default Board;