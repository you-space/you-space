import { validator } from '@ioc:Adonis/Core/Validator'
import CommentIndexValidator from 'App/Validators/CommentIndexValidator'
import Comment from 'App/Models/Comment'
import CommentStoreValidator from 'App/Validators/CommentStoreValidator'
import CommentShowValidator from 'App/Validators/CommentShowValidator'
import CommentUpdateValidator from 'App/Validators/CommentUpdateValidator'

export default class CommentListener {
  public async index(payload: any) {
    const filters = await validator.validate({
      ...new CommentIndexValidator(),
      data: payload || {},
    })

    const query = Comment.query()

    query.orderBy(filters.order_by || 'created_at', filters.order_desc ? 'desc' : 'asc')

    const result = await query.paginate(filters.page || 1, filters.limit)

    return result.serialize()
  }

  public async show(payload: any) {
    const { id } = await validator.validate({
      ...new CommentShowValidator(),
      data: payload || {},
    })

    const comment = await Comment.findOrFail(id)

    return comment.serialize()
  }

  public async store(payload: any) {
    const data = await validator.validate({
      ...new CommentStoreValidator(),
      data: payload || {},
    })

    const comment = await Comment.create(data)

    return comment.serialize()
  }

  public async update(payload: any) {
    const { id, ...data } = await validator.validate({
      ...new CommentUpdateValidator(),
      data: payload || {},
    })

    const comment = await Comment.findOrFail(id)

    comment.merge(data)

    await comment.save()

    return comment.serialize()
  }

  public async destroy(id: number) {
    const comment = await Comment.findOrFail(id)

    await comment.delete()
  }
}
