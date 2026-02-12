import request from '@/utils/request'

// 获取课程评价列表
export const commentGetListService = (courseId) =>
  request.get('/api/reviews', { params: { courseId } })

// 发布课程评价
export const commentAddService = (data) =>
  request.post('/api/reviews', {
    data,
  })
