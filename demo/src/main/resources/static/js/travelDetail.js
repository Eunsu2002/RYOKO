
const params = new URLSearchParams(window.location.search)
const placeId = params.get('id')

console.log(placeId)

async function loadPlaceDetail(placeId) {
    try {
        const res = await fetch(`/api/places/{placeId}`)

        if (!res.ok) {
            throw new Error(`서버 응답 에러: ${res.status}`)
        }


    }

}