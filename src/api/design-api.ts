import axios from '@/lib/axios'

const cacheIds = [] as string[]
export const getDesignUniqueId = async () => {
  Promise.resolve(cacheIds.pop()).then(id => {
    if (id == undefined) {
      axios.get('/systemCentre/design/uniqueId', {
        params: { size: 10 },
      }).then
    }
  })

  return id
}
