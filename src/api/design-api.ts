// import axios from '@/config/axios-config'
import axios from 'axios'
/**
 * 获取id数据并缓存数据
 */
const cacheIds = [] as string[]
export const getDesignUniqueId = async (): Promise<string> => {
  let id = cacheIds.pop()
  if (id == null || cacheIds.length < 10) {
    const response = await axios.get<string[]>(
      '/systemCentre/design/uniqueId',
      {
        params: { size: 50 },
      },
    )
    id = response.data.pop()
    cacheIds.push(...response.data)
  }
  return Promise.resolve(id!)
}
