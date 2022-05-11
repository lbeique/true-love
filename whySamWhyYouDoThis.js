const adjustedUser = { lookatme: 'hi', id: 416, pts: 24 }
const leaderboard = [
    { id: 123, pts: 64 }, { id: 213, pts: 46 }, { id: 221, pts: 23 }, { id: 46, pts: 23 }, { lookatme: 'hi', id: 416, pts: 21 }, { id: 264, pts: 15 }, { id: 52, pts: 14 }, { id: 12, pts: 12 }, { id: 08, pts: 10 }
]
const leaderboard2 = [
    { id: 123, pts: 64 }, { id: 213, pts: 46 }, { id: 221, pts: 23 }, { id: 46, pts: 23 }, { lookatme: 'hi', id: 416, pts: 21 }, { id: 264, pts: 15 }, { id: 52, pts: 14 }, { id: 12, pts: 12 }, { id: 08, pts: 10 }
]
function changePolePosition(leaderboard, adjustedUser) {
    for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].id === adjustedUser.id) {
            leaderboard.splice(i, 1)
        }
    }
    let highestPolePos = 0
    let allPolePos = leaderboard.length
    while (highestPolePos < allPolePos) {
        let middlePolePos = Math.floor((highestPolePos + allPolePos) >> 1)
        if (leaderboard[middlePolePos].pts > adjustedUser.pts) {
            highestPolePos = middlePolePos + 1;
        } else {
            allPolePos = middlePolePos
        }
    }
    leaderboard.splice(highestPolePos, 0, adjustedUser)
    return leaderboard
}

function handleUpdateLeaderboard(leaderboard, adjustedUser) {
    for (const entry of leaderboard) {
        entry.id = adjustedUser.id
        entry.pts = adjustedUser.pts
    }
leaderboard.sort((b, a) => (a.points > b.points) ? 1 : ((b.points > a.points) ? -1 : 0))
return leaderboard
}

console.time()
console.log('New Pole Position', changePolePosition(leaderboard, adjustedUser))
console.timeEnd()

console.time()
console.log('New Pole Position', handleUpdateLeaderboard(leaderboard2, adjustedUser))
console.timeEnd()