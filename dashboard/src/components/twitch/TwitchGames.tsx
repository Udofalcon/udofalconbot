import React, { useEffect, useState } from 'react';
import SocketIO from '../../modules/Socket';

export function TwitchGames() {
    const socket = SocketIO.getSocket();
    const [ getGames, setGames ] = useState(new Array<any>());
    const [ getVotes, setVotes ] = useState(new Array<any>());
    const [ getUsers, setUsers ] = useState(new Array<any>());

    useEffect(() => {
        // socket.on('', () => {});

        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}/games`, { method: 'GET' })
            .then(async (value: Response) => {
                setGames(await value.json());
            });
    });

    function deleteGame(id: number) {
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}/game/${id}`, { method: 'DELETE' })
            .then(async (value: Response) => {
                console.log(await value.json());
            });
    }

    return (<>
        <table id="games">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>State</th>
                    <th>Started</th>
                    <th>Last Played</th>
                    <th>Image</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    getGames.map((game: any) => {
                        return <tr>
                            <td>{game.id}</td>
                            <td>{game.name}</td>
                            <td>{game.state}</td>
                            <td>{game.started}</td>
                            <td>{game.last_played}</td>
                            <td>{game.image}</td>
                            <td><button onClick={() => deleteGame(game.id)}>X</button></td>
                        </tr>;
                    })
                }
            </tbody>
        </table>
        <table id="votes">
        </table>
        <table id="users">
        </table>
    </>);
}
