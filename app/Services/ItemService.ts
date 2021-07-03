import lodash from 'lodash'

import ItemType from 'App/Models/ItemType'
import Item from 'App/Models/Item'
import ItemTypeField from 'App/Models/ItemTypeField'
import ItemField from 'App/Models/ItemField'

export function serializedItemByType(type: ItemType, item: Item, includeOriginalValues = false) {
  const typeFields: ItemTypeField[] = lodash.get(type, 'fields', [])
  const itemFields: ItemField[] = lodash.get(item, 'fields', [])

  const itemValues = typeFields.map((f) => {
    const itemField = itemFields.find((m) => m.name === f.name)
    return { name: f.name, value: itemField ? itemField.serialize().value : undefined }
  })

  const originalValues = typeFields.map((f) => ({
    name: f.name,
    value: lodash.get(item.value, f.options.mapValue || f.name),
  }))

  const values = typeFields.reduce((all, f) => {
    const meta = itemValues.find((m) => m.name === f.name)
    const original = originalValues.find((o) => o.name === f.name)

    const currentValues = {
      ...all,
      [f.name]: meta?.value || original?.value,
    }

    if (includeOriginalValues) {
      return {
        ...currentValues,
        [`original:${f?.name}`]: original?.value,
      }
    }

    return currentValues
  }, {})

  return {
    id: item.id,
    sourceId: item.sourceId,

    typeId: type.id,
    typeName: type.name,

    visibilityId: item.visibilityId,
    visibilityName: item.visibility?.name,

    ...values,
  }
}
