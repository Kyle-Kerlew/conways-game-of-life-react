import React from 'react';

function Cell(isAlive) {
    console.log("Generating Cell. is it alive?", isAlive)
    return (
        <p style={{color: 'white', fontSize: '60px'}}>
            {isAlive ? '*' : '.'}
        </p>
    )
}

export default Cell;