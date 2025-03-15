
export async function challenge(username: string) {
    const res = await fetch('http://localhost:3000/challenge', {
        method: "POST",
        body: JSON.stringify({challenger: username})
    })
    const body = await res.json()
    console.log(body);
}