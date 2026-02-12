import request from '@/utils/request'

// 分类：
// 获取课程分类列表
export const subGetChannelService = (list) => request.get('/api/categories', { params: list })

// 添加课程分类
export const subAddChannelService = ({ name, desc }) =>
  request.post('/api/categories', {
    name,
    desc,
  })

// 编辑课程分类
export const subEditChannelService = (data) => request.put('/api/info', data)

// 删除课程分类
export const subDeleteChannelService = (id) =>
  request.delete('/api/auth/delete', {
    params: { id },
  })

// 课程：
// 获取课程列表
export const subGetSubjectService = (params) => request.get('/api/courses', { params })

// 添加课程
export const subAddSubjectService = (data) => request.post('/api/courses', data)

// 编辑课程
export const subEditSubjectService = (data) => request.put('/api/course/info', data)

// 删除课程
export const subDeleteSubjectService = (id) =>
  request.delete('/api/sub/del', {
    params: { id },
  })

// 选课
// 选课操作
export const subSelectSubjectService = (ids) => request.post('/api/enrollments', { ids })

// 查询选课信息
export const subGetSelectInfoService = (courseId) =>
  request.get('/api/enrollments', { params: { courseId } })

// 获取课程详情
export const subGetSubjectDetailService = (courseId) => request.get(`/api/courses/${courseId}`)

// 退课
export const subDropSubjectService = (courseId) => request.post('/api/enrollments', { courseId })
