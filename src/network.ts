const decoder = new TextDecoder();
let socket: WebSocket;

export function challenge(username: string) {
    // const res = await fetch('http://localhost:3000/challenge', {
    //     method: "POST",
    //     body: JSON.stringify({challenger: username})
    // })
    // const body = await res.json()
    socket = new WebSocket("ws://localhost:3000")
    socket.addEventListener("open", () => {
        socket.send("player")
    })

    socket.addEventListener("message", (message) => {
        console.log(message.data)
    })

    return socket
}

export function send(data: string) {
    if (!socket) return
    socket.send(data)
}


export function spectate(): WebSocket {
    const socket = new WebSocket("ws://localhost:3000")

    socket.addEventListener("open", () => {
        socket.send("spectate")
    })

    socket.addEventListener("message", function (message) {
        console.log(message.data)
    })

    return socket
}